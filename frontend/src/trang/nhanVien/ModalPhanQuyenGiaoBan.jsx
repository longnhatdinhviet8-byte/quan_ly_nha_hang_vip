// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A04 · PHÂN QUYỀN VÀ GIAO BÀN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { X, Shield, Check, MapPin } from 'lucide-react';

export default function ModalPhanQuyenGiaoBan({
  nhanVien = { ho_ten: 'Nguyễn Thị Lan', vai_tro: 'phuc_vu', khu_vuc_phu_trach: 'Tầng 1 · Bàn 01–12' },
  onDong,
  onLuuPhanQuyen
}) {
  const [khuVuc, setKhuVuc] = useState('Tầng 1 · Bàn 01–12');
  const [quyen, setQuyen] = useState({
    xemDonQr: true,
    duyetDonQr: true,
    datMonHo: true,
    chuyenGopBan: true,
    guiYeuCauHuyMon: true,
    inHoaDon: false,
    chietKhau: false
  });

  const toggleQuyen = (key) => {
    setQuyen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLuu = () => {
    onLuuPhanQuyen({ nhanVienId: nhanVien.id, khuVuc, quyen });
    onDong();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-stone-200">
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold text-[#b64d2d] uppercase tracking-wider">
              QUẢN TRỊ PHÂN QUYỀN
            </span>
            <h3 className="text-lg font-bold text-[#272d29]">
              Phân quyền & giao bàn: {nhanVien.ho_ten}
            </h3>
          </div>
          <button onClick={onDong} className="p-1 rounded-full hover:bg-stone-100 text-stone-500">
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Giao khu vực bàn */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5">
              KHU VỰC BÀN PHỤ TRÁCH *
            </label>
            <select
              value={khuVuc}
              onChange={(e) => setKhuVuc(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29] font-medium"
            >
              <option value="Tầng 1 · Bàn 01–12">Tầng 1 · Bàn 01–12</option>
              <option value="Tầng 2 · Bàn 201–208">Tầng 2 · Bàn 201–208</option>
              <option value="Sân vườn · SV01–SV06">Sân vườn · SV01–SV06</option>
              <option value="Toàn nhà hàng">Toàn nhà hàng (Dành cho Quản lý)</option>
            </select>
          </div>

          {/* Ma trận quyền hạn chi tiết */}
          <div>
            <label className="block font-bold text-stone-700 mb-2">
              QUYỀN THAO TÁC NGHIỆP VỤ:
            </label>
            <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
              {[
                { key: 'xemDonQr', label: 'Xem đơn gọi món QR khách hàng' },
                { key: 'duyetDonQr', label: 'Duyệt chuyển đơn QR xuống Bếp KDS' },
                { key: 'datMonHo', label: 'Đặt món trực tiếp hộ khách' },
                { key: 'chuyenGopBan', label: 'Chuyển bàn và gộp bàn' },
                { key: 'guiYeuCauHuyMon', label: 'Gửi yêu cầu hủy món (cần Quản lý duyệt)' },
                { key: 'inHoaDon', label: 'In hóa đơn tạm tính / thanh toán' },
                { key: 'chietKhau', label: 'Áp dụng giảm giá chiết khấu' }
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between cursor-pointer py-1 text-stone-700 hover:text-stone-900">
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={quyen[item.key]}
                    onChange={() => toggleQuyen(item.key)}
                    className="w-4 h-4 accent-[#b64d2d] rounded"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleLuu}
          className="w-full py-3.5 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Check size={18} />
          <span>Lưu cấu hình phân quyền</span>
        </button>
      </div>
    </div>
  );
}
