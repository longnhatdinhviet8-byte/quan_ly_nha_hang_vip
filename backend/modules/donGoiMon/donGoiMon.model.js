// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MODEL DỮ LIỆU ĐƠN GỌI MÓN VÀ CHI TIẾT MÓN ĂN
// ============================================================================

const { truyVanNhieu, truyVanMot, thucThi } = require('../../cauHinh/ketNoiCoSoDuLieu');

const donGoiMonModel = {
    timTheoId(id) {
        const sql = `
            SELECT dgm.*, pb.ban_an_id, b.ten_ban, b.ma_ban
            FROM don_goi_mon dgm
            JOIN phien_ban pb ON dgm.phien_ban_id = pb.id
            JOIN ban_an b ON pb.ban_an_id = b.id
            WHERE dgm.id = ?;
        `;
        return truyVanMot(sql, [id]);
    },

    layDanhSachTheoPhien(phienBanId) {
        const sql = `
            SELECT dgm.id, dgm.ma_don, dgm.nguon_tao, dgm.trang_thai, dgm.thoi_gian_gui, dgm.thoi_gian_duyet,
                   nv.ho_ten as nguoi_duyet
            FROM don_goi_mon dgm
            LEFT JOIN nhan_vien nv ON dgm.nhan_vien_duyet_id = nv.id
            WHERE dgm.phien_ban_id = ?
            ORDER BY dgm.id DESC;
        `;
        return truyVanNhieu(sql, [phienBanId]);
    },

    layChiTietMonTheoPhien(phienBanId) {
        const sql = `
            SELECT ct.id as chi_tiet_id, ct.don_goi_mon_id, ct.so_luong, ct.don_gia, ct.ghi_chu,
                   ct.trang_thai_mon, ct.la_uu_tien, ct.thoi_gian_bat_dau_nau, ct.thoi_gian_hoan_thanh_nau,
                   ct.ngay_tao,
                   m.id as mon_an_id, m.ten_mon, m.ma_mon, m.don_vi_tinh, m.anh_mon_an,
                   dgm.ma_don, dgm.nguon_tao, dgm.trang_thai as trang_thai_don
            FROM chi_tiet_don_mon ct
            JOIN don_goi_mon dgm ON ct.don_goi_mon_id = dgm.id
            JOIN mon_an m ON ct.mon_an_id = m.id
            WHERE dgm.phien_ban_id = ?
            ORDER BY ct.id ASC;
        `;
        return truyVanNhieu(sql, [phienBanId]);
    },

    layDonChoDuyet() {
        const sql = `
            SELECT dgm.id, dgm.ma_don, dgm.nguon_tao, dgm.thoi_gian_gui,
                   pb.id as phien_ban_id, pb.ban_an_id, b.ten_ban, b.ma_ban, k.ten_khu_vuc
            FROM don_goi_mon dgm
            JOIN phien_ban pb ON dgm.phien_ban_id = pb.id
            JOIN ban_an b ON pb.ban_an_id = b.id
            JOIN khu_vuc k ON b.khu_vuc_id = k.id
            WHERE dgm.trang_thai = 'cho_duyet'
            ORDER BY dgm.thoi_gian_gui ASC;
        `;
        return truyVanNhieu(sql);
    },

    capNhatTrangThaiDon(id, trangThai, nhanVienDuyetId = null, lyDoTuChoi = null) {
        const sql = `
            UPDATE don_goi_mon 
            SET trang_thai = ?, 
                nhan_vien_duyet_id = COALESCE(?, nhan_vien_duyet_id),
                ly_do_tu_choi = ?,
                thoi_gian_duyet = CURRENT_TIMESTAMP
            WHERE id = ?;
        `;
        return thucThi(sql, [trangThai, nhanVienDuyetId, lyDoTuChoi, id]);
    },

    capNhatTrangThaiMonTheoDon(donGoiMonId, trangThaiMon) {
        const sql = `
            UPDATE chi_tiet_don_mon 
            SET trang_thai_mon = ?, ngay_cap_nhat = CURRENT_TIMESTAMP 
            WHERE don_goi_mon_id = ? AND trang_thai_mon = 'cho_duyet';
        `;
        return thucThi(sql, [trangThaiMon, donGoiMonId]);
    }
};

module.exports = donGoiMonModel;
