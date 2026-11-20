// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// SERVICE ĐIỀU PHỐI BẾP KDS (FIGMA K01, K02, K03, K05)
// ============================================================================

const dieuPhoiBepModel = require('./dieuPhoiBep.model');
const { socketPhat } = require('../../cauHinh/cauHinhSocket');
const { ghiAuditLog } = require('../../tienIch/ghiNhatKy');

const dieuPhoiBepService = {
    /**
     * Lấy hàng đợi bếp theo chế độ (theo_ban hoặc gom_mon)
     */
    async layHangDoi(cheDo = 'theo_ban') {
        if (cheDo === 'gom_mon') {
            return dieuPhoiBepModel.layHangDoiGomMon();
        }

        const danhSachMon = dieuPhoiBepModel.layHangDoiTheoBan();
        // Bổ sung phân loại màu sắc cảnh báo thời gian chờ theo Figma K01
        return danhSachMon.map(mon => {
            let mucDoCanhBao = 'binh_thuong'; // < 10 phút: Xanh
            if (mon.so_phut_cho >= 20 || mon.la_uu_tien === 1) {
                mucDoCanhBao = 'tre_han'; // > 20 phút hoặc ưu tiên: Đỏ
            } else if (mon.so_phut_cho >= 10) {
                mucDoCanhBao = 'canh_bao'; // 10-20 phút: Vàng
            }

            return {
                ...mon,
                muc_do_canh_bao: mucDoCanhBao
            };
        });
    },

    /**
     * Lấy các món đã nấu xong trong 60 phút
     */
    async layMonDaHoanThanh() {
        return dieuPhoiBepModel.layMonDaHoanThanh();
    },

    /**
     * Bếp chuyển trạng thái món: dang_nau, hoan_thanh, da_phuc_vu
     */
    async chuyenTrangThai(chiTietId, trangThaiMoi, dauBepId = null, taiKhoanHienTai = null) {
        const chiTiet = dieuPhoiBepModel.timChiTietTheoId(chiTietId);
        if (!chiTiet) {
            throw new Error('Không tìm thấy chi tiết món ăn trong hàng đợi bếp');
        }

        const cacTrangThaiHopLe = ['dang_nau', 'hoan_thanh', 'da_phuc_vu', 'da_huy'];
        if (!cacTrangThaiHopLe.includes(trangThaiMoi)) {
            throw new Error(`Trạng thái không hợp lệ: ${trangThaiMoi}`);
        }

        dieuPhoiBepModel.capNhatTienDo(chiTietId, trangThaiMoi, dauBepId);

        // Bắn Socket.io tới Phục vụ, Thu ngân và màn hình QR bàn khách
        socketPhat.tienDoMonAn({
            chiTietId,
            banId: chiTiet.ban_an_id,
            tenBan: chiTiet.ten_ban,
            maBan: chiTiet.ma_ban,
            tenMon: chiTiet.ten_mon,
            soLuong: chiTiet.so_luong,
            trangThaiMoi
        });

        // Ghi nhật ký kiểm toán
        if (taiKhoanHienTai) {
            ghiAuditLog({
                taiKhoanId: taiKhoanHienTai.id,
                hanhDong: 'BEP_CAP_NHAT_TRANG_THAI',
                doiTuong: 'chi_tiet_don_mon',
                doiTuongId: chiTietId,
                duLieuMoi: { trangThaiMoi, tenMon: chiTiet.ten_mon, ban: chiTiet.ten_ban }
            });
        }

        return {
            chiTietId,
            trangThaiMoi,
            tenMon: chiTiet.ten_mon,
            tenBan: chiTiet.ten_ban
        };
    },

    /**
     * Bật / tắt cờ ưu tiên khẩn cấp cho món ăn (Figma K01)
     */
    async datLenhUuTien(chiTietId, laUuTien, taiKhoanHienTai = null) {
        const chiTiet = dieuPhoiBepModel.timChiTietTheoId(chiTietId);
        if (!chiTiet) {
            throw new Error('Không tìm thấy chi tiết món ăn');
        }

        dieuPhoiBepModel.datUuTienKhancap(chiTietId, laUuTien);

        // Bắn Socket.io cập nhật hàng đợi KDS
        socketPhat.tienDoMonAn({
            chiTietId,
            banId: chiTiet.ban_an_id,
            tenMon: chiTiet.ten_mon,
            laUuTien: laUuTien ? 1 : 0,
            trangThaiMoi: chiTiet.trang_thai_mon
        });

        if (taiKhoanHienTai) {
            ghiAuditLog({
                taiKhoanId: taiKhoanHienTai.id,
                hanhDong: 'BEP_DAT_UU_TIEN',
                doiTuong: 'chi_tiet_don_mon',
                doiTuongId: chiTietId,
                duLieuMoi: { laUuTien }
            });
        }

        return { chiTietId, laUuTien };
    }
};

module.exports = dieuPhoiBepService;
