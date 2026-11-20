// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MODEL DỮ LIỆU ĐIỀU PHỐI BẾP KDS (FIGMA K01, K02, K03, K05)
// ============================================================================

const { truyVanNhieu, truyVanMot, thucThi } = require('../../cauHinh/ketNoiCoSoDuLieu');

const dieuPhoiBepModel = {
    /**
     * Lấy danh sách món đang chờ nấu / đang nấu theo chế độ phiếu bàn (Figma K01)
     */
    layHangDoiTheoBan() {
        const sql = `
            SELECT ct.id as chi_tiet_id, ct.so_luong, ct.don_gia, ct.ghi_chu,
                   ct.trang_thai_mon, ct.la_uu_tien, ct.thoi_gian_bat_dau_nau, ct.ngay_tao,
                   ROUND((JULIANDAY('now') - JULIANDAY(ct.ngay_tao)) * 24 * 60) as so_phut_cho,
                   m.id as mon_an_id, m.ten_mon, m.ma_mon, m.don_vi_tinh, m.anh_mon_an,
                   dgm.id as don_goi_mon_id, dgm.ma_don, dgm.thoi_gian_gui,
                   pb.id as phien_ban_id, pb.ban_an_id,
                   b.ma_ban, b.ten_ban, k.ten_khu_vuc
            FROM chi_tiet_don_mon ct
            JOIN don_goi_mon dgm ON ct.don_goi_mon_id = dgm.id
            JOIN phien_ban pb ON dgm.phien_ban_id = pb.id
            JOIN ban_an b ON pb.ban_an_id = b.id
            JOIN khu_vuc k ON b.khu_vuc_id = k.id
            JOIN mon_an m ON ct.mon_an_id = m.id
            WHERE ct.trang_thai_mon IN ('cho_duyet', 'dang_nau') 
              AND dgm.trang_thai = 'da_duyet'
            ORDER BY ct.la_uu_tien DESC, ct.ngay_tao ASC;
        `;
        return truyVanNhieu(sql);
    },

    /**
     * Lấy danh sách món gộp theo mẻ nấu (Figma K02 - Batch Cooking)
     */
    layHangDoiGomMon() {
        const sql = `
            SELECT m.id as mon_an_id, m.ten_mon, m.ma_mon, m.don_vi_tinh, m.anh_mon_an,
                   SUM(ct.so_luong) as tong_so_luong,
                   COUNT(DISTINCT pb.ban_an_id) as so_ban_dang_cho,
                   GROUP_CONCAT(b.ten_ban || ' (x' || ct.so_luong || ')', ', ') as chi_tiet_cac_ban,
                   MIN(ROUND((JULIANDAY('now') - JULIANDAY(ct.ngay_tao)) * 24 * 60)) as so_phut_cho_lau_nhat,
                   MAX(ct.la_uu_tien) as co_lenh_uu_tien
            FROM chi_tiet_don_mon ct
            JOIN don_goi_mon dgm ON ct.don_goi_mon_id = dgm.id
            JOIN phien_ban pb ON dgm.phien_ban_id = pb.id
            JOIN ban_an b ON pb.ban_an_id = b.id
            JOIN mon_an m ON ct.mon_an_id = m.id
            WHERE ct.trang_thai_mon IN ('cho_duyet', 'dang_nau') 
              AND dgm.trang_thai = 'da_duyet'
            GROUP BY m.id, m.ten_mon, m.ma_mon, m.don_vi_tinh, m.anh_mon_an
            ORDER BY co_lenh_uu_tien DESC, so_phut_cho_lau_nhat DESC;
        `;
        return truyVanNhieu(sql);
    },

    /**
     * Lấy các món đã nấu xong trong vòng 60 phút qua (Figma K03)
     */
    layMonDaHoanThanh() {
        const sql = `
            SELECT ct.id as chi_tiet_id, ct.so_luong, ct.don_gia, ct.ghi_chu,
                   ct.trang_thai_mon, ct.thoi_gian_bat_dau_nau, ct.thoi_gian_hoan_thanh_nau,
                   m.ten_mon, m.ma_mon, b.ten_ban, b.ma_ban, k.ten_khu_vuc,
                   nv.ho_ten as dau_bep_nau
            FROM chi_tiet_don_mon ct
            JOIN don_goi_mon dgm ON ct.don_goi_mon_id = dgm.id
            JOIN phien_ban pb ON dgm.phien_ban_id = pb.id
            JOIN ban_an b ON pb.ban_an_id = b.id
            JOIN khu_vuc k ON b.khu_vuc_id = k.id
            JOIN mon_an m ON ct.mon_an_id = m.id
            LEFT JOIN nhan_vien nv ON ct.dau_bep_id = nv.id
            WHERE ct.trang_thai_mon IN ('hoan_thanh', 'da_phuc_vu')
              AND ct.thoi_gian_hoan_thanh_nau >= DATETIME('now', '-60 minutes')
            ORDER BY ct.thoi_gian_hoan_thanh_nau DESC;
        `;
        return truyVanNhieu(sql);
    },

    timChiTietTheoId(chiTietId) {
        const sql = `
            SELECT ct.*, m.ten_mon, pb.ban_an_id, b.ten_ban, b.ma_ban
            FROM chi_tiet_don_mon ct
            JOIN don_goi_mon dgm ON ct.don_goi_mon_id = dgm.id
            JOIN phien_ban pb ON dgm.phien_ban_id = pb.id
            JOIN ban_an b ON pb.ban_an_id = b.id
            JOIN mon_an m ON ct.mon_an_id = m.id
            WHERE ct.id = ?;
        `;
        return truyVanMot(sql, [chiTietId]);
    },

    capNhatTienDo(chiTietId, trangThaiMoi, dauBepId = null) {
        let sql = `
            UPDATE chi_tiet_don_mon 
            SET trang_thai_mon = ?, 
                dau_bep_id = COALESCE(?, dau_bep_id),
                ngay_cap_nhat = CURRENT_TIMESTAMP
        `;
        const params = [trangThaiMoi, dauBepId];

        if (trangThaiMoi === 'dang_nau') {
            sql += `, thoi_gian_bat_dau_nau = CURRENT_TIMESTAMP`;
        } else if (trangThaiMoi === 'hoan_thanh') {
            sql += `, thoi_gian_hoan_thanh_nau = CURRENT_TIMESTAMP`;
        }

        sql += ` WHERE id = ?;`;
        params.push(chiTietId);

        return thucThi(sql, params);
    },

    datUuTienKhancap(chiTietId, laUuTien = 1) {
        const sql = `
            UPDATE chi_tiet_don_mon 
            SET la_uu_tien = ?, ngay_cap_nhat = CURRENT_TIMESTAMP 
            WHERE id = ?;
        `;
        return thucThi(sql, [laUuTien ? 1 : 0, chiTietId]);
    }
};

module.exports = dieuPhoiBepModel;
