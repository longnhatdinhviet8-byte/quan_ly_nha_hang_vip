// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// SERVICE NGHIỆP VỤ TÀI KHOẢN VÀ XÁC THỰC ĐĂNG NHẬP
// ============================================================================

const jwt = require('jsonwebtoken');
const taiKhoanModel = require('./taiKhoan.model');
const { soSanhMatKhau, bamMatKhau } = require('../../tienIch/maHoaMatKhau');
const cauHinh = require('../../cauHinh/cauHinhChung');
const { ghiAuditLog } = require('../../tienIch/ghiNhatKy');

const taiKhoanService = {
    /**
     * Xác thực đăng nhập và sinh mã JWT
     */
    async dangNhap({ tenDangNhap, matKhau, diaChiIp, thietBi }) {
        if (!tenDangNhap || !matKhau) {
            const loi = new Error('Tên đăng nhập và mật khẩu không được để trống');
            loi.status = 400;
            throw loi;
        }

        const taiKhoan = taiKhoanModel.timTheoTenDangNhap(tenDangNhap.trim());
        if (!taiKhoan) {
            const loi = new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
            loi.status = 401;
            throw loi;
        }

        if (taiKhoan.trang_thai !== 'hoat_dong') {
            const loi = new Error('Tài khoản của bạn đang bị khóa hoặc ngừng hoạt động');
            loi.status = 403;
            throw loi;
        }

        const hopLe = await soSanhMatKhau(matKhau, taiKhoan.mat_khau_hash);
        if (!hopLe) {
            const loi = new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
            loi.status = 401;
            throw loi;
        }

        // Cập nhật mốc thời gian đăng nhập
        taiKhoanModel.capNhatLanDangNhapCuoi(taiKhoan.id);

        // Sinh JWT Token
        const token = jwt.sign(
            {
                taiKhoanId: taiKhoan.id,
                tenDangNhap: taiKhoan.ten_dang_nhap,
                vaiTro: taiKhoan.ma_vai_tro,
                nhanVienId: taiKhoan.nhan_vien_id,
                hoTen: taiKhoan.ho_ten
            },
            cauHinh.jwtSecret,
            { expiresIn: cauHinh.jwtThoiGianHetHan }
        );

        // Ghi Audit Log đăng nhập
        ghiAuditLog({
            taiKhoanId: taiKhoan.id,
            hanhDong: 'DANG_NHAP_HE_THONG',
            bangAnhHuong: 'tai_khoan',
            banGhiId: taiKhoan.id,
            diaChiIp,
            thietBi,
            lyDo: `Đăng nhập thành công với vai trò ${taiKhoan.ten_vai_tro}`
        });

        const thongTinNguoiDung = {
            id: taiKhoan.id,
            taiKhoanId: taiKhoan.id,
            tenDangNhap: taiKhoan.ten_dang_nhap,
            vaiTro: taiKhoan.ma_vai_tro,
            tenVaiTro: taiKhoan.ten_vai_tro,
            nhanVienId: taiKhoan.nhan_vien_id,
            hoTen: taiKhoan.ho_ten,
            soDienThoai: taiKhoan.so_dien_thoai
        };

        return {
            token,
            nguoiDung: thongTinNguoiDung,
            nhanVien: thongTinNguoiDung
        };
    },

    /**
     * Lấy thông tin tài khoản hiện tại từ token
     */
    layThongTinHienTai(taiKhoanId) {
        const taiKhoan = taiKhoanModel.timTheoId(taiKhoanId);
        if (!taiKhoan) {
            const loi = new Error('Không tìm thấy tài khoản');
            loi.status = 404;
            throw loi;
        }
        return taiKhoan;
    },

    /**
     * Đổi mật khẩu
     */
    async doiMatKhau(taiKhoanId, { matKhauCu, matKhauMoi }) {
        if (!matKhauCu || !matKhauMoi) {
            const loi = new Error('Vui lòng cung cấp mật khẩu cũ và mật khẩu mới');
            loi.status = 400;
            throw loi;
        }

        if (matKhauMoi.length < 6) {
            const loi = new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
            loi.status = 400;
            throw loi;
        }

        const taiKhoan = taiKhoanModel.timTheoId(taiKhoanId);
        // Lấy lại mật khẩu hash
        const tkFull = taiKhoanModel.timTheoTenDangNhap(taiKhoan.ten_dang_nhap);
        const dungMatKhauCu = await soSanhMatKhau(matKhauCu, tkFull.mat_khau_hash);
        if (!dungMatKhauCu) {
            const loi = new Error('Mật khẩu hiện tại không chính xác');
            loi.status = 400;
            throw loi;
        }

        const hashMoi = await bamMatKhau(matKhauMoi);
        taiKhoanModel.capNhatMatKhau(taiKhoanId, hashMoi);

        ghiAuditLog({
            taiKhoanId,
            hanhDong: 'DOI_MAT_KHAU',
            bangAnhHuong: 'tai_khoan',
            banGhiId: taiKhoanId,
            lyDo: 'Người dùng đổi mật khẩu cá nhân'
        });

        return true;
    },

    // =========================================================================
    // QUẢN TRỊ NHÂN SỰ TOÀN HỆ THỐNG (A02, A03, A04, A05)
    // =========================================================================

    layDanhSachNhanSu() {
        return taiKhoanModel.layDanhSachNhanSu();
    },

    layChiTietNhanSu(id) {
        const nv = taiKhoanModel.layChiTietNhanSu(id);
        if (!nv) {
            const loi = new Error(`Không tìm thấy nhân viên có ID: ${id}`);
            loi.status = 404;
            throw loi;
        }
        return nv;
    },

    async taoNhanSu(duLieu, nguoiThucHien) {
        const { hoTen, tenDangNhap, matKhau = '123456', vaiTro = 'phuc_vu', soDienThoai, email, cccd, mucLuong, hinhThucLamViec, ngayVaoLam } = duLieu;

        if (!hoTen || !tenDangNhap) {
            const loi = new Error('Họ tên và tên đăng nhập không được để trống');
            loi.status = 400;
            throw loi;
        }

        // Kiểm tra trùng tên đăng nhập
        const tonTai = taiKhoanModel.timTheoTenDangNhap(tenDangNhap.trim());
        if (tonTai) {
            const loi = new Error(`Tên đăng nhập "${tenDangNhap}" đã được sử dụng`);
            loi.status = 409;
            throw loi;
        }

        const vaiTroDb = taiKhoanModel.timVaiTro(vaiTro);
        if (!vaiTroDb) {
            const loi = new Error(`Vai trò "${vaiTro}" không hợp lệ`);
            loi.status = 400;
            throw loi;
        }

        const matKhauHash = await bamMatKhau(matKhau);
        const nvMoi = taiKhoanModel.taoNhanSuVoiTaiKhoan({
            hoTen: hoTen.trim(),
            tenDangNhap: tenDangNhap.trim(),
            matKhauHash,
            vaiTroId: vaiTroDb.id,
            soDienThoai: soDienThoai ? soDienThoai.trim() : '',
            email: email ? email.trim() : '',
            cccd: cccd ? cccd.trim() : '',
            mucLuong: Number(mucLuong) || 0,
            hinhThucLamViec: hinhThucLamViec || 'toan_thoi_gian',
            ngayVaoLam
        });

        ghiAuditLog({
            taiKhoanId: nguoiThucHien?.taiKhoanId || 1,
            hanhDong: 'TAO_NHAN_SU_MOI',
            bangAnhHuong: 'nhan_vien',
            banGhiId: nvMoi.id,
            lyDo: `Tạo mới nhân viên ${hoTen} (${tenDangNhap}) vai trò ${vaiTroDb.ten_vai_tro}`
        });

        return nvMoi;
    },

    async capNhatNhanSu(id, duLieu, nguoiThucHien) {
        const nvCu = this.layChiTietNhanSu(id);
        const { hoTen, soDienThoai, email, cccd, mucLuong, hinhThucLamViec, vaiTro, matKhauMoi } = duLieu;

        let vaiTroId = null;
        if (vaiTro) {
            const vaiTroDb = taiKhoanModel.timVaiTro(vaiTro);
            if (!vaiTroDb) {
                const loi = new Error(`Vai trò "${vaiTro}" không hợp lệ`);
                loi.status = 400;
                throw loi;
            }
            vaiTroId = vaiTroDb.id;
        }

        let matKhauHash = null;
        if (matKhauMoi && matKhauMoi.trim().length >= 6) {
            matKhauHash = await bamMatKhau(matKhauMoi.trim());
        }

        const nvCapNhat = taiKhoanModel.capNhatThongTinNhanSu(id, {
            hoTen: hoTen ? hoTen.trim() : nvCu.ho_ten,
            soDienThoai: soDienThoai !== undefined ? soDienThoai.trim() : nvCu.so_dien_thoai,
            email: email !== undefined ? email.trim() : nvCu.email,
            cccd: cccd !== undefined ? cccd.trim() : nvCu.cccd,
            mucLuong: mucLuong !== undefined ? Number(mucLuong) : nvCu.muc_luong,
            hinhThucLamViec: hinhThucLamViec || nvCu.hinh_thuc_lam_viec,
            vaiTroId,
            matKhauHash
        });

        ghiAuditLog({
            taiKhoanId: nguoiThucHien?.taiKhoanId || 1,
            hanhDong: 'CAP_NHAT_THONG_TIN_NHAN_SU',
            bangAnhHuong: 'nhan_vien',
            banGhiId: id,
            lyDo: `Cập nhật thông tin nhân viên ${nvCu.ho_ten}`
        });

        return nvCapNhat;
    },

    doiTrangThaiNhanSu(id, trangThai, nguoiThucHien) {
        const hopLe = ['dang_lam', 'tam_khoa', 'tam_nghi', 'dinh_chi', 'da_nghi'];
        if (!hopLe.includes(trangThai)) {
            const loi = new Error(`Trạng thái "${trangThai}" không hợp lệ`);
            loi.status = 400;
            throw loi;
        }

        const nvCu = this.layChiTietNhanSu(id);
        const nvMoi = taiKhoanModel.doiTrangThaiNhanSu(id, trangThai);

        ghiAuditLog({
            taiKhoanId: nguoiThucHien?.taiKhoanId || 1,
            hanhDong: (trangThai === 'tam_khoa' || trangThai === 'tam_nghi' || trangThai === 'dinh_chi') ? 'DINH_CHI_NHAN_SU' : 'MO_KHOA_NHAN_SU',
            bangAnhHuong: 'nhan_vien',
            banGhiId: id,
            lyDo: `Đổi trạng thái nhân sự ${nvCu.ho_ten} thành ${trangThai}`
        });

        return nvMoi;
    },

    xoaNhanSu(id, nguoiThucHien) {
        const nvCu = this.layChiTietNhanSu(id);
        const ketQua = taiKhoanModel.xoaNhanSu(id);

        ghiAuditLog({
            taiKhoanId: nguoiThucHien?.taiKhoanId || 1,
            hanhDong: 'XOA_NHAN_SU',
            bangAnhHuong: 'nhan_vien',
            banGhiId: id,
            lyDo: `Xóa nhân viên ${nvCu.ho_ten} (${nvCu.ten_dang_nhap}) khỏi hệ thống`
        });

        return ketQua;
    }
};

module.exports = taiKhoanService;
