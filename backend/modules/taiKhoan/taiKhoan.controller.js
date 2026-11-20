// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// CONTROLLER ĐIỀU HƯỚNG TÀI KHOẢN VÀ XÁC THỰC
// ============================================================================

const taiKhoanService = require('./taiKhoan.service');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

const taiKhoanController = {
    async dangNhap(req, res, next) {
        try {
            const tenDangNhap = req.body.tenDangNhap || req.body.ten_dang_nhap;
            const matKhau = req.body.matKhau || req.body.mat_khau;
            const diaChiIp = req.ip || req.connection.remoteAddress;
            const thietBi = req.headers['user-agent'];

            const ketQua = await taiKhoanService.dangNhap({
                tenDangNhap,
                matKhau,
                diaChiIp,
                thietBi
            });

            return phanHoiThanhCong(res, ketQua, 'Đăng nhập thành công');
        } catch (loi) {
            next(loi);
        }
    },

    layThongTinMe(req, res, next) {
        try {
            const taiKhoan = taiKhoanService.layThongTinHienTai(req.nguoiDung.taiKhoanId);
            return phanHoiThanhCong(res, taiKhoan, 'Lấy thông tin tài khoản thành công');
        } catch (loi) {
            next(loi);
        }
    },

    async doiMatKhau(req, res, next) {
        try {
            const { matKhauCu, matKhauMoi } = req.body;
            await taiKhoanService.doiMatKhau(req.nguoiDung.taiKhoanId, { matKhauCu, matKhauMoi });
            return phanHoiThanhCong(res, null, 'Đổi mật khẩu thành công');
        } catch (loi) {
            next(loi);
        }
    }
};

module.exports = taiKhoanController;
