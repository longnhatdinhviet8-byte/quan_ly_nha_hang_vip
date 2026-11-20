// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ROUTE HÓA ĐƠN & THANH TOÁN (FIGMA P01, P02, P03, P04, P05, C09, C10)
// ============================================================================

const express = require('express');
const router = express.Router();
const hoaDonController = require('./hoaDon.controller');
const { xacThucNguoiDung, xacThucTuyChon } = require('../../middleware/xacThuc');
const { phanQuyen } = require('../../middleware/phanQuyen');

// 1. Danh sách hóa đơn (Thu ngân, Quản lý)
router.get(
    '/',
    xacThucNguoiDung,
    phanQuyen('thu_ngan', 'quan_ly'),
    hoaDonController.layDanhSach
);

// 2. Tạm tính hóa đơn cho bàn (Cả khách hàng và nhân viên đều xem được)
router.get(
    '/tam-tinh/:banId',
    xacThucTuyChon,
    hoaDonController.layTamTinhTheoBan
);

// 3. Chi tiết hóa đơn
router.get(
    '/:id',
    xacThucTuyChon,
    hoaDonController.layChiTiet
);

// 4. Tạo hóa đơn thanh toán cho bàn (Thu ngân, Quản lý)
router.post(
    '/tao-hoa-don',
    xacThucNguoiDung,
    phanQuyen('thu_ngan', 'quan_ly'),
    hoaDonController.taoHoaDon
);

// 5. Xác nhận hoàn tất thanh toán hóa đơn
router.post(
    '/:id/thanh-toan',
    xacThucNguoiDung,
    phanQuyen('thu_ngan', 'quan_ly'),
    hoaDonController.xacNhanThanhToan
);

// 6. Chia tiền nhóm (Figma C10, P06)
router.post(
    '/:id/chia-tien',
    xacThucTuyChon,
    hoaDonController.chiaTienNhom
);

module.exports = router;
