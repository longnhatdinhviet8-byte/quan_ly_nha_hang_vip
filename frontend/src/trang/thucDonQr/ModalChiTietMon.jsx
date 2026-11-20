// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// C03 · CHI TIẾT MÓN (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { X, Minus, Plus, AlertCircle } from 'lucide-react';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function ModalChiTietMon({
  mon,
  onDong,
  onThemVaoGio
}) {
  if (!mon) return null;

  const [soLuong, setSoLuong] = useState(1);
  const [ghiChu, setGhiChu] = useState('');

  const tangSoLuong = () => setSoLuong(prev => prev + 1);
  const giamSoLuong = () => setSoLuong(prev => Math.max(1, prev - 1));

  const tongTien = mon.gia * soLuong;

  const handleXacNhan = () => {
    onThemVaoGio({
      ...mon,
      so_luong: soLuong,
      ghi_chu: ghiChu,
      thanh_tien: tongTien
    });
    onDong();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-[#f9f7f2] rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col border border-[#272d29]/10">
        {/* Hình ảnh và Nút đóng */}
        <div className="relative w-full h-56 bg-stone-200 shrink-0">
          <img
            src={mon.hinh_anh || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'}
            alt={mon.ten_mon}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onDong}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Nhãn loại món */}
            <div className="inline-block px-2.5 py-0.5 bg-[#f9ede6] text-[#b64d2d] rounded text-[11px] font-bold tracking-wider uppercase mb-2">
              {mon.nhan ? mon.nhan.toUpperCase() : 'BÁN CHẠY / MÓN CHÍNH'}
            </div>

            {/* Tên món và giá */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-xl font-bold text-[#272d29] leading-snug">
                {mon.ten_mon}
              </h2>
              <span className="text-lg font-bold text-[#b64d2d] shrink-0">
                {dinhDangTien(mon.gia)}
              </span>
            </div>

            {/* Mô tả món ăn */}
            <p className="text-sm text-[#6c746d] leading-relaxed mb-4">
              {mon.mo_ta || 'Thăn bò áp chảo, ớt chuông giòn ngọt, dùng cùng sốt tiêu đen đặc chế và khoai tây múi cau.'}
            </p>

            {/* Thông tin dị ứng */}
            <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3.5 mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#795c21] mb-1">
                <AlertCircle size={15} />
                <span>Thông tin dị ứng</span>
              </div>
              <p className="text-xs text-[#795c21] leading-relaxed">
                {mon.di_ung || 'Có đậu nành. Vui lòng báo nhân viên nếu bạn có dị ứng thực phẩm.'}
              </p>
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center justify-between py-3 border-y border-[#272d29]/10 mb-4">
              <span className="text-sm font-bold text-[#272d29]">Số lượng</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={giamSoLuong}
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-[#272d29] hover:bg-stone-200/50 transition-colors disabled:opacity-40"
                  disabled={soLuong <= 1}
                >
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center font-bold text-base text-[#272d29]">
                  {soLuong}
                </span>
                <button
                  type="button"
                  onClick={tangSoLuong}
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-[#272d29] hover:bg-stone-200/50 transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* Ghi chú cho bếp */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[#272d29] mb-1.5">
                Ghi chú cho bếp
              </label>
              <textarea
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Ví dụ: Ít cay, thịt chín vừa, không hành..."
                maxLength={200}
                rows={2}
                className="w-full text-sm bg-white border border-stone-200 rounded-xl p-3 text-[#272d29] focus:outline-none focus:ring-2 focus:ring-[#b64d2d]/20 focus:border-[#b64d2d] transition-all"
              />
              <div className="flex justify-between items-center text-[11px] text-[#72776f] mt-1 px-1">
                <span>Áp dụng cho cả {soLuong} phần</span>
                <span>{ghiChu.length}/200 ký tự</span>
              </div>
            </div>
          </div>

          {/* Nút thêm vào giỏ */}
          <button
            onClick={handleXacNhan}
            className="w-full py-3.5 px-4 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm tracking-wide flex items-center justify-between shadow-md active:scale-[0.99] transition-all"
          >
            <span>Thêm vào giỏ</span>
            <span>{dinhDangTien(tongTien)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
