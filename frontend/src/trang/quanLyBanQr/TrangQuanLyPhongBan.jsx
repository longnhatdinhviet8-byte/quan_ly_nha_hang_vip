// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A10 · QUẢN LÝ PHÒNG BÀN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, QrCode, Check } from 'lucide-react';
import { DANH_SACH_BAN as DANH_SACH_BAN_MAU } from '../../dungChung/duLieuMau';

export default function TrangQuanLyPhongBan({ onChuyenSangTaoQr }) {
  const [danhSach, setDanhSach] = useState(DANH_SACH_BAN_MAU);
  const [khuVucChon, setKhuVucChon] = useState('Tất cả');

  const banLoc = danhSach.filter(b => khuVucChon === 'Tất cả' || b.khu_vuc === khuVucChon);

  const themBanMoi = () => {
    const ma = prompt('Nhập mã bàn mới (Ví dụ: B13):', `B${danhSach.length + 1}`);
    if (!ma) return;
    const ten = prompt('Nhập tên hiển thị (Ví dụ: Bàn 13):', `Bàn ${danhSach.length + 1}`);
    const khuVuc = prompt('Nhập khu vực (Tầng 1, Tầng 2, Sân vườn):', 'Tầng 1');
    const soCho = Number(prompt('Nhập số chỗ ngồi:', '4')) || 4;

    const banMoi = {
      ma_ban: ma,
      ten_ban: ten || ma,
      khu_vuc: khuVuc,
      so_cho: soCho,
      trang_thai: 'trong',
      so_khach: 0,
      tam_tinh: 0
    };
    setDanhSach(prev => [...prev, banMoi]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Quản lý danh sách phòng & bàn ăn
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Thiết lập khu vực không gian nhà hàng, tạo bàn mới và đồng bộ sơ đồ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onChuyenSangTaoQr}
            className="py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-200 text-[#272d29] rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <QrCode size={16} className="text-[#b64d2d]" />
            <span>Xuất mã QR các bàn (A11) →</span>
          </button>

          <button
            onClick={themBanMoi}
            className="py-2.5 px-4 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Thêm bàn mới</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc khu vực */}
      <div className="flex items-center gap-2">
        {['Tất cả', 'Tầng 1', 'Tầng 2', 'Sân vườn'].map(kv => (
          <button
            key={kv}
            onClick={() => setKhuVucChon(kv)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              khuVucChon === kv ? 'bg-[#272d29] text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {kv}
          </button>
        ))}
      </div>

      {/* Lưới các bàn */}
      <div className="grid grid-cols-4 gap-4">
        {banLoc.map((b) => (
          <div key={b.ma_ban} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-[#b64d2d] uppercase block">{b.ma_ban}</span>
                <h3 className="text-xl font-black text-[#272d29]">{b.ten_ban}</h3>
              </div>
              <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-semibold">
                {b.so_cho} chỗ
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-xs">
              <span className="text-stone-500 font-medium">{b.khu_vuc}</span>
              <span className="text-emerald-700 font-bold">Hoạt động</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
