// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// C04 · GIỎ HÀNG CHUNG (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React from 'react';
import { Minus, Plus, Trash2, Users, Utensils } from 'lucide-react';
import HeaderKhach from '../../thanhPhan/HeaderKhach';
import DieuHuongDuoiKhach from '../../thanhPhan/DieuHuongDuoiKhach';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function TrangGioHang({
  ban = { ma_ban: 'B08', ten_ban: 'Bàn 08' },
  gioHang = [],
  onCapNhatSoLuong,
  onXoaMon,
  onGuiDon,
  onQuayLaiThucDon,
  onChuyenTab
}) {
  const tongTienMon = gioHang.reduce((sum, item) => sum + (item.gia * item.so_luong), 0);
  const vat = Math.round(tongTienMon * 0.08); // 8% VAT
  const tongCong = tongTienMon + vat;

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f9f7f2] flex flex-col justify-between pb-24 shadow-xl border-x border-[#272d29]/5">
      {/* Header chuẩn Figma */}
      <HeaderKhach
        tieuDe="Giỏ hàng chung"
        ban={ban}
        onQuayLai={onQuayLaiThucDon}
      />

      <main className="px-5 py-4 flex-1 space-y-4">
        {/* Banner Giỏ hàng chung thời gian thực */}
        <div className="bg-[#ebf4ed] border border-[#226b4c]/20 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 bg-[#226b4c]/10 text-[#226b4c] rounded-lg shrink-0 mt-0.5">
            <Users size={18} />
          </div>
          <div>
            <h3 className="font-bold text-xs text-[#226b4c] tracking-tight">
              Giỏ hàng chung · {ban.ten_ban || 'Bàn 08'}
            </h3>
            <p className="text-xs text-[#272d29]/80 mt-0.5 leading-relaxed">
              3 người đang cùng chọn món. Thay đổi được đồng bộ tự động theo thời gian thực.
            </p>
          </div>
        </div>

        {/* Tiêu đề danh sách */}
        <div className="pt-1">
          <h2 className="text-sm font-bold text-[#272d29]">
            Kiểm tra trước khi gửi
          </h2>
        </div>

        {/* Danh sách món trong giỏ */}
        {gioHang.length > 0 ? (
          <div className="space-y-3">
            {gioHang.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-white rounded-xl p-3.5 border border-[#272d29]/10 shadow-xs"
              >
                {/* Hàng 1: Tên món và giá */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-[#272d29] truncate">
                    {item.ten_mon}
                  </h4>
                  <span className="text-xs font-semibold text-[#b64d2d] shrink-0">
                    {item.so_luong} × {dinhDangTien(item.gia)}
                  </span>
                </div>

                {/* Hàng 2: Ghi chú và Bộ điều chỉnh số lượng */}
                <div className="flex items-center justify-between text-xs text-[#72776f] pt-1 border-t border-stone-100">
                  <span className="italic truncate max-w-[200px]">
                    {item.ghi_chu || 'Không có ghi chú'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCapNhatSoLuong(item.id, item.so_luong - 1)}
                      className="w-7 h-7 rounded-md border border-stone-300 flex items-center justify-center text-[#272d29] hover:bg-stone-100 transition-colors"
                      title="Giảm"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-[#272d29]">
                      {item.so_luong}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCapNhatSoLuong(item.id, item.so_luong + 1)}
                      className="w-7 h-7 rounded-md border border-stone-300 flex items-center justify-center text-[#272d29] hover:bg-stone-100 transition-colors"
                      title="Tăng"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300 p-6">
            <Utensils size={36} className="mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-semibold text-[#272d29]">Giỏ hàng đang trống</p>
            <p className="text-xs text-[#72776f] mt-1 mb-4">Mời bạn chọn món ngon từ thực đơn để tiếp tục</p>
            <button
              onClick={onQuayLaiThucDon}
              className="px-4 py-2 bg-[#b64d2d] text-white rounded-lg text-xs font-bold hover:bg-[#a14022]"
            >
              Chọn món ngay
            </button>
          </div>
        )}

        {/* Tóm tắt tiền */}
        {gioHang.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-[#272d29]/10 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between text-[#72776f]">
              <span>Tạm tính tiền món</span>
              <span className="font-semibold text-[#272d29]">{dinhDangTien(tongTienMon)}</span>
            </div>
            <div className="flex justify-between text-[#72776f]">
              <span>Thuế GTGT (VAT 8%)</span>
              <span className="font-semibold text-[#272d29]">{dinhDangTien(vat)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm text-[#272d29]">
              <span>Tổng thanh toán</span>
              <span className="text-base text-[#b64d2d]">{dinhDangTien(tongCong)}</span>
            </div>
          </div>
        )}

        {/* Nút gửi đơn gọi món */}
        {gioHang.length > 0 && (
          <button
            onClick={() => onGuiDon(gioHang)}
            className="w-full py-3.5 px-4 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-between"
          >
            <span>Gửi đơn gọi món</span>
            <span>{dinhDangTien(tongCong)}</span>
          </button>
        )}
      </main>

      {/* Điều hướng cuối */}
      <DieuHuongDuoiKhach
        tabHienTai="thucDon"
        onChuyenTab={onChuyenTab}
        soLuongMonDangCho={gioHang.reduce((sum, item) => sum + item.so_luong, 0)}
      />
    </div>
  );
}
