// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MODEL DỮ LIỆU CA LÀM VIỆC & ĐỔI CA / NGHỈ PHÉP (FIGMA W11, A07)
// ============================================================================

const { truyVanNhieu, truyVanMot, thucThi, chayGiaoDich } = require('../../cauHinh/ketNoiCoSoDuLieu');

const caLamViecModel = {
    /**
     * Lấy lịch làm việc của 1 nhân viên trong khoảng ngày (Tuần/Tháng)
     */
    layLichTheoNhanVien(nhanVienId, tuNgay, denNgay) {
        let sql = `
            SELECT clv.*, nv.ho_ten as ten_nhan_vien, vt.ten_vai_tro, vt.ma_vai_tro
            FROM ca_lam_viec clv
            JOIN nhan_vien nv ON clv.nhan_vien_id = nv.id
            JOIN tai_khoan tk ON nv.tai_khoan_id = tk.id
            JOIN vai_tro vt ON tk.vai_tro_id = vt.id
            WHERE clv.nhan_vien_id = ?
        `;
        const params = [nhanVienId];

        if (tuNgay) {
            sql += ` AND clv.ngay_lam >= ?`;
            params.push(tuNgay);
        }
        if (denNgay) {
            sql += ` AND clv.ngay_lam <= ?`;
            params.push(denNgay);
        }

        sql += ` ORDER BY clv.ngay_lam ASC, clv.gio_bat_dau ASC;`;
        return truyVanNhieu(sql, params);
    },

    /**
     * Lấy toàn bộ lịch làm việc của nhà hàng (Dành cho Quản lý / Admin)
     */
    layToanBoLich(tuNgay, denNgay) {
        let sql = `
            SELECT clv.*, nv.ho_ten as ten_nhan_vien, nv.so_dien_thoai,
                   vt.ten_vai_tro, vt.ma_vai_tro
            FROM ca_lam_viec clv
            JOIN nhan_vien nv ON clv.nhan_vien_id = nv.id
            JOIN tai_khoan tk ON nv.tai_khoan_id = tk.id
            JOIN vai_tro vt ON tk.vai_tro_id = vt.id
            WHERE 1=1
        `;
        const params = [];

        if (tuNgay) {
            sql += ` AND clv.ngay_lam >= ?`;
            params.push(tuNgay);
        }
        if (denNgay) {
            sql += ` AND clv.ngay_lam <= ?`;
            params.push(denNgay);
        }

        sql += ` ORDER BY clv.ngay_lam ASC, clv.gio_bat_dau ASC;`;
        return truyVanNhieu(sql, params);
    },

    /**
     * Tìm ca làm việc theo ID
     */
    timCaTheoId(id) {
        const sql = `
            SELECT clv.*, nv.ho_ten as ten_nhan_vien
            FROM ca_lam_viec clv
            JOIN nhan_vien nv ON clv.nhan_vien_id = nv.id
            WHERE clv.id = ?;
        `;
        return truyVanMot(sql, [id]);
    },

    /**
     * Tạo mới ca làm việc (Xếp lịch)
     */
    taoCa({ nhanVienId, ngayLam, tenCa, gioBatDau, gioKetThuc, ghiChu = null }) {
        const sql = `
            INSERT INTO ca_lam_viec (nhan_vien_id, ngay_lam, ten_ca, gio_bat_dau, gio_ket_thuc, trang_thai, ghi_chu)
            VALUES (?, ?, ?, ?, ?, 'ke_hoach', ?);
        `;
        const res = thucThi(sql, [nhanVienId, ngayLam, tenCa, gioBatDau, gioKetThuc, ghiChu]);
        return res.lastInsertRowid;
    },

    /**
     * Cập nhật trạng thái ca (Check-in, Check-out, Vắng mặt)
     */
    capNhatTrangThaiCa(id, trangThai) {
        const sql = `
            UPDATE ca_lam_viec 
            SET trang_thai = ?
            WHERE id = ?;
        `;
        return thucThi(sql, [trangThai, id]);
    },

    /**
     * Lấy danh sách yêu cầu đổi ca / xin nghỉ (Figma W11 & A07)
     */
    layDanhSachYeuCau({ trangThai, nhanVienId } = {}) {
        let sql = `
            SELECT ycdc.*, 
                   nv1.ho_ten as ten_nhan_vien_yeu_cau,
                   nv2.ho_ten as ten_nhan_vien_nhan_ca,
                   nvq.ho_ten as ten_quan_ly_duyet,
                   clv.ngay_lam, clv.ten_ca, clv.gio_bat_dau, clv.gio_ket_thuc
            FROM yeu_cau_doi_ca ycdc
            JOIN nhan_vien nv1 ON ycdc.nhan_vien_yeu_cau_id = nv1.id
            LEFT JOIN nhan_vien nv2 ON ycdc.nhan_vien_nhan_ca_id = nv2.id
            LEFT JOIN nhan_vien nvq ON ycdc.quan_ly_duyet_id = nvq.id
            JOIN ca_lam_viec clv ON ycdc.ca_lam_viec_id = clv.id
            WHERE 1=1
        `;
        const params = [];

        if (trangThai) {
            sql += ` AND ycdc.trang_thai = ?`;
            params.push(trangThai);
        }
        if (nhanVienId) {
            sql += ` AND (ycdc.nhan_vien_yeu_cau_id = ? OR ycdc.nhan_vien_nhan_ca_id = ?)`;
            params.push(nhanVienId, nhanVienId);
        }

        sql += ` ORDER BY ycdc.ngay_tao DESC;`;
        return truyVanNhieu(sql, params);
    },

    /**
     * Tìm yêu cầu đổi ca theo ID
     */
    timYeuCauTheoId(id) {
        const sql = `
            SELECT ycdc.*, 
                   nv1.ho_ten as ten_nhan_vien_yeu_cau,
                   nv2.ho_ten as ten_nhan_vien_nhan_ca,
                   clv.ngay_lam, clv.ten_ca, clv.nhan_vien_id as ca_nhan_vien_id
            FROM yeu_cau_doi_ca ycdc
            JOIN nhan_vien nv1 ON ycdc.nhan_vien_yeu_cau_id = nv1.id
            LEFT JOIN nhan_vien nv2 ON ycdc.nhan_vien_nhan_ca_id = nv2.id
            JOIN ca_lam_viec clv ON ycdc.ca_lam_viec_id = clv.id
            WHERE ycdc.id = ?;
        `;
        return truyVanMot(sql, [id]);
    },

    /**
     * Tạo yêu cầu đổi ca / xin nghỉ mới
     */
    taoYeuCauDoiCa({ nhanVienYeuCauId, caLamViecId, loaiYeuCau, nhanVienNhanCaId = null, lyDo }) {
        const sql = `
            INSERT INTO yeu_cau_doi_ca (
                nhan_vien_yeu_cau_id, ca_lam_viec_id, loai_yeu_cau,
                nhan_vien_nhan_ca_id, ly_do, trang_thai
            ) VALUES (?, ?, ?, ?, ?, 'cho_duyet');
        `;
        const res = thucThi(sql, [
            nhanVienYeuCauId,
            caLamViecId,
            loaiYeuCau,
            nhanVienNhanCaId,
            lyDo
        ]);
        return res.lastInsertRowid;
    },

    /**
     * Phê duyệt yêu cầu đổi ca trong giao dịch
     */
    pheDuyetYeuCau(id, { trangThai, quanLyDuyetId, ghiChuDuyet = null }) {
        return chayGiaoDich((db) => {
            const yeuCau = db.prepare(`SELECT * FROM yeu_cau_doi_ca WHERE id = ?`).get(id);
            if (!yeuCau) {
                throw new Error('Không tìm thấy yêu cầu đổi ca');
            }

            // 1. Cập nhật trạng thái phiếu
            const capNhatYc = db.prepare(`
                UPDATE yeu_cau_doi_ca 
                SET trang_thai = ?,
                    quan_ly_duyet_id = ?,
                    ghi_chu_duyet = ?,
                    ngay_duyet = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            capNhatYc.run(trangThai, quanLyDuyetId, ghiChuDuyet, id);

            // 2. Nếu chấp thuận:
            if (trangThai === 'da_duyet') {
                if (yeuCau.loai_yeu_cau === 'doi_ca' && yeuCau.nhan_vien_nhan_ca_id) {
                    // Chuyển ca sang cho người nhận
                    const chuyenCa = db.prepare(`
                        UPDATE ca_lam_viec 
                        SET nhan_vien_id = ?
                        WHERE id = ?
                    `);
                    chuyenCa.run(yeuCau.nhan_vien_nhan_ca_id, yeuCau.ca_lam_viec_id);
                } else if (yeuCau.loai_yeu_cau === 'nghi_ca') {
                    // Đánh dấu hủy ca đã được duyệt nghỉ
                    const huyCa = db.prepare(`
                        UPDATE ca_lam_viec 
                        SET trang_thai = 'da_huy'
                        WHERE id = ?
                    `);
                    huyCa.run(yeuCau.ca_lam_viec_id);
                }
            }

            return true;
        });
    }
};

module.exports = caLamViecModel;
