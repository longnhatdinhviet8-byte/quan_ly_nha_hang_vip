// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ĐỊNH TUYẾN ĐƯỜNG DẪN API ĐƠN GỌI MÓN VÀ DUYỆT ĐƠN
// ============================================================================

const express = require('express');
const router = express.Router();
const donGoiMonController = require('./donGoiMon.controller');
const { xacThucNguoiDung, xacThucTuyChon } = require('../../middleware/xacThuc');
const { phanQuyen } = require('../../middleware/phanQuyen');

// Khách quét QR gọi món (hoặc phục vụ đặt hộ)
router.post('/', xacThucTuyChon, donGoiMonController.taoDon);

// Xem các món của bàn (Khách xem live tracker hoặc Phục vụ xem)
router.get('/ban/:banId', donGoiMonController.layMonTheoBan);

// Phục vụ kiểm tra danh sách đơn QR chờ duyệt (Figma W04)
router.get('/cho-duyet', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), donGoiMonController.layDonChoDuyet);
router.put('/:id/duyet', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), donGoiMonController.duyetDonQR);
router.put('/:id/tu-choi', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), donGoiMonController.tuChoiDonQR);

// Yêu cầu hủy món có kiểm soát (Figma W10)
router.post('/huy-mon', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan'), donGoiMonController.yeuCauHuyMon);

module.exports = router;
