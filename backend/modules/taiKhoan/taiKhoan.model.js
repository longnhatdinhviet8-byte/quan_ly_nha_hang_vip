// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MODEL DỮ LIỆU TÀI KHOẢN VÀ XÁC THỰC NGƯỜI DÙNG
// ============================================================================

const { truyVanMot, truyVanNhieu, thucThi } = require('../../cauHinh/ketNoiCoSoDuLieu');

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
    },

    // =========================================================================
    // QUẢN LÝ NHÂN SỰ TOÀN HỆ THỐNG (A02, A03, A04, A05)
    // =========================================================================

    layDanhSachNhanSu() {
        const sql = `
            SELECT n.id, n.tai_khoan_id, n.ho_ten, n.so_dien_thoai, n.email, n.cccd,
                   n.hinh_thuc_lam_viec, n.muc_luong, n.ngay_vao_lam, n.trang_thai,
                   t.ten_dang_nhap, t.trang_thai as trang_thai_tk, t.lan_dang_nhap_cuoi,
                   v.id as vai_tro_id, v.ma_vai_tro, v.ten_vai_tro
            FROM nhan_vien n
            JOIN tai_khoan t ON n.tai_khoan_id = t.id
            JOIN vai_tro v ON t.vai_tro_id = v.id
            ORDER BY n.id ASC;
        `;
        return truyVanNhieu(sql);
    },

    layChiTietNhanSu(id) {
        const sql = `
            SELECT n.id, n.tai_khoan_id, n.ho_ten, n.so_dien_thoai, n.email, n.cccd,
                   n.hinh_thuc_lam_viec, n.muc_luong, n.ngay_vao_lam, n.trang_thai,
                   t.ten_dang_nhap, t.trang_thai as trang_thai_tk, t.lan_dang_nhap_cuoi,
                   v.id as vai_tro_id, v.ma_vai_tro, v.ten_vai_tro
            FROM nhan_vien n
            JOIN tai_khoan t ON n.tai_khoan_id = t.id
            JOIN vai_tro v ON t.vai_tro_id = v.id
            WHERE n.id = ?;
        `;
        return truyVanMot(sql, [id]);
    },

    timVaiTro(dinhDanh) {
        const sql = `SELECT id, ma_vai_tro, ten_vai_tro FROM vai_tro WHERE ma_vai_tro = ? OR id = ?;`;
        return truyVanMot(sql, [dinhDanh, Number(dinhDanh) || 0]);
    },

    taoNhanSuVoiTaiKhoan({ hoTen, tenDangNhap, matKhauHash, vaiTroId, soDienThoai, email, cccd, mucLuong, hinhThucLamViec, ngayVaoLam }) {
        let taiKhoanId = null;
        try {
            // 1. Tạo tài khoản đăng nhập
            const sqlTk = `
                INSERT INTO tai_khoan (ten_dang_nhap, mat_khau_hash, vai_tro_id, trang_thai)
                VALUES (?, ?, ?, 'hoat_dong');
            `;
            const resTk = thucThi(sqlTk, [tenDangNhap, matKhauHash, vaiTroId]);
            taiKhoanId = Number(resTk.lastInsertRowid);

            // 2. Tạo hồ sơ nhân viên (email và cccd nếu rỗng thì truyền null để tránh vi phạm UNIQUE)
            const sqlNv = `
                INSERT INTO nhan_vien (tai_khoan_id, ho_ten, so_dien_thoai, email, cccd, hinh_thuc_lam_viec, muc_luong, ngay_vao_lam, trang_thai)
                VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), 'dang_lam');
            `;
            const resNv = thucThi(sqlNv, [
                taiKhoanId,
                hoTen,
                soDienThoai ? soDienThoai.trim() : '',
                email && email.trim() ? email.trim() : null,
                cccd && cccd.trim() ? cccd.trim() : null,
                hinhThucLamViec || 'toan_thoi_gian',
                mucLuong || 0,
                ngayVaoLam || null
            ]);

            return this.layChiTietNhanSu(Number(resNv.lastInsertRowid));
        } catch (err) {
            if (taiKhoanId) {
                thucThi(`DELETE FROM tai_khoan WHERE id = ?;`, [taiKhoanId]);
            }
            throw err;
        }
    },

    capNhatThongTinNhanSu(id, { hoTen, soDienThoai, email, cccd, hinhThucLamViec, mucLuong, vaiTroId, matKhauHash }) {
        const nv = this.layChiTietNhanSu(id);
        if (!nv) return null;

        // Cập nhật thông tin hồ sơ nhân viên (null nếu rỗng để không trùng UNIQUE)
        const giaTriEmail = email !== undefined ? (email && email.trim() ? email.trim() : null) : nv.email;
        const giaTriCccd = cccd !== undefined ? (cccd && cccd.trim() ? cccd.trim() : null) : nv.cccd;

        const sqlNv = `
            UPDATE nhan_vien 
            SET ho_ten = ?, so_dien_thoai = ?, email = ?, cccd = ?, 
                hinh_thuc_lam_viec = ?, muc_luong = ?, ngay_cap_nhat = CURRENT_TIMESTAMP
            WHERE id = ?;
        `;
        thucThi(sqlNv, [
            hoTen ? hoTen.trim() : nv.ho_ten,
            soDienThoai !== undefined ? soDienThoai.trim() : nv.so_dien_thoai,
            giaTriEmail,
            giaTriCccd,
            hinhThucLamViec || nv.hinh_thuc_lam_viec,
            mucLuong !== undefined ? Number(mucLuong) : nv.muc_luong,
            id
        ]);

        // Cập nhật tài khoản nếu có đổi vai trò hoặc mật khẩu
        if (vaiTroId || matKhauHash) {
            let sqlTk = `UPDATE tai_khoan SET ngay_cap_nhat = CURRENT_TIMESTAMP`;
            const params = [];
            if (vaiTroId) {
                sqlTk += `, vai_tro_id = ?`;
                params.push(vaiTroId);
            }
            if (matKhauHash) {
                sqlTk += `, mat_khau_hash = ?`;
                params.push(matKhauHash);
            }
            sqlTk += ` WHERE id = ?;`;
            params.push(nv.tai_khoan_id);
            thucThi(sqlTk, params);
        }

        return this.layChiTietNhanSu(id);
    },

    doiTrangThaiNhanSu(id, trangThai) {
        const nv = this.layChiTietNhanSu(id);
        if (!nv) return null;

        // Chuẩn hóa trạng thái phù hợp CHECK constraint ('dang_lam', 'tam_nghi', 'da_nghi')
        let trangThaiNv = 'dang_lam';
        let trangThaiTk = 'hoat_dong';

        if (trangThai === 'tam_khoa' || trangThai === 'tam_nghi' || trangThai === 'dinh_chi') {
            trangThaiNv = 'tam_nghi';
            trangThaiTk = 'tam_khoa';
        } else if (trangThai === 'da_nghi' || trangThai === 'da_xoa') {
            trangThaiNv = 'da_nghi';
            trangThaiTk = 'da_xoa';
        }

        // Cập nhật trạng thái nhân viên
        const sqlNv = `UPDATE nhan_vien SET trang_thai = ?, ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?;`;
        thucThi(sqlNv, [trangThaiNv, id]);

        // Đồng bộ trạng thái tài khoản đăng nhập (Khóa tài khoản không cho đăng nhập)
        const sqlTk = `UPDATE tai_khoan SET trang_thai = ?, ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?;`;
        thucThi(sqlTk, [trangThaiTk, nv.tai_khoan_id]);

        return this.layChiTietNhanSu(id);
    },

    xoaNhanSu(id) {
        const nv = this.layChiTietNhanSu(id);
        if (!nv) return false;

        // Dọn dẹp ràng buộc dữ liệu ca làm
        thucThi(`DELETE FROM yeu_cau_doi_ca WHERE nhan_vien_yeu_cau_id = ? OR nhan_vien_nhan_ca_id = ? OR quan_ly_duyet_id = ?;`, [id, id, id]);
        thucThi(`DELETE FROM ca_lam_viec WHERE nhan_vien_id = ?;`, [id]);

        // Xóa nhân viên và tài khoản
        thucThi(`DELETE FROM nhan_vien WHERE id = ?;`, [id]);
        thucThi(`DELETE FROM tai_khoan WHERE id = ?;`, [nv.tai_khoan_id]);

        return true;
    }
};

module.exports = taiKhoanModel;
