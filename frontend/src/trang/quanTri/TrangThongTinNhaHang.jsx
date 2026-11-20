// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A08 · THÔNG TIN NHÀ HÀNG (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Store, MapPin, Phone, Wifi, Clock, Check } from 'lucide-react';
import { DU_LIEU_NHA_HANG } from '../../dungChung/duLieuMau';

export default function TrangThongTinNhaHang() {
  const [ten, setTen] = useState(DU_LIEU_NHA_HANG.ten);
  const [chiNhanh, setChiNhanh] = useState(DU_LIEU_NHA_HANG.chiNhanh);
  const [diaChi, setDiaChi] = useState(DU_LIEU_NHA_HANG.diaChi);
  const [hotline, setHotline] = useState(DU_LIEU_NHA_HANG.hotline);
  const [gioMoCua, setGioMoCua] = useState(DU_LIEU_NHA_HANG.gioMoCua);
  const [wifiTen, setWifiTen] = useState(DU_LIEU_NHA_HANG.wifi.ten);
  const [wifiPass, setWifiPass] = useState(DU_LIEU_NHA_HANG.wifi.matKhau);
  const [daLuu, setDaLuu] = useState(false);

  const handleLuu = (e) => {
    e.preventDefault();
    setDaLuu(true);
    setTimeout(() => setDaLuu(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
          Thông tin thương hiệu & nhà hàng
        </h1>
        <p className="text-xs text-[#72776f] mt-1">
          Thiết lập thông tin hiển thị trên trang E-Menu khách hàng và hóa đơn in nhiệt K80
        </p>
      </div>

      <form onSubmit={handleLuu} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">TÊN THƯƠNG HIỆU *</label>
            <input
              type="text"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29] font-bold"
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">CHI NHÁNH *</label>
            <input
              type="text"
              value={chiNhanh}
              onChange={(e) => setChiNhanh(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">ĐỊA CHỈ HOẠT ĐỘNG *</label>
          <input
            type="text"
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">HOTLINE ĐẶT BÀN & HỖ TRỢ</label>
            <input
              type="text"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29]"
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">GIỜ PHỤC VỤ</label>
            <input
              type="text"
              value={gioMoCua}
              onChange={(e) => setGioMoCua(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <label className="block font-bold text-stone-700 mb-1">TÊN WI-FI KHÁCH HÀNG</label>
            <input
              type="text"
              value={wifiTen}
              onChange={(e) => setWifiTen(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29]"
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">MẬT KHẨU WI-FI</label>
            <input
              type="text"
              value={wifiPass}
              onChange={(e) => setWifiPass(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono text-[#272d29]"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="py-3 px-6 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Check size={16} />
            <span>{daLuu ? 'Đã lưu thay đổi!' : 'Lưu thông tin nhà hàng'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
