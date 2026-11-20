// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// CONTROLLER ĐIỀU HƯỚNG PHÒNG BÀN, SƠ ĐỒ BÀN & QUÉT QR
// ============================================================================

const banAnService = require('./banAn.service');
const { phanHoiThanhCong } = require('../../tienIch/dinhDangPhanHoi');

const banAnController = {
    layDanhSach(req, res, next) {
        try {
            const { khuVucId } = req.query;
            const ketQua = banAnService.layDanhSach(khuVucId ? Number(khuVucId) : null);
            return phanHoiThanhCong(res, ketQua, 'Lấy sơ đồ bàn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    layChiTiet(req, res, next) {
        try {
            const ban = banAnService.layChiTiet(Number(req.params.id));
            return phanHoiThanhCong(res, ban, 'Lấy chi tiết bàn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    layQuaQrToken(req, res, next) {
        try {
            const ban = banAnService.layQuaQrToken(req.params.token);
            return phanHoiThanhCong(res, ban, 'Xác thực mã QR bàn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    moBan(req, res, next) {
        try {
            const banId = Number(req.params.id);
            const { soKhach, ghiChu } = req.body;
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;

            const ketQua = banAnService.moBan(banId, { soKhach, ghiChu, nguoiThaoTacId });
            return phanHoiThanhCong(res, ketQua, 'Mở bàn mới thành công', 201);
        } catch (loi) {
            next(loi);
        }
    },

    chuyenBan(req, res, next) {
        try {
            const { banNguonId, banDichId, lyDo } = req.body;
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;

            const ketQua = banAnService.chuyenBan({
                banNguonId: Number(banNguonId),
                banDichId: Number(banDichId),
                nguoiThaoTacId,
                lyDo
            });
            return phanHoiThanhCong(res, ketQua, 'Chuyển bàn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    gopBan(req, res, next) {
        try {
            const { banNguonId, banDichId, lyDo } = req.body;
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;

            const ketQua = banAnService.gopBan({
                banNguonId: Number(banNguonId),
                banDichId: Number(banDichId),
                nguoiThaoTacId,
                lyDo
            });
            return phanHoiThanhCong(res, ketQua, 'Gộp bàn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    doiTrangThai(req, res, next) {
        try {
            const banId = Number(req.params.id);
            const { trangThai } = req.body;
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;

            const ketQua = banAnService.doiTrangThai(banId, trangThai, nguoiThaoTacId);
            return phanHoiThanhCong(res, ketQua, 'Cập nhật trạng thái bàn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    layDanhSachKhuVuc(req, res, next) {
        try {
            const danhSach = banAnService.layDanhSachKhuVuc();
            return phanHoiThanhCong(res, danhSach, 'Lấy danh sách khu vực thành công');
        } catch (loi) {
            next(loi);
        }
    },

    capNhatThongTin(req, res, next) {
        try {
            const banId = Number(req.params.id);
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;
            const ketQua = banAnService.capNhatThongTin(banId, req.body, nguoiThaoTacId);
            return phanHoiThanhCong(res, ketQua, 'Cập nhật thông tin bàn ăn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    taoBan(req, res, next) {
        try {
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;
            const ketQua = banAnService.taoBan(req.body, nguoiThaoTacId);
            return phanHoiThanhCong(res, ketQua, 'Thêm bàn ăn mới thành công', 201);
        } catch (loi) {
            next(loi);
        }
    },

    xoaBan(req, res, next) {
        try {
            const banId = Number(req.params.id);
            const nguoiThaoTacId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;
            const ketQua = banAnService.xoaBan(banId, nguoiThaoTacId);
            return phanHoiThanhCong(res, ketQua, 'Xóa bàn ăn thành công');
        } catch (loi) {
            next(loi);
        }
    }
};

module.exports = banAnController;
