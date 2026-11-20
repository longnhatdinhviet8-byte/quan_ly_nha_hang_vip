// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// SERVICE NGHIỆP VỤ THỰC ĐƠN, COMBO & BÁO HẾT MÓN TỨC THÌ (FIGMA C02, K04)
// ============================================================================

const thucDonModel = require('./thucDon.model');
const { layIo } = require('../../cauHinh/cauHinhSocket');
const { ghiAuditLog } = require('../../tienIch/ghiNhatKy');

const thucDonService = {
    layThucDonTongThe({ danhMucId, tuKhoa, chiLayConMon }) {
        const danhMuc = thucDonModel.layDanhSachDanhMuc();
        const monAn = thucDonModel.layDanhSachMonAn({ danhMucId, tuKhoa, chiLayConMon });

        // Tách các món nổi bật phục vụ giao diện C02
        const monBanChay = monAn.filter((m) => m.la_ban_chay === 1);
        const monGoiY = monAn.filter((m) => m.la_goi_y === 1);
        const combo = monAn.filter((m) => m.la_combo === 1);

        return {
            danhMuc,
            tatCaMon: monAn,
            monBanChay,
            monGoiY,
            combo
        };
    },

    layChiTietMon(id) {
        const mon = thucDonModel.timTheoId(id);
        if (!mon) {
            const loi = new Error('Không tìm thấy món ăn');
            loi.status = 404;
            throw loi;
        }

        // Nếu là combo, lấy thêm danh sách món thành phần
        if (mon.la_combo === 1) {
            mon.danhSachMonCon = thucDonModel.layChiTietCombo(id);
        }

        return mon;
    },

    /**
     * Bếp báo Còn món / Hết món tức thì (US-K05 & Figma K04)
     */
    doiTrangThaiConMon(monId, conMon, nguoiThaoTacId = null) {
        const mon = thucDonModel.timTheoId(monId);
        if (!mon) {
            const loi = new Error('Không tìm thấy món ăn');
            loi.status = 404;
            throw loi;
        }

        const giaTriConMon = conMon ? 1 : 0;
        thucDonModel.capNhatConMon(monId, giaTriConMon);

        // Bắn Socket.io tức thời để khóa/mở nút thêm món trên thiết bị khách hàng & phục vụ
        try {
            const io = layIo();
            io.emit('thuc_don:cap_nhat_con_mon', {
                monId,
                tenMon: mon.ten_mon,
                conMon: giaTriConMon
            });
        } catch (e) {
            // Không làm gián đoạn nếu socket chưa sẵn sàng
        }

        ghiAuditLog({
            taiKhoanId: nguoiThaoTacId,
            hanhDong: 'CAP_NHAT_CON_MON',
            bangAnhHuong: 'mon_an',
            banGhiId: monId,
            duLieuCu: { con_mon: mon.con_mon },
            duLieuMoi: { con_mon: giaTriConMon },
            lyDo: giaTriConMon === 0 ? `Bếp báo tạm hết món: ${mon.ten_mon}` : `Bếp mở lại món: ${mon.ten_mon}`
        });

        return {
            monId,
            tenMon: mon.ten_mon,
            conMon: giaTriConMon
        };
    }
};

module.exports = thucDonService;
