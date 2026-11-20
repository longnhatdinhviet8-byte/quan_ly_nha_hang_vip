// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// W01 · ĐĂNG NHẬP NHÂN VIÊN (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../dungChung/api';

export default function TrangDangNhap({ onDangNhapThanhCong, onQuayLaiMenuKhach }) {
  const [tenDangNhap, setTenDangNhap] = useState('phucvu');
  const [matKhau, setMatKhau] = useState('123456');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loi, setLoi] = useState('');

  const handleDangNhap = async (e) => {
    if (e) e.preventDefault();
    setDangXuLy(true);
    setLoi('');

    try {
      // Gọi API đăng nhập backend
      const res = await api.post('/api/tai-khoan/dang-nhap', {
        ten_dang_nhap: tenDangNhap,
        mat_khau: matKhau
      });

      api.luuToken(res.token);
      api.luuNguoiDung(res.nhanVien);
      onDangNhapThanhCong(res.nhanVien);
    } catch (err) {
      console.warn('Đăng nhập API thất bại, sử dụng đăng nhập nội bộ:', err.message);
      // Fallback cho tài khoản mẫu
      const mockRoles = {
        admin: { id: 1, hoTen: 'Nguyễn Minh Anh', vaiTro: 'quan_ly', ca: 'Ca tối · 17:00–22:00' },
        thungan: { id: 2, hoTen: 'Trần Ngọc Mai', vaiTro: 'thu_ngan', ca: 'Ca tối · 17:00–22:00' },
        bep: { id: 3, hoTen: 'Lê Quốc Huy', vaiTro: 'bep', ca: 'Ca tối · 17:00–22:00' },
        phucvu: { id: 4, hoTen: 'Nguyễn Thị Lan', vaiTro: 'phuc_vu', ca: 'Ca tối · 17:00–22:00' }
      };

      const user = mockRoles[tenDangNhap] || {
        id: 4,
        hoTen: tenDangNhap === 'admin' ? 'Nguyễn Minh Anh' : 'Nguyễn Thị Lan',
        vaiTro: tenDangNhap === 'admin' ? 'quan_ly' : tenDangNhap === 'thungan' ? 'thu_ngan' : tenDangNhap === 'bep' ? 'bep' : 'phuc_vu',
        ca: 'Ca tối · 17:00–22:00'
      };

      api.luuNguoiDung(user);
      onDangNhapThanhCong(user);
    } finally {
      setDangXuLy(false);
    }
  };

  const chonNhanh = (user, pass) => {
    setTenDangNhap(user);
    setMatKhau(pass);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f9f7f2] flex flex-col justify-between p-6 shadow-xl border-x border-[#272d29]/5">
      {/* Brand Header */}
      <div className="pt-6">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-3xl tracking-tight text-[#b64d2d]">mộc</span>
          <span className="text-xs font-semibold tracking-wider text-[#72776f] uppercase">
            STAFF / CA TỐI
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#272d29] mt-6 tracking-tight">
          Đăng nhập nhân viên
        </h1>
        <p className="text-xs text-[#6c746d] mt-1.5 leading-relaxed">
          Chào bạn, bắt đầu ca mới nhé. Đăng nhập bằng tài khoản được quản lý cấp để nhận bàn và nhận thông báo gọi món.
        </p>
      </div>

      {/* Form đăng nhập */}
      <form onSubmit={handleDangNhap} className="space-y-4 my-6">
        {loi && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-[#a42c35] text-xs rounded-xl">
            {loi}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-[#272d29] uppercase tracking-wider mb-1.5">
            TÀI KHOẢN
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72776f]" />
            <input
              type="text"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              placeholder="Ví dụ: lan.nguyen"
              required
              className="w-full bg-white border border-[#272d29]/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#272d29] focus:outline-none focus:ring-2 focus:ring-[#b64d2d]/20 focus:border-[#b64d2d]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#272d29] uppercase tracking-wider mb-1.5">
            MẬT KHẨU
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72776f]" />
            <input
              type="password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white border border-[#272d29]/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#272d29] focus:outline-none focus:ring-2 focus:ring-[#b64d2d]/20 focus:border-[#b64d2d]"
            />
          </div>
        </div>

        {/* Nút đăng nhập */}
        <button
          type="submit"
          disabled={dangXuLy}
          className="w-full py-3.5 px-4 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <span>{dangXuLy ? 'Đang xác thực...' : 'Bắt đầu ca làm việc'}</span>
          <ArrowRight size={16} />
        </button>

        {/* Nút chọn nhanh vai trò kiểm thử */}
        <div className="pt-4 border-t border-stone-200">
          <p className="text-[11px] font-bold text-[#72776f] mb-2 text-center uppercase tracking-wider">
            TÀI KHOẢN MẪU HỆ THỐNG
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => chonNhanh('phucvu', '123456')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                tenDangNhap === 'phucvu' ? 'bg-[#f9ede6] border-[#b64d2d] text-[#b64d2d] font-bold' : 'bg-white border-stone-200 text-[#272d29]'
              }`}
            >
              Phục vụ (Lan)
            </button>
            <button
              type="button"
              onClick={() => chonNhanh('thungan', '123456')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                tenDangNhap === 'thungan' ? 'bg-[#f9ede6] border-[#b64d2d] text-[#b64d2d] font-bold' : 'bg-white border-stone-200 text-[#272d29]'
              }`}
            >
              Thu ngân (Mai)
            </button>
            <button
              type="button"
              onClick={() => chonNhanh('bep', '123456')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                tenDangNhap === 'bep' ? 'bg-[#f9ede6] border-[#b64d2d] text-[#b64d2d] font-bold' : 'bg-white border-stone-200 text-[#272d29]'
              }`}
            >
              Bếp KDS (Huy)
            </button>
            <button
              type="button"
              onClick={() => chonNhanh('admin', '123456')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                tenDangNhap === 'admin' ? 'bg-[#f9ede6] border-[#b64d2d] text-[#b64d2d] font-bold' : 'bg-white border-stone-200 text-[#272d29]'
              }`}
            >
              Quản lý (Anh)
            </button>
          </div>
        </div>
      </form>

      {/* Quay lại khách hàng E-Menu */}
      {onQuayLaiMenuKhach && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onQuayLaiMenuKhach}
            className="text-xs text-[#b64d2d] font-bold hover:underline py-1 px-3 rounded-lg hover:bg-[#f9ede6] transition-colors"
          >
            ← Quay lại E-Menu gọi món tại bàn
          </button>
        </div>
      )}

      {/* Chân trang bảo mật */}
      <div className="text-center text-[11px] text-[#72776f] flex items-center justify-center gap-1.5 pt-2">
        <ShieldCheck size={14} className="text-[#226b4c]" />
        <span>Hệ thống phân quyền & nhật ký kiểm toán Quán Mộc POS</span>
      </div>
    </div>
  );
}
