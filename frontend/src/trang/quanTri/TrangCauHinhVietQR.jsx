// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A09 · CẤU HÌNH VIETQR (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { QrCode, ShieldCheck, Check, Key, Link2 } from 'lucide-react';
import { DU_LIEU_NHA_HANG } from '../../dungChung/duLieuMau';

export default function TrangCauHinhVietQR() {
  const [nganHang, setNganHang] = useState(DU_LIEU_NHA_HANG.nganHang.tenNganHang);
  const [soTk, setSoTk] = useState(DU_LIEU_NHA_HANG.nganHang.soTaiKhoan);
  const [chuTk, setChuTk] = useState(DU_LIEU_NHA_HANG.nganHang.chuTaiKhoan);
  const [apiKey, setApiKey] = useState('vqr_live_98827374829102');
  const [tuDongKiemTra, setTuDongKiemTra] = useState(true);
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
          Cấu hình cổng thanh toán VietQR Napas 247
        </h1>
        <p className="text-xs text-[#72776f] mt-1">
          Thiết lập tài khoản ngân hàng thụ hưởng và khóa bảo mật Webhook khớp lệnh tự động
        </p>
      </div>

      <form onSubmit={handleLuu} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
        <div className="bg-[#2d4336] text-white p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-300" />
            <div>
              <p className="font-bold text-sm">NAPAS 247 Auto-Reconciliation</p>
              <p className="text-[11px] text-[#d8ead9]">Khớp mã đơn tự động theo cú pháp [MÃ BÀN] [MÃ HĐ]</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg">
            Đang hoạt động
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">NGÂN HÀNG THỤ HƯỞNG *</label>
            <select
              value={nganHang}
              onChange={(e) => setNganHang(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29] font-medium"
            >
              <option value="Vietcombank">Vietcombank (Ngân hàng TMCP Ngoại Thương)</option>
              <option value="MBBank">MBBank (Ngân hàng Quân Đội)</option>
              <option value="Techcombank">Techcombank</option>
              <option value="ACB">ACB (Ngân hàng Á Châu)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">SỐ TÀI KHOẢN NGÂN HÀNG *</label>
            <input
              type="text"
              value={soTk}
              onChange={(e) => setSoTk(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono font-bold text-[#272d29]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">TÊN CHỦ TÀI KHOẢN (IN HOA KHÔNG DẤU) *</label>
          <input
            type="text"
            value={chuTk}
            onChange={(e) => setChuTk(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 uppercase font-bold text-[#272d29]"
          />
        </div>

        <div className="pt-2 border-t">
          <label className="block font-bold text-stone-700 mb-1">API KEY WEBHOOK BẢO MẬT</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono text-stone-600"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="tuDong"
            checked={tuDongKiemTra}
            onChange={(e) => setTuDongKiemTra(e.target.checked)}
            className="w-4 h-4 accent-[#b64d2d] rounded"
          />
          <label htmlFor="tuDong" className="font-semibold text-stone-700 cursor-pointer">
            Tự động thông báo và in hóa đơn K80 ngay khi nhận tiền vào tài khoản
          </label>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="py-3.5 px-6 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Check size={16} />
            <span>{daLuu ? 'Đã lưu cấu hình VietQR!' : 'Lưu cấu hình VietQR'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
