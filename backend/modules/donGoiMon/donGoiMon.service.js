// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// SERVICE NGHIỆP VỤ TẠO ĐƠN GỌI MÓN, DUYỆT ĐƠN QR VÀ YÊU CẦU HỦY MÓN
// ============================================================================

const donGoiMonModel = require('./donGoiMon.model');
const banAnModel = require('../banAn/banAn.model');
const thucDonModel = require('../thucDon/thucDon.model');
const { chayGiaoDich, truyVanMot } = require('../../cauHinh/ketNoiCoSoDuLieu');
const { socketPhat } = require('../../cauHinh/cauHinhSocket');
const { ghiAuditLog } = require('../../tienIch/ghiNhatKy');

const donGoiMonService = {
    /**
     * Khách quét QR hoặc Phục vụ đặt món
     */
    taoDonGoiMon({ maQrToken, banId, danhSachMon, nguonTao = 'khach_qr', nhanVienTaoId = null }) {
        if (!Array.isArray(danhSachMon) || danhSachMon.length === 0) {
            const loi = new Error('Danh sách món ăn không được để trống');
            loi.status = 400;
            throw loi;
        }

        // 1. Xác định bàn ăn
        let ban = null;
        if (maQrToken) {
            ban = banAnModel.timTheoQrToken(maQrToken);
        } else if (banId) {
            ban = banAnModel.timTheoId(banId);
        }

        if (!ban) {
            const loi = new Error('Không tìm thấy bàn ăn tương ứng');
            loi.status = 404;
            throw loi;
        }

        return chayGiaoDich((db) => {
            // 2. Tìm hoặc tự động tạo phiên bàn (Shared Table Session)
            let phienBan = db.prepare(`
                SELECT id, ma_phien FROM phien_ban 
                WHERE ban_an_id = ? AND trang_thai = 'dang_hoat_dong';
            `).get(ban.id);

            if (!phienBan) {
                // Khách mới vào tự quét mã QR đặt món -> tự động mở phiên bàn
                const maPhien = `PB_${ban.ma_ban}_${Date.now()}`;
                const resPhien = db.prepare(`
                    INSERT INTO phien_ban (ban_an_id, ma_phien, so_luong_khach, trang_thai)
                    VALUES (?, ?, 2, 'dang_hoat_dong');
                `).run(ban.id, maPhien);

                phienBan = {
                    id: resPhien.lastInsertRowid,
                    ma_phien: maPhien
                };

                // Cập nhật trạng thái bàn sang "co_khach"
                db.prepare(`UPDATE ban_an SET trang_thai = 'co_khach', ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?`).run(ban.id);
                socketPhat.trangThaiBan({ banId: ban.id, trangThai: 'co_khach', phienBanId: phienBan.id });
            }

            // 3. Kiểm tra tính hợp lệ & tình trạng còn món (con_mon) của từng món
            const danhSachMonChuan = [];
            for (const item of danhSachMon) {
                const mon = thucDonModel.timTheoId(Number(item.monAnId));
                if (!mon) {
                    throw new Error(`Món ăn có ID [${item.monAnId}] không tồn tại trong thực đơn`);
                }
                if (mon.con_mon === 0) {
                    throw new Error(`Món [${mon.ten_mon}] hiện tại bếp đã báo hết. Vui lòng chọn món khác.`);
                }
                const soLuong = Math.max(1, parseInt(item.soLuong, 10) || 1);
                danhSachMonChuan.push({
                    monAnId: mon.id,
                    tenMon: mon.ten_mon,
                    donGia: mon.don_gia, // Snapshot giá niêm yết
                    soLuong,
                    ghiChu: item.ghiChu ? String(item.ghiChu).trim() : null
                });
            }

            // 4. Xác định chế độ duyệt đơn: Tự động duyệt (gửi thẳng bếp) hay chờ nhân viên phục vụ duyệt
            const tuDongDuyet = ban.tu_dong_duyet_mon === 1 || nguonTao === 'phuc_vu_dat_ho';
            const trangThaiDon = tuDongDuyet ? 'da_duyet' : 'cho_duyet';
            const trangThaiMonBanDau = tuDongDuyet ? 'dang_nau' : 'cho_duyet';

            const maDon = `DGM_${ban.ma_ban}_${Date.now().toString().slice(-6)}`;
            const resDon = db.prepare(`
                INSERT INTO don_goi_mon (phien_ban_id, ma_don, nguon_tao, nhan_vien_tao_id, trang_thai, thoi_gian_duyet)
                VALUES (?, ?, ?, ?, ?, ?);
            `).run(
                phienBan.id,
                maDon,
                nguonTao,
                nhanVienTaoId,
                trangThaiDon,
                tuDongDuyet ? new Date().toISOString() : null
            );

            const donGoiMonId = resDon.lastInsertRowid;

            // 5. Thêm chi tiết từng món vào CSDL
            const stmtCT = db.prepare(`
                INSERT INTO chi_tiet_don_mon (
                    don_goi_mon_id, mon_an_id, so_luong, don_gia, ghi_chu,
                    trang_thai_mon, thoi_gian_bat_dau_nau
                ) VALUES (?, ?, ?, ?, ?, ?, ?);
            `);

            for (const item of danhSachMonChuan) {
                stmtCT.run(
                    donGoiMonId,
                    item.monAnId,
                    item.soLuong,
                    item.donGia,
                    item.ghiChu,
                    trangThaiMonBanDau,
                    tuDongDuyet ? new Date().toISOString() : null
                );
            }

            // Cập nhật trạng thái bàn sang "cho_mon"
            db.prepare(`UPDATE ban_an SET trang_thai = 'cho_mon', ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?`).run(ban.id);

            // 6. Phát Socket Realtime
            socketPhat.donHangMoi({
                donGoiMonId,
                maDon,
                banId: ban.id,
                tenBan: ban.ten_ban,
                phienBanId: phienBan.id,
                nguonTao,
                trangThaiDon,
                soMon: danhSachMonChuan.length,
                danhSachMon: danhSachMonChuan
            });

            socketPhat.trangThaiBan({ banId: ban.id, trangThai: 'cho_mon' });

            return {
                donGoiMonId,
                maDon,
                banId: ban.id,
                tenBan: ban.ten_ban,
                phienBanId: phienBan.id,
                trangThai: trangThaiDon,
                soLuongMon: danhSachMonChuan.length
            };
        });
    },

    /**
     * Lấy danh sách món ăn đang phục vụ theo bàn
     */
    layMonTheoBan(banId) {
        const phien = truyVanMot(`SELECT id, ma_phien, so_luong_khach FROM phien_ban WHERE ban_an_id = ? AND trang_thai = 'dang_hoat_dong'`, [banId]);
        if (!phien) {
            return {
                coPhien: false,
                phienBan: null,
                danhSachMon: []
            };
        }

        const danhSachMon = donGoiMonModel.layChiTietMonTheoPhien(phien.id);
        return {
            coPhien: true,
            phienBan: phien,
            danhSachMon
        };
    },

    /**
     * Lấy danh sách đơn QR đang chờ duyệt (Figma W04)
     */
    layDonChoDuyet() {
        return donGoiMonModel.layDonChoDuyet();
    },

    /**
     * Phục vụ bấm DUYỆT đơn QR (US-W04 & Figma W04)
     */
    duyetDonQR(donId, nhanVienDuyetId) {
        const don = donGoiMonModel.timTheoId(donId);
        if (!don) {
            const loi = new Error('Không tìm thấy đơn đặt món');
            loi.status = 404;
            throw loi;
        }

        if (don.trang_thai !== 'cho_duyet') {
            const loi = new Error(`Đơn đặt món hiện tại đang [${don.trang_thai}], không thể duyệt lại`);
            loi.status = 400;
            throw loi;
        }

        donGoiMonModel.capNhatTrangThaiDon(donId, 'da_duyet', nhanVienDuyetId);
        // Đổi trạng thái các món từ "cho_duyet" sang "dang_nau" trên màn hình KDS
        donGoiMonModel.capNhatTrangThaiMonTheoDon(donId, 'dang_nau');

        // Bắn Socket thông báo xuống Bếp KDS và thiết bị khách hàng
        socketPhat.tienDoMonAn({
            donGoiMonId: donId,
            banId: don.ban_an_id,
            trangThaiDon: 'da_duyet',
            trangThaiMon: 'dang_nau'
        });

        ghiAuditLog({
            taiKhoanId: nhanVienDuyetId,
            hanhDong: 'DUYET_DON_QR',
            bangAnhHuong: 'don_goi_mon',
            banGhiId: donId,
            lyDo: `Phục vụ bấm duyệt đơn món ${don.ma_don} cho bàn ${don.ten_ban}`
        });

        return { donId, trangThai: 'da_duyet' };
    },

    /**
     * Phục vụ TỪ CHỐI đơn QR (US-W04 & Figma W05)
     */
    tuChoiDonQR(donId, nhanVienDuyetId, lyDoTuChoi) {
        const don = donGoiMonModel.timTheoId(donId);
        if (!don) {
            const loi = new Error('Không tìm thấy đơn đặt món');
            loi.status = 404;
            throw loi;
        }

        donGoiMonModel.capNhatTrangThaiDon(donId, 'tu_choi', nhanVienDuyetId, lyDoTuChoi || 'Hết món hoặc khách yêu cầu đổi');
        donGoiMonModel.capNhatTrangThaiMonTheoDon(donId, 'da_huy');

        socketPhat.donHangMoi({
            donGoiMonId: donId,
            banId: don.ban_an_id,
            trangThaiDon: 'tu_choi',
            lyDoTuChoi
        });

        return { donId, trangThai: 'tu_choi', lyDo: lyDoTuChoi };
    },

    /**
     * Tạo yêu cầu hủy món có kiểm soát (US-W07, US-W08 & Figma W10)
     */
    yeuCauHuyMon({ chiTietDonMonId, nhanVienYeuCauId, lyDoHuy }) {
        if (!chiTietDonMonId || !lyDoHuy) {
            const loi = new Error('Vui lòng chọn món cần hủy và nhập lý do giải trình');
            loi.status = 400;
            throw loi;
        }

        const chiTiet = truyVanMot(`SELECT * FROM chi_tiet_don_mon WHERE id = ?`, [chiTietDonMonId]);
        if (!chiTiet) {
            const loi = new Error('Không tìm thấy dòng món ăn cần hủy');
            loi.status = 404;
            throw loi;
        }

        // Nếu món đang ở trạng thái "cho_duyet": Hủy trực tiếp không cần Admin
        if (chiTiet.trang_thai_mon === 'cho_duyet') {
            thucThi(`UPDATE chi_tiet_don_mon SET trang_thai_mon = 'da_huy' WHERE id = ?`, [chiTietDonMonId]);
            return {
                huyNgay: true,
                msg: 'Món chưa nấu nên đã được hủy trực tiếp thành công'
            };
        }

        // Nếu món đã "dang_nau" hoặc "hoan_thanh": Bắt buộc nộp đơn duyệt lên Admin (Chống thất thoát)
        const sql = `
            INSERT INTO yeu_cau_huy_mon (chi_tiet_don_mon_id, nhan_vien_yeu_cau_id, ly_do_huy, trang_thai_yeu_cau)
            VALUES (?, ?, ?, 'cho_admin_duyet');
        `;
        const res = thucThi(sql, [chiTietDonMonId, nhanVienYeuCauId, lyDoHuy]);

        // Cập nhật trạng thái món sang "yeu_cau_huy"
        thucThi(`UPDATE chi_tiet_don_mon SET trang_thai_mon = 'yeu_cau_huy' WHERE id = ?`, [chiTietDonMonId]);

        // Bắn Socket.io báo động tới Admin Dashboard (Figma A19)
        const io = layIo();
        io.to('quan_ly').emit('co_yeu_cau_huy_mon', {
            yeuCauId: res.lastInsertRowid,
            chiTietDonMonId,
            lyDoHuy,
            thoiGian: new Date()
        });

        return {
            huyNgay: false,
            yeuCauId: res.lastInsertRowid,
            msg: 'Đã gửi yêu cầu hủy món lên Quản lý (Đang chờ duyệt)'
        };
    }
};

module.exports = donGoiMonService;
