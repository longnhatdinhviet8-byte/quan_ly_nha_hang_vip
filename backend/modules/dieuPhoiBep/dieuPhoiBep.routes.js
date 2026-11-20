// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ROUTE ĐIỀU PHỐI BẾP KDS (FIGMA K01, K02, K03, K05)
// ============================================================================

const express = require('express');
const router = express.Router();
const dieuPhoiBepController = require('./dieuPhoiBep.controller');
const { xacThucNguoiDung } = require('../../middleware/xacThuc');
const { phanQuyen } = require('../../middleware/phanQuyen');

// 1. Lấy danh sách hàng đợi món bếp (Hỗ trợ chế độ gom món và theo bàn)
router.get(
    '/hang-doi',
    xacThucNguoiDung,
    phanQuyen('bep', 'quan_ly', 'phuc_vu'),
    dieuPhoiBepController.layHangDoi
);

// 2. Lấy danh sách các món đã hoàn thành
router.get(
    '/da-hoan-thanh',
    xacThucNguoiDung,
    phanQuyen('bep', 'quan_ly', 'phuc_vu'),
    dieuPhoiBepController.layMonDaHoanThanh
);

// 3. Bếp cập nhật trạng thái chế biến (đang nấu / nấu xong / đã phục vụ)
router.put(
    '/chi-tiet/:id/trang-thai',
    xacThucNguoiDung,
    phanQuyen('bep', 'quan_ly', 'phuc_vu'),
    dieuPhoiBepController.chuyenTrangThai
);

// 4. Đặt cờ ưu tiên khẩn cấp cho món ăn
router.put(
    '/chi-tiet/:id/uu-tien',
    xacThucNguoiDung,
    phanQuyen('bep', 'quan_ly'),
    dieuPhoiBepController.datLenhUuTien
);

module.exports = router;
