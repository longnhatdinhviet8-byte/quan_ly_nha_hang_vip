// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A11 · THIẾT LẬP BÀN VÀ QR (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { QrCode, Download, Printer, ArrowLeft, Check } from 'lucide-react';
import { DANH_SACH_BAN as DANH_SACH_BAN_MAU } from '../../dungChung/duLieuMau';

export default function TrangThietLapBanVaQr({ onQuayLai }) {
  const [banChon, setBanChon] = useState(DANH_SACH_BAN_MAU[7]); // Bàn 08

  const urlMenu = `https://quanmoc.vn/qr?ban=${banChon.ma_ban}&table=${encodeURIComponent(banChon.ten_ban)}`;
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlMenu)}`;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Tạo & in mã QR đặt bàn (E-Menu)
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Mỗi bàn có mã QR định danh riêng biệt, tự động nhận diện bàn ăn khi khách quét mã
          </p>
        </div>

        {onQuayLai && (
          <button
            onClick={onQuayLai}
            className="text-xs font-bold text-[#b64d2d] hover:underline flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Quay lại Danh sách bàn (A10)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Cột 1: Danh sách bàn để chọn */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2 max-h-[500px] overflow-y-auto">
          <span className="text-xs font-bold text-stone-700 block mb-2 uppercase">Chọn bàn muốn xuất QR:</span>
          {DANH_SACH_BAN_MAU.map(b => (
            <button
              key={b.ma_ban}
              onClick={() => setBanChon(b)}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                banChon.ma_ban === b.ma_ban
                  ? 'bg-[#b64d2d] text-white border-[#b64d2d] font-bold shadow-xs'
                  : 'bg-stone-50 text-[#272d29] border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>{b.ten_ban} ({b.ma_ban})</span>
              <span className={`text-[11px] ${banChon.ma_ban === b.ma_ban ? 'text-white/80' : 'text-stone-500'}`}>
                {b.khu_vuc}
              </span>
            </button>
          ))}
        </div>

        {/* Cột 2 & 3: Khung thiết kế thẻ để bàn (Tent card mockup) */}
        <div className="col-span-2 bg-white rounded-2xl p-8 border border-stone-200 shadow-xs flex flex-col items-center justify-center text-center">
          {/* Mockup biển mica để bàn */}
          <div className="w-80 bg-[#f9f7f2] border-4 border-[#2d4336] rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <span className="font-sans font-black text-3xl text-[#b64d2d]">mộc</span>
              <p className="text-[10px] font-bold tracking-widest uppercase text-stone-500 mt-0.5">ẨM THỰC VIỆT ĐƯƠNG ĐẠI</p>
            </div>

            <div className="bg-[#2d4336] text-white py-2 px-4 rounded-xl">
              <h3 className="text-lg font-black tracking-tight">{banChon.ten_ban.toUpperCase()}</h3>
              <p className="text-[11px] text-emerald-200">{banChon.khu_vuc} · {banChon.so_cho} chỗ</p>
            </div>

            <div className="w-48 h-48 bg-white p-2 rounded-2xl border-2 border-stone-200 mx-auto shadow-xs flex items-center justify-center">
              <img src={qrImg} alt="Mã QR bàn" className="w-full h-full object-contain" />
            </div>

            <div className="text-[11px] text-stone-600 leading-tight">
              <p className="font-bold text-[#272d29]">QUÉT MÃ ĐỂ XEM THỰC ĐƠN & GỌI MÓN</p>
              <p className="text-[10px] text-stone-500 mt-1">Không cần tải ứng dụng · Giỏ hàng dùng chung cả bàn</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => alert(`Đã tải file in ấn độ phân giải cao cho ${banChon.ten_ban}`)}
              className="py-3 px-5 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Download size={16} />
              <span>Tải file ảnh in ấn (SVG / PNG)</span>
            </button>

            <button
              onClick={() => alert(`Lệnh in thẻ bàn ${banChon.ten_ban} đã được gửi tới máy in`)}
              className="py-3 px-5 bg-[#2d4336] hover:bg-[#202e28] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer size={16} />
              <span>In ngay thẻ để bàn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
