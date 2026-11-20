// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ĐỊNH TUYẾN ĐƯỜNG DẪN API SƠ ĐỒ BÀN & QUẢN LÝ BÀN ĂN
// ============================================================================

const express = require('express');
const router = express.Router();
const banAnController = require('./banAn.controller');
const { xacThucNguoiDung, xacThucTuyChon } = require('../../middleware/xacThuc');
const { phanQuyen } = require('../../middleware/phanQuyen');

// Danh sách khu vực (Dropdown)
router.get('/khu-vuc', banAnController.layDanhSachKhuVuc);

// Khách quét QR bàn (Public)
router.get('/qr/:token', banAnController.layQuaQrToken);

// Xem sơ đồ bàn (Phục vụ, Thu ngân, Bếp, Quản lý - có thể dùng xác thực tùy chọn để xem linh hoạt)
router.get('/', xacThucTuyChon, banAnController.layDanhSach);
router.get('/:id', xacThucTuyChon, banAnController.layChiTiet);

// Quản lý bàn ăn (Thêm, Sửa, Xóa - Quản trị Admin A10)
router.post('/', xacThucNguoiDung, phanQuyen('quan_ly'), banAnController.taoBan);
router.put('/:id', xacThucNguoiDung, phanQuyen('quan_ly'), banAnController.capNhatThongTin);
router.delete('/:id', xacThucNguoiDung, phanQuyen('quan_ly'), banAnController.xoaBan);

// Nghiệp vụ vận hành bàn ăn (Phục vụ & Quản lý)
router.post('/:id/mo-ban', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan', 'quan_ly'), banAnController.moBan);
router.post('/chuyen-ban', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan', 'quan_ly'), banAnController.chuyenBan);
router.post('/gop-ban', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan', 'quan_ly'), banAnController.gopBan);
router.put('/:id/trang-thai', xacThucNguoiDung, phanQuyen('phuc_vu', 'thu_ngan', 'quan_ly'), banAnController.doiTrangThai);

module.exports = router;
