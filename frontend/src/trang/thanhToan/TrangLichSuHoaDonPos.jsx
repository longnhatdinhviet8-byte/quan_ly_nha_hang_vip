// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// P09 · LỊCH SỬ HÓA ĐƠN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Search, Printer, Calendar, Filter, Eye } from 'lucide-react';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function TrangLichSuHoaDonPos({ onXemChiTietIn }) {
  const [tuKhoa, setTuKhoa] = useState('');
  const [phuongThucLoc, setPhuongThucLoc] = useState('tat_ca');

  const danhSachHoaDon = [
    { ma: 'HD-0819', ban: 'Bàn 08', gio: '19:42 · 19/11/2026', tongTien: 838080, phuongThuc: 'VietQR', thuNgan: 'Trần Ngọc Mai', trangThai: 'da_thanh_toan' },
    { ma: 'HD-0818', ban: 'Bàn 02', gio: '18:55 · 19/11/2026', tongTien: 412000, phuongThuc: 'Tiền mặt', thuNgan: 'Trần Ngọc Mai', trangThai: 'da_thanh_toan' },
    { ma: 'HD-0817', ban: 'Bàn 05', gio: '18:15 · 19/11/2026', tongTien: 520000, phuongThuc: 'VietQR', thuNgan: 'Trần Ngọc Mai', trangThai: 'da_thanh_toan' },
    { ma: 'HD-0816', ban: 'Sân Vườn 01', gio: '17:40 · 19/11/2026', tongTien: 1250000, phuongThuc: 'VietQR', thuNgan: 'Trần Ngọc Mai', trangThai: 'da_thanh_toan' },
    { ma: 'HD-0815', ban: 'Bàn 201', gio: '17:10 · 19/11/2026', tongTien: 680000, phuongThuc: 'Tiền mặt', thuNgan: 'Trần Ngọc Mai', trangThai: 'da_thanh_toan' }
  ];

  const hoaDonLoc = danhSachHoaDon.filter(hd => {
    const khopTuKhoa = !tuKhoa || hd.ma.toLowerCase().includes(tuKhoa.toLowerCase()) || hd.ban.toLowerCase().includes(tuKhoa.toLowerCase());
    const khopPt = phuongThucLoc === 'tat_ca' || (phuongThucLoc === 'vietqr' && hd.phuongThuc === 'VietQR') || (phuongThucLoc === 'tien_mat' && hd.phuongThuc === 'Tiền mặt');
    return khopTuKhoa && khopPt;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Tiêu đề & thanh tìm kiếm */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Lịch sử hóa đơn thanh toán
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Tra cứu, kiểm tra lịch sử thanh toán trong ca và in lại hóa đơn K80
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm mã HĐ hoặc số bàn..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#b64d2d]"
            />
          </div>

          <select
            value={phuongThucLoc}
            onChange={(e) => setPhuongThucLoc(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700"
          >
            <option value="tat_ca">Tất cả phương thức</option>
            <option value="vietqr">VietQR</option>
            <option value="tien_mat">Tiền mặt</option>
          </select>
        </div>
      </div>

      {/* Bảng hóa đơn */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 font-bold text-[#72776f] uppercase">
            <tr>
              <th className="p-4">Mã hóa đơn</th>
              <th className="p-4">Bàn phục vụ</th>
              <th className="p-4">Thời gian</th>
              <th className="p-4">Phương thức</th>
              <th className="p-4">Thu ngân</th>
              <th className="p-4 text-right">Tổng tiền</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {hoaDonLoc.map((hd) => (
              <tr key={hd.ma} className="hover:bg-stone-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-[#b64d2d]">#{hd.ma}</td>
                <td className="p-4 font-bold text-[#272d29]">{hd.ban}</td>
                <td className="p-4 text-stone-500">{hd.gio}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    hd.phuongThuc === 'VietQR' ? 'bg-emerald-50 text-[#226b4c]' : 'bg-amber-50 text-[#795c21]'
                  }`}>
                    {hd.phuongThuc}
                  </span>
                </td>
                <td className="p-4 text-stone-600">{hd.thuNgan}</td>
                <td className="p-4 text-right font-extrabold text-sm text-[#272d29]">
                  {dinhDangTien(hd.tongTien)}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onXemChiTietIn(hd)}
                    className="p-2 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-[#b64d2d] transition-colors"
                    title="In lại hóa đơn"
                  >
                    <Printer size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
