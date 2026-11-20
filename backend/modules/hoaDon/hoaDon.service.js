// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// SERVICE XỬ LÝ HÓA ĐƠN & KẾ TOÁN THU NGÂN (FIGMA P01, P02, P03, P04, P05, C09, C10)
// ============================================================================

const hoaDonModel = require('./hoaDon.model');
const banAnModel = require('../banAn/banAn.model');
const { chayGiaoDich, thucThi } = require('../../cauHinh/ketNoiCoSoDuLieu');
const { socketPhat } = require('../../cauHinh/cauHinhSocket');
const { ghiAuditLog } = require('../../tienIch/ghiNhatKy');
const cauHinh = require('../../cauHinh/cauHinhChung');

const NGAN_HANG_MAC_DINH = {
    bankId: 'ICB', // VietinBank
    accountNo: '102872394829',
    accountName: 'NHA HANG QUAN MOC',
    template: 'compact2'
};

const hoaDonService = {
    /**
     * Lấy danh sách hóa đơn theo bộ lọc
     */
    async layDanhSachHoaDon(boLoc = {}) {
        return hoaDonModel.layDanhSach(boLoc);
    },

    /**
     * Lấy chi tiết hóa đơn theo ID kèm các món
     */
    async layChiTietHoaDon(hoaDonId) {
        const hoaDon = hoaDonModel.timTheoId(hoaDonId);
        if (!hoaDon) {
            throw new Error('Không tìm thấy hóa đơn');
        }
        const danhSachMon = hoaDonModel.layChiTietHoaDon(hoaDonId);
        const chiaTien = hoaDonModel.layChiaTienNhom(hoaDonId);

        // Tạo đường link VietQR động
        const maVietQrUrl = `https://img.vietqr.io/image/${NGAN_HANG_MAC_DINH.bankId}-${NGAN_HANG_MAC_DINH.accountNo}-${NGAN_HANG_MAC_DINH.template}.png?amount=${hoaDon.tong_tien_thanh_toan}&addInfo=${encodeURIComponent('MOC HD ' + hoaDon.ma_hoa_don)}&accountName=${encodeURIComponent(NGAN_HANG_MAC_DINH.accountName)}`;

        return {
            ...hoaDon,
            danhSachMon,
            chiaTien,
            vietQr: {
                nganHang: NGAN_HANG_MAC_DINH.bankId,
                soTaiKhoan: NGAN_HANG_MAC_DINH.accountNo,
                tenChuTaiKhoan: NGAN_HANG_MAC_DINH.accountName,
                soTien: hoaDon.tong_tien_thanh_toan,
                noiDung: `MOC HD ${hoaDon.ma_hoa_don}`,
                qrUrl: maVietQrUrl
            }
        };
    },

    /**
     * Tính tạm tính cho bàn ăn (Figma P02, C09)
     */
    async layTamTinhTheoBan(banId, chietKhau = 0) {
        const phienBan = banAnModel.layPhienBanHienTai(banId);
        if (!phienBan) {
            throw new Error('Bàn ăn hiện không có phiên hoạt động nào');
        }

        const ban = banAnModel.timTheoId(banId);
        const danhSachMon = hoaDonModel.layMonThucTeCuaPhien(phienBan.id);

        let tongTienMon = 0;
        danhSachMon.forEach(m => {
            tongTienMon += m.tong_thanh_tien;
        });

        const phanTramChietKhau = Math.max(0, Math.min(100, Number(chietKhau) || 0));
        const tienChietKhau = Math.round((tongTienMon * phanTramChietKhau) / 100);
        const phanTramVat = cauHinh.vatMacDinh || 8;
        const tienVat = Math.round(((tongTienMon - tienChietKhau) * phanTramVat) / 100);
        const tongTienThanhToan = tongTienMon - tienChietKhau + tienVat;

        const noiDungQr = `MOC BAN ${ban.ma_ban}`;
        const qrUrl = `https://img.vietqr.io/image/${NGAN_HANG_MAC_DINH.bankId}-${NGAN_HANG_MAC_DINH.accountNo}-${NGAN_HANG_MAC_DINH.template}.png?amount=${tongTienThanhToan}&addInfo=${encodeURIComponent(noiDungQr)}&accountName=${encodeURIComponent(NGAN_HANG_MAC_DINH.accountName)}`;

        return {
            banId,
            tenBan: ban.ten_ban,
            maBan: ban.ma_ban,
            phienBanId: phienBan.id,
            danhSachMon,
            tongTienMon,
            phanTramChietKhau,
            tienChietKhau,
            phanTramVat,
            tienVat,
            tongTienThanhToan,
            vietQr: {
                nganHang: NGAN_HANG_MAC_DINH.bankId,
                soTaiKhoan: NGAN_HANG_MAC_DINH.accountNo,
                tenChuTaiKhoan: NGAN_HANG_MAC_DINH.accountName,
                noiDung: noiDungQr,
                qrUrl
            }
        };
    },

    /**
     * Tạo hóa đơn từ phiên bàn đang hoạt động
     */
    async taoHoaDonTuPhienBan(banId, thuNganId = null, { phanTramChietKhau = 0, ghiChu = '', phuongThuc = 'tien_mat' } = {}) {
        const phienBan = banAnModel.layPhienBanHienTai(banId);
        if (!phienBan) {
            throw new Error('Bàn không có phiên hoạt động');
        }

        const ban = banAnModel.timTheoId(banId);
        const danhSachMon = hoaDonModel.layMonThucTeCuaPhien(phienBan.id);
        if (danhSachMon.length === 0) {
            throw new Error('Bàn chưa có món ăn nào được duyệt để xuất hóa đơn');
        }

        // Kiểm tra xem đã có hóa đơn chưa thanh toán chưa
        let hoaDonTonTai = hoaDonModel.timTheoPhienBan(phienBan.id);
        if (hoaDonTonTai) {
            return this.layChiTietHoaDon(hoaDonTonTai.id);
        }

        let tongTienMon = 0;
        danhSachMon.forEach(m => {
            tongTienMon += m.tong_thanh_tien;
        });

        const chietKhau = Math.max(0, Math.min(100, Number(phanTramChietKhau) || 0));
        const tienChietKhau = Math.round((tongTienMon * chietKhau) / 100);
        const phanTramVat = cauHinh.vatMacDinh || 8;
        const tienVat = Math.round(((tongTienMon - tienChietKhau) * phanTramVat) / 100);
        const tongTienThanhToan = tongTienMon - tienChietKhau + tienVat;

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const maHoaDon = `MOC_${ban.ma_ban}_HD${randomSuffix}`;

        const hoaDonId = hoaDonModel.taoHoaDon({
            phienBanId: phienBan.id,
            maHoaDon,
            thuNganId,
            tongTienMon,
            phanTramChietKhau: chietKhau,
            tienChietKhau,
            phanTramVat,
            tienVat,
            tongTienThanhToan,
            phuongThucThanhToan: phuongThuc,
            ghiChu,
            danhSachMon: danhSachMon.map(m => ({
                mon_an_id: m.mon_an_id,
                ten_mon: m.ten_mon,
                don_gia: m.don_gia,
                so_luong: m.tong_so_luong
            }))
        });

        return this.layChiTietHoaDon(hoaDonId);
    },

    /**
     * Xác nhận thanh toán hóa đơn (Figma P04)
     * Đảm bảo tính toán toàn vẹn tài chính, cập nhật trạng thái bàn, đóng phiên, ghi sổ cái
     */
    async xacNhanThanhToan(hoaDonId, {
        phuongThucThanhToan = 'tien_mat',
        tienKhachDua = 0,
        maGiaoDichNganHang = null,
        thuNganId = null,
        caLamViecId = null,
        ghiChu = null
    } = {}, taiKhoanHienTai = null) {
        const hoaDon = hoaDonModel.timTheoId(hoaDonId);
        if (!hoaDon) {
            throw new Error('Không tìm thấy hóa đơn cần thanh toán');
        }

        if (hoaDon.trang_thai === 'da_thanh_toan') {
            throw new Error('Hóa đơn này đã được thanh toán trước đó');
        }

        const tongPhaiTra = hoaDon.tong_tien_thanh_toan;
        let tienThucDua = Number(tienKhachDua);

        if (phuongThucThanhToan === 'tien_mat') {
            if (tienThucDua < tongPhaiTra) {
                throw new Error(`Tiền khách đưa (${tienThucDua.toLocaleString()}đ) không đủ thanh toán tổng hóa đơn (${tongPhaiTra.toLocaleString()}đ)`);
            }
        } else {
            tienThucDua = tongPhaiTra;
        }

        const tienThoiLai = tienThucDua - tongPhaiTra;

        // Thực thi giao dịch nguyên khối (ACID)
        chayGiaoDich((db) => {
            // 1. Cập nhật hóa đơn
            const capNhatHd = db.prepare(`
                UPDATE hoa_don 
                SET trang_thai = 'da_thanh_toan',
                    phuong_thuc_thanh_toan = ?,
                    tien_khach_dua = ?,
                    tien_thoi_lai = ?,
                    ma_giao_dich_vietqr = ?,
                    thu_ngan_id = COALESCE(?, thu_ngan_id),
                    thoi_gian_thanh_toan = CURRENT_TIMESTAMP,
                    ghi_chu = COALESCE(?, ghi_chu)
                WHERE id = ?
            `);
            capNhatHd.run(
                phuongThucThanhToan,
                tienThucDua,
                tienThoiLai,
                maGiaoDichNganHang,
                thuNganId,
                ghiChu,
                hoaDonId
            );

            // 2. Đóng phiên bàn ăn
            const dongPhien = db.prepare(`
                UPDATE phien_ban 
                SET trang_thai = 'da_dong',
                    thoi_gian_ket_thuc = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            dongPhien.run(hoaDon.phien_ban_id);

            // 3. Chuyển trạng thái bàn sang 'can_don_dep' (Figma B08 -> Chờ dọn dẹp)
            const capNhatBan = db.prepare(`
                UPDATE ban_an 
                SET trang_thai = 'can_don_dep',
                    ngay_cap_nhat = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            capNhatBan.run(hoaDon.ban_an_id);

            // 4. Ghi nhận giao dịch tài chính vào bảng giao_dich_thanh_toan
            const chenGiaoDich = db.prepare(`
                INSERT INTO giao_dich_thanh_toan (
                    hoa_don_id, ca_lam_viec_id, so_tien, phuong_thuc,
                    ma_giao_dich_ngan_hang, noi_dung_chuyen_khoan, trang_thai
                ) VALUES (?, ?, ?, ?, ?, ?, 'thanh_cong')
            `);
            chenGiaoDich.run(
                hoaDonId,
                caLamViecId,
                tongPhaiTra,
                phuongThucThanhToan === 'tien_mat' ? 'TIEN_MAT' : 'VIETQR',
                maGiaoDichNganHang || `GD_${Date.now()}`,
                `THANH TOAN ${hoaDon.ma_hoa_don}`
            );
        });

        // Bắn Socket.io thông báo thanh toán thành công
        socketPhat.thanhToanThanhCong({
            hoaDonId,
            maHoaDon: hoaDon.ma_hoa_don,
            banId: hoaDon.ban_an_id,
            tenBan: hoaDon.ten_ban,
            tongTienThanhToan: tongPhaiTra,
            phuongThucThanhToan,
            tienThoiLai
        });

        // Báo trạng thái bàn mới
        socketPhat.trangThaiBan({
            banId: hoaDon.ban_an_id,
            tenBan: hoaDon.ten_ban,
            trangThai: 'can_don_dep'
        });

        // Ghi nhật ký kiểm toán
        if (taiKhoanHienTai) {
            ghiAuditLog({
                taiKhoanId: taiKhoanHienTai.id,
                hanhDong: 'XAC_NHAN_THANH_TOAN',
                doiTuong: 'hoa_don',
                doiTuongId: hoaDonId,
                duLieuMoi: {
                    maHoaDon: hoaDon.ma_hoa_don,
                    tongTien: tongPhaiTra,
                    phuongThuc: phuongThucThanhToan
                }
            });
        }

        return {
            hoaDonId,
            maHoaDon: hoaDon.ma_hoa_don,
            tongTienThanhToan: tongPhaiTra,
            tienKhachDua: tienThucDua,
            tienThoiLai,
            phuongThucThanhToan,
            trangThai: 'da_thanh_toan'
        };
    },

    /**
     * Chia tiền nhóm (Figma C10, P06)
     */
    async taoChiaTienNhom(hoaDonId, soNguoiChia) {
        const soNguoi = Number(soNguoiChia);
        if (!soNguoi || soNguoi < 2) {
            throw new Error('Số người chia hóa đơn tối thiểu phải là 2 người');
        }

        const hoaDon = hoaDonModel.timTheoId(hoaDonId);
        if (!hoaDon) {
            throw new Error('Không tìm thấy hóa đơn');
        }

        const soTienMoiNguoi = Math.ceil(hoaDon.tong_tien_thanh_toan / soNguoi);
        const maThamChieu = `CHIA_${hoaDon.ma_hoa_don}_N${soNguoi}`;

        hoaDonModel.taoChiaTienNhom({
            hoaDonId,
            soNguoiChia: soNguoi,
            soTienMoiNguoi,
            maThamChieuQr: maThamChieu
        });

        const qrUrl = `https://img.vietqr.io/image/${NGAN_HANG_MAC_DINH.bankId}-${NGAN_HANG_MAC_DINH.accountNo}-${NGAN_HANG_MAC_DINH.template}.png?amount=${soTienMoiNguoi}&addInfo=${encodeURIComponent(maThamChieu)}&accountName=${encodeURIComponent(NGAN_HANG_MAC_DINH.accountName)}`;

        return {
            hoaDonId,
            tongTien: hoaDon.tong_tien_thanh_toan,
            soNguoiChia: soNguoi,
            soTienMoiNguoi,
            maThamChieu,
            qrUrl
        };
    }
};

module.exports = hoaDonService;
