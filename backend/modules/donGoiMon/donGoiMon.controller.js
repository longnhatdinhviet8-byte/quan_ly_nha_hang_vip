// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// CONTROLLER ĐIỀU HƯỚNG ĐƠN GỌI MÓN, DUYỆT ĐƠN & TIẾN ĐỘ MÓN
// ============================================================================

const donGoiMonService = require('./donGoiMon.service');
const { phanHoiThanhCong } = require('../../tienIch/dinhDangPhanHoi');

const donGoiMonController = {
    taoDon(req, res, next) {
        try {
            const { maQrToken, banId, danhSachMon, nguonTao } = req.body;
            const nhanVienTaoId = req.nguoiDung ? req.nguoiDung.nhanVienId : null;

            const ketQua = donGoiMonService.taoDonGoiMon({
                maQrToken,
                banId: banId ? Number(banId) : null,
                danhSachMon,
                nguonTao: nguonTao || 'khach_qr',
                nhanVienTaoId
            });

            return phanHoiThanhCong(res, ketQua, 'Gửi yêu cầu đặt món thành công', 201);
        } catch (loi) {
            next(loi);
        }
    },

    layMonTheoBan(req, res, next) {
        try {
            const banId = Number(req.params.banId);
            const ketQua = donGoiMonService.layMonTheoBan(banId);
            return phanHoiThanhCong(res, ketQua, 'Lấy danh sách món theo bàn thành công');
        } catch (loi) {
            next(loi);
        }
    },

    layDonChoDuyet(req, res, next) {
        try {
            const danhSach = donGoiMonService.layDonChoDuyet();
            return phanHoiThanhCong(res, danhSach, 'Lấy danh sách đơn chờ duyệt thành công');
        } catch (loi) {
            next(loi);
        }
    },

    duyetDonQR(req, res, next) {
        try {
            const donId = Number(req.params.id);
            const nhanVienDuyetId = req.nguoiDung ? req.nguoiDung.nhanVienId : null;
            const ketQua = donGoiMonService.duyetDonQR(donId, nhanVienDuyetId);
            return phanHoiThanhCong(res, ketQua, 'Duyệt đơn món chuyển Bếp thành công');
        } catch (loi) {
            next(loi);
        }
    },

    tuChoiDonQR(req, res, next) {
        try {
            const donId = Number(req.params.id);
            const { lyDoTuChoi } = req.body;
            const nhanVienDuyetId = req.nguoiDung ? req.nguoiDung.nhanVienId : null;
            const ketQua = donGoiMonService.tuChoiDonQR(donId, nhanVienDuyetId, lyDoTuChoi);
            return phanHoiThanhCong(res, ketQua, 'Từ chối đơn gọi món thành công');
        } catch (loi) {
            next(loi);
        }
    },

    yeuCauHuyMon(req, res, next) {
        try {
            const { chiTietDonMonId, lyDoHuy } = req.body;
            const nhanVienYeuCauId = req.nguoiDung ? req.nguoiDung.nhanVienId : null;
            const ketQua = donGoiMonService.yeuCauHuyMon({
                chiTietDonMonId: Number(chiTietDonMonId),
                nhanVienYeuCauId,
                lyDoHuy
            });
            return phanHoiThanhCong(res, ketQua, ketQua.msg);
        } catch (loi) {
            next(loi);
        }
    }
};

module.exports = donGoiMonController;
