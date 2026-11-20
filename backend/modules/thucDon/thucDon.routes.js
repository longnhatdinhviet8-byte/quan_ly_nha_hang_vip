// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ĐỊNH TUYẾN ĐƯỜNG DẪN API THỰC ĐƠN & MÓN ĂN
// ============================================================================

const express = require('express');
const router = express.Router();
const thucDonController = require('./thucDon.controller');
const { xacThucNguoiDung } = require('../../middleware/xacThuc');
const { phanQuyen } = require('../../middleware/phanQuyen');

// Khách hàng & Nhân viên đều xem được thực đơn (Public)
router.get('/', thucDonController.layThucDon);
router.get('/:id', thucDonController.layChiTiet);

// Bếp hoặc Quản lý cập nhật trạng thái còn/hết món (Protected)
router.put('/:id/trang-thai-mon', xacThucNguoiDung, phanQuyen('bep', 'quan_ly'), thucDonController.doiTrangThaiConMon);

module.exports = router;
