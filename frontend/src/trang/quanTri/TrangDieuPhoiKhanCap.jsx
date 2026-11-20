// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A18 · ĐIỀU PHỐI KHẨN CẤP (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Flame, AlertTriangle, Send, CheckCircle2, Clock } from 'lucide-react';
import { DANH_SACH_BAN as DANH_SACH_BAN_MAU, CHI_DAO_BEP_KHAN_CAP } from '../../dungChung/duLieuMau';

export default function TrangDieuPhoiKhanCap() {
  const [banChon, setBanChon] = useState('B08');
  const [noiDung, setNoiDung] = useState('Bàn 08 có khách VIP sắp đi đón tàu bay. Yêu cầu Bếp trưởng ưu tiên ra ngay 02 đĩa Bò lúc lắc trong vòng 5 phút!');
  const [mucDo, setMucDo] = useState('rat_gap');
  const [daPhatLenh, setDaPhatLenh] = useState(false);

  const [lichSuLenh, setLichSuLenh] = useState([
    {
      id: 1,
      thoiGian: '19:41 · 19/11/2026',
      ban: 'Bàn 08',
      noiDung: CHI_DAO_BEP_KHAN_CAP.noiDung,
      trangThai: 'Bếp trưởng đã xác nhận ưu tiên'
    }
  ]);

  const handlePhatLenh = (e) => {
    e.preventDefault();
    const lenhMoi = {
      id: Date.now(),
      thoiGian: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' · Hôm nay',
      ban: banChon,
      noiDung: noiDung,
      trangThai: 'Đã gửi tới màn hình Bếp KDS'
    };
    setLichSuLenh(prev => [lenhMoi, ...prev]);
    setDaPhatLenh(true);
    setTimeout(() => setDaPhatLenh(false), 2500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
          Điều phối khẩn cấp & giục bếp KDS
        </h1>
        <p className="text-xs text-[#72776f] mt-1">
          Gửi chỉ đạo gấp bắt buộc tới màn hình của Bếp trưởng (K05) kèm chuông cảnh báo
        </p>
      </div>

      {/* Form phát lệnh */}
      <form onSubmit={handlePhatLenh} className="bg-white p-6 rounded-2xl border-2 border-rose-200 shadow-md space-y-4 text-xs">
        <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider">
          <AlertTriangle size={18} />
          <span>PHÁT LỆNH BẮT BUỘC TỪ QUẢN LÝ</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">CHỌN BÀN CẦN ƯU TIÊN *</label>
            <select
              value={banChon}
              onChange={(e) => setBanChon(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29] font-bold"
            >
              {DANH_SACH_BAN_MAU.map(b => (
                <option key={b.ma_ban} value={b.ma_ban}>
                  {b.ten_ban} ({b.khu_vuc} · {b.trang_thai})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">MỨC ĐỘ KHẨN CẤP</label>
            <select
              value={mucDo}
              onChange={(e) => setMucDo(e.target.value)}
              className="w-full bg-rose-50 text-[#a42c35] border border-rose-200 rounded-xl p-3 font-bold"
            >
              <option value="rat_gap">Khẩn cấp (Bắt buộc Bếp bấm xác nhận trong 60 giây)</option>
              <option value="uu_tien">Ưu tiên ra trước món khác</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">NỘI DUNG CHỈ ĐẠO CỤ THỂ CHO BẾP *</label>
          <textarea
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            rows={3}
            required
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-[#272d29] font-medium leading-relaxed"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#a42c35] hover:bg-[#8e242c] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Send size={18} />
          <span>{daPhatLenh ? 'Đã phát lệnh thành công tới Bếp KDS!' : 'Phát lệnh khẩn cấp tới KDS (K05)'}</span>
        </button>
      </form>

      {/* Lịch sử lệnh đã phát */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-sm text-[#272d29]">Lịch sử chỉ đạo gần đây</h3>
        <div className="divide-y divide-stone-100">
          {lichSuLenh.map(l => (
            <div key={l.id} className="py-3 flex justify-between items-start gap-4">
              <div>
                <span className="font-bold text-[#a42c35]">{l.ban}:</span>
                <span className="text-[#272d29] ml-2">"{l.noiDung}"</span>
                <p className="text-[11px] text-stone-400 mt-1">{l.thoiGian}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-[#226b4c] shrink-0 text-[11px]">
                {l.trangThai}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
