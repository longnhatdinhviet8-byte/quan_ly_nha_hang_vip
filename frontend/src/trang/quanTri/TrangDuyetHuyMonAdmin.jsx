// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A19 · DUYỆT HỦY MÓN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { ShieldAlert, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function TrangDuyetHuyMonAdmin() {
  const [danhSachYeuCau, setDanhSachYeuCau] = useState([
    {
      id: 1,
      ban: 'Bàn 08',
      tenMon: 'Cơm chiên hải sản',
      soLuong: 1,
      donGia: 129000,
      nguoiYeuCau: 'Nguyễn Thị Lan (Phục vụ)',
      thoiGian: '19:28 · 19/11/2026',
      lyDo: 'Khách đổi ý trước khi chế biến sang món khác',
      trangThai: 'cho_duyet'
    },
    {
      id: 2,
      ban: 'Bàn 04',
      tenMon: 'Trà đào cam sả',
      soLuong: 2,
      donGia: 45000,
      nguoiYeuCau: 'Trần Ngọc Mai (Thu ngân)',
      thoiGian: '18:50 · 19/11/2026',
      lyDo: 'Nhập nhầm số lượng từ 2 thành 4',
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
      <div>
        <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
          Phê duyệt yêu cầu hủy món (Void Items)
        </h1>
        <p className="text-xs text-[#72776f] mt-1">
          Chỉ có Quản lý mới có quyền phê duyệt hủy món đã gửi để tránh thất thoát và sai lệch kho
        </p>
      </div>

      <div className="space-y-4">
        {danhSachYeuCau.map((yc) => (
          <div
            key={yc.id}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex justify-between items-start gap-4 text-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#b64d2d]">{yc.ban}</span>
                <span className="font-bold text-[#272d29] text-sm">• {yc.tenMon} × {yc.soLuong}</span>
                <span className="font-bold text-rose-700">({dinhDangTien(yc.donGia * yc.soLuong)})</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <p><span className="font-bold text-stone-600">Nhân viên gửi:</span> {yc.nguoiYeuCau}</p>
                <p><span className="font-bold text-stone-600">Thời gian:</span> {yc.thoiGian}</p>
                <p><span className="font-bold text-stone-600">Lý do hủy:</span> "{yc.lyDo}"</p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 pt-2">
              {yc.trangThai === 'cho_duyet' ? (
                <>
                  <button
                    onClick={() => xuLy(yc.id, true)}
                    className="py-2.5 px-4 bg-[#226b4c] hover:bg-[#1a553c] text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Check size={16} />
                    <span>Duyệt hủy</span>
                  </button>
                  <button
                    onClick={() => xuLy(yc.id, false)}
                    className="py-2.5 px-3 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-[#a42c35] rounded-xl font-bold transition-colors"
                  >
                    <X size={16} />
                    <span>Từ chối</span>
                  </button>
                </>
              ) : (
                <span className={`px-3 py-1 rounded-full font-bold ${
                  yc.trangThai === 'da_duyet' ? 'bg-emerald-100 text-[#226b4c]' : 'bg-rose-100 text-[#a42c35]'
                }`}>
                  {yc.trangThai === 'da_duyet' ? '✓ Đã duyệt hủy' : '✗ Đã từ chối'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
