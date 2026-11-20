// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A07 · DUYỆT NGHỈ VÀ ĐỔI CA (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Check, X, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function TrangDuyetNghiDoiCaAdmin({ onQuayLaiLich }) {
  const [danhSachYeuCau, setDanhSachYeuCau] = useState([
    {
      id: 1,
      nhanVien: 'Nguyễn Thị Lan (Phục vụ)',
      loai: 'Đổi ca làm việc',
      ngay: '22/11/2026',
      ca: 'Ca tối (17:00–22:30)',
      nguoiDoiCung: 'Trần Ngọc Mai (Thu ngân / Phục vụ)',
      lyDo: 'Có việc gia đình đột xuất cuối tuần',
      thoiGianGui: '18:30 · 19/11/2026',
      trangThai: 'cho_duyet'
    },
    {
      id: 2,
      nhanVien: 'Lê Quốc Huy (Bếp trưởng)',
      loai: 'Nghỉ phép năm',
      ngay: '25/11/2026',
      ca: 'Cả ngày',
      nguoiDoiCung: 'Bếp phó phụ trách thay',
      lyDo: 'Khám sức khỏe định kỳ',
      thoiGianGui: '14:10 · 19/11/2026',
      trangThai: 'cho_duyet'
    }
  ]);

  const xuLy = (id, chapNhan) => {
    setDanhSachYeuCau(prev =>
      prev.map(yc => yc.id === id ? { ...yc, trangThai: chapNhan ? 'da_duyet' : 'tu_choi' } : yc)
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Xét duyệt nghỉ phép & đổi ca làm việc
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Quản lý phê duyệt các yêu cầu từ nhân viên phục vụ, thu ngân và bếp
          </p>
        </div>

        {onQuayLaiLich && (
          <button
            onClick={onQuayLaiLich}
            className="text-xs font-bold text-[#b64d2d] hover:underline"
          >
            ← Quay lại Lịch phân ca (A06)
          </button>
        )}
      </div>

      <div className="space-y-4">
        {danhSachYeuCau.map((yc) => (
          <div
            key={yc.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex items-start justify-between gap-4 text-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#272d29]">{yc.nhanVien}</span>
                <span className="px-2 py-0.5 rounded-full font-bold bg-[#f9ede6] text-[#b64d2d]">
                  {yc.loai}
                </span>
                <span className="text-stone-400">· {yc.thoiGianGui}</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <p><span className="font-bold text-stone-600">Ngày yêu cầu:</span> {yc.ngay} ({yc.ca})</p>
                <p><span className="font-bold text-stone-600">Đổi cùng / Người thay:</span> {yc.nguoiDoiCung}</p>
                <p><span className="font-bold text-stone-600">Lý do:</span> "{yc.lyDo}"</p>
              </div>
            </div>

            {/* Trạng thái & Nút thao tác */}
            <div className="shrink-0 flex flex-col items-end justify-between h-full pt-1">
              {yc.trangThai === 'cho_duyet' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => xuLy(yc.id, true)}
                    className="py-2 px-4 bg-[#226b4c] hover:bg-[#1a553c] text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Check size={14} />
                    <span>Phê duyệt</span>
                  </button>
                  <button
                    onClick={() => xuLy(yc.id, false)}
                    className="py-2 px-3 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-[#a42c35] rounded-xl font-bold transition-colors"
                  >
                    <X size={14} />
                    <span>Từ chối</span>
                  </button>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  yc.trangThai === 'da_duyet' ? 'bg-emerald-100 text-[#226b4c]' : 'bg-rose-100 text-[#a42c35]'
                }`}>
                  {yc.trangThai === 'da_duyet' ? '✓ Đã phê duyệt' : '✗ Đã từ chối'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
