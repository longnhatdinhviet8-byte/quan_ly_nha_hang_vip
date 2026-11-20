// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MODEL DỮ LIỆU TÀI KHOẢN VÀ XÁC THỰC NGƯỜI DÙNG
// ============================================================================

const { truyVanMot, thucThi } = require('../../cauHinh/ketNoiCoSoDuLieu');

const taiKhoanModel = {
    timTheoTenDangNhap(tenDangNhap) {
        const sql = `
            SELECT t.id, t.ten_dang_nhap, t.mat_khau_hash, t.trang_thai,
                   v.id as vai_tro_id, v.ma_vai_tro, v.ten_vai_tro,
                   n.id as nhan_vien_id, n.ho_ten, n.so_dien_thoai, n.email
            FROM tai_khoan t
            JOIN vai_tro v ON t.vai_tro_id = v.id
            LEFT JOIN nhan_vien n ON n.tai_khoan_id = t.id
            WHERE t.ten_dang_nhap = ?;
        `;
        return truyVanMot(sql, [tenDangNhap]);
    },

    timTheoId(id) {
        const sql = `
            SELECT t.id, t.ten_dang_nhap, t.trang_thai, t.lan_dang_nhap_cuoi,
                   v.id as vai_tro_id, v.ma_vai_tro, v.ten_vai_tro,
                   n.id as nhan_vien_id, n.ho_ten, n.so_dien_thoai, n.email, n.muc_luong
            FROM tai_khoan t
            JOIN vai_tro v ON t.vai_tro_id = v.id
            LEFT JOIN nhan_vien n ON n.tai_khoan_id = t.id
            WHERE t.id = ?;
        `;
        return truyVanMot(sql, [id]);
    },

    capNhatLanDangNhapCuoi(id) {
        const sql = `
            UPDATE tai_khoan 
            SET lan_dang_nhap_cuoi = CURRENT_TIMESTAMP 
            WHERE id = ?;
        `;
        return thucThi(sql, [id]);
    },

    capNhatMatKhau(id, matKhauHashMoi) {
        const sql = `
            UPDATE tai_khoan 
            SET mat_khau_hash = ?, ngay_cap_nhat = CURRENT_TIMESTAMP 
            WHERE id = ?;
        `;
        return thucThi(sql, [matKhauHashMoi, id]);
    }
};

module.exports = taiKhoanModel;
