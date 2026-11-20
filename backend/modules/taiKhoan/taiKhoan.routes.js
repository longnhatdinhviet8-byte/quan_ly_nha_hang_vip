// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ĐỊNH TUYẾN ĐƯỜNG DẪN API TÀI KHOẢN VÀ XÁC THỰC
// ============================================================================

const express = require('express');
const router = express.Router();
const taiKhoanController = require('./taiKhoan.controller');
const { xacThucNguoiDung } = require('../../middleware/xacThuc');

// Public route: Đăng nhập
router.post('/dang-nhap', taiKhoanController.dangNhap);

// Protected routes: Cần đăng nhập
router.get('/me', xacThucNguoiDung, taiKhoanController.layThongTinMe);
router.put('/doi-mat-khau', xacThucNguoiDung, taiKhoanController.doiMatKhau);

module.exports = router;
