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

        return {
            token,
            nguoiDung: {
                taiKhoanId: taiKhoan.id,
                tenDangNhap: taiKhoan.ten_dang_nhap,
                vaiTro: taiKhoan.ma_vai_tro,
                tenVaiTro: taiKhoan.ten_vai_tro,
                nhanVienId: taiKhoan.nhan_vien_id,
                hoTen: taiKhoan.ho_ten,
                soDienThoai: taiKhoan.so_dien_thoai
            }
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
    }
};

module.exports = taiKhoanService;
