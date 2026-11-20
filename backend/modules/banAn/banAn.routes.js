// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ĐỊNH TUYẾN ĐƯỜNG DẪN API SƠ ĐỒ BÀN & QUẢN LÝ BÀN ĂN
// ============================================================================

const express = require('express');
const router = express.Router();
const banAnController = require('./banAn.controller');
const { xacThucNguoiDung, xacThucTuyChon } = require('../../middleware/xacThuc');
const { phanQuyen } = require('../../middleware/phanQuyen');

// Khách quét QR bàn (Public)
router.get('/qr/:token', banAnController.layQuaQrToken);

// Xem sơ đồ bàn (Phục vụ, Thu ngân, Bếp, Quản lý)
router.get('/', xacThucNguoiDung, banAnController.layDanhSach);
router.get('/:id', xacThucNguoiDung, banAnController.layChiTiet);

// Nghiệp vụ vận hành bàn ăn (Phục vụ & Quản lý)
router.post('/:id/mo-ban', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), banAnController.moBan);
router.post('/chuyen-ban', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), banAnController.chuyenBan);
router.post('/gop-ban', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), banAnController.gopBan);
router.put('/:id/trang-thai', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), banAnController.doiTrangThai);

module.exports = router;
