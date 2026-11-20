// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// CONTROLLER ĐIỀU HƯỚNG THỰC ĐƠN, MÓN ĂN & BÁO HẾT MÓN
// ============================================================================

const thucDonService = require('./thucDon.service');
const { phanHoiThanhCong } = require('../../tienIch/dinhDangPhanHoi');

const thucDonController = {
    layThucDon(req, res, next) {
        try {
            const { danhMucId, tuKhoa, chiLayConMon } = req.query;
            const ketQua = thucDonService.layThucDonTongThe({
                danhMucId: danhMucId ? Number(danhMucId) : null,
                tuKhoa,
                chiLayConMon: chiLayConMon === 'true' || chiLayConMon === '1'
            });
            return phanHoiThanhCong(res, ketQua, 'Lấy danh sách thực đơn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    layChiTiet(req, res, next) {
        try {
            const mon = thucDonService.layChiTietMon(Number(req.params.id));
            return phanHoiThanhCong(res, mon, 'Lấy chi tiết món ăn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    doiTrangThaiConMon(req, res, next) {
        try {
            const monId = Number(req.params.id);
            const { conMon } = req.body;
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;

            const ketQua = thucDonService.doiTrangThaiConMon(monId, conMon, nguoiThaoTacId);
            return phanHoiThanhCong(res, ketQua, 'Cập nhật trạng thái còn món thành công');
        } catch (loi) {
            next(loi);
        }
    }
};

module.exports = thucDonController;
