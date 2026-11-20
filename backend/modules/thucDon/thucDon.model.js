// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MODEL DỮ LIỆU THỰC ĐƠN, MÓN ĂN & DANH MỤC (FIGMA C02, C03, K04)
// ============================================================================

const { truyVanNhieu, truyVanMot, thucThi } = require('../../cauHinh/ketNoiCoSoDuLieu');

const thucDonModel = {
    layDanhSachDanhMuc() {
        const sql = `
            SELECT id, ma_danh_muc, ten_danh_muc, thu_tu_hien_thi
            FROM danh_muc_mon
            WHERE kich_hoat = 1
            ORDER BY thu_tu_hien_thi ASC;
        `;
        return truyVanNhieu(sql);
    },

    layDanhSachMonAn({ danhMucId = null, tuKhoa = null, chiLayConMon = false } = {}) {
        let sql = `
            SELECT m.id, m.ma_mon, m.ten_mon, m.don_gia, m.don_vi_tinh,
                   m.anh_mon_an, m.mo_ta, m.con_mon, m.la_combo, m.la_ban_chay, m.la_goi_y,
                   dm.id as danh_muc_id, dm.ten_danh_muc, dm.ma_danh_muc
            FROM mon_an m
            JOIN danh_muc_mon dm ON m.danh_muc_id = dm.id
            WHERE m.kich_hoat = 1
        `;
        const params = [];

        if (danhMucId) {
            sql += ` AND m.danh_muc_id = ?`;
            params.push(danhMucId);
        }

        if (chiLayConMon) {
            sql += ` AND m.con_mon = 1`;
        }

        if (tuKhoa && tuKhoa.trim()) {
            sql += ` AND (m.ten_mon LIKE ? OR m.ma_mon LIKE ? OR m.mo_ta LIKE ?)`;
            const keyword = `%${tuKhoa.trim()}%`;
            params.push(keyword, keyword, keyword);
        }

        sql += ` ORDER BY m.la_ban_chay DESC, m.la_goi_y DESC, m.id ASC;`;
        return truyVanNhieu(sql, params);
    },

    timTheoId(id) {
        const sql = `
            SELECT m.*, dm.ten_danh_muc, dm.ma_danh_muc
            FROM mon_an m
            JOIN danh_muc_mon dm ON m.danh_muc_id = dm.id
            WHERE m.id = ?;
        `;
        return truyVanMot(sql, [id]);
    },

    layChiTietCombo(comboId) {
        const sql = `
            SELECT cct.so_luong, m.id as mon_an_id, m.ma_mon, m.ten_mon, m.don_gia, m.don_vi_tinh, m.anh_mon_an
            FROM combo_chi_tiet cct
            JOIN mon_an m ON cct.mon_an_le_id = m.id
            WHERE cct.combo_id = ?;
        `;
        return truyVanNhieu(sql, [comboId]);
    },

    capNhatConMon(id, conMon) {
        const sql = `
            UPDATE mon_an 
            SET con_mon = ?, ngay_cap_nhat = CURRENT_TIMESTAMP 
            WHERE id = ?;
        `;
        return thucThi(sql, [conMon ? 1 : 0, id]);
    }
};

module.exports = thucDonModel;
