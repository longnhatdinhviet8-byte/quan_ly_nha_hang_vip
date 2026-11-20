// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A05 · CẤP TÀI KHOẢN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { X, Key, ShieldCheck, UserPlus } from 'lucide-react';

export default function ModalCapTaiKhoan({
  onDong,
  onTaoTaiKhoan
}) {
  const [hoTen, setHoTen] = useState('');
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('123456');
  const [vaiTro, setVaiTro] = useState('phuc_vu');
  const [soDienThoai, setSoDienThoai] = useState('');

  const handleTao = (e) => {
    e.preventDefault();
    onTaoTaiKhoan({
      hoTen,
      tenDangNhap,
      matKhau,
      vaiTro,
      soDienThoai
    });
    onDong();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200">
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold text-[#b64d2d] uppercase tracking-wider">
              QUẢN LÝ TÀI KHOẢN
            </span>
            <h3 className="text-lg font-bold text-[#272d29]">
              Cấp tài khoản nhân viên mới
            </h3>
          </div>
          <button onClick={onDong} className="p-1 rounded-full hover:bg-stone-100 text-stone-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleTao} className="py-4 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">HỌ VÀ TÊN NHÂN VIÊN *</label>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder="Ví dụ: Hoàng Văn Nam"
              required
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">TÊN ĐĂNG NHẬP *</label>
            <input
              type="text"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              placeholder="Ví dụ: nam.hoang"
              required
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">MẬT KHẨU BAN ĐẦU *</label>
            <input
              type="text"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono text-[#272d29]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">VAI TRÒ TRUY CẬP *</label>
            <select
              value={vaiTro}
              onChange={(e) => setVaiTro(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29] font-medium"
            >
              <option value="phuc_vu">Nhân viên Phục vụ (Mobile/Tablet)</option>
              <option value="thu_ngan">Thu ngân (POS Desktop)</option>
              <option value="bep">Đầu bếp / KDS (Kitchen Display)</option>
              <option value="quan_ly">Quản lý nhà hàng (Admin Full)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">SỐ ĐIỆN THOẠI</label>
            <input
              type="tel"
              value={soDienThoai}
              onChange={(e) => setSoDienThoai(e.target.value)}
              placeholder="09xx xxx xxx"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              <span>Tạo tài khoản & cấp quyền</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
