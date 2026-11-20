// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// W11 · CA LÀM VÀ YÊU CẦU NGHỈ (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Send, ArrowRight } from 'lucide-react';
import HeaderNhanVien from '../../thanhPhan/HeaderNhanVien';

export default function TrangCaLamViecNhanVien({
  nhanVien = { hoTen: 'Nguyễn Thị Lan', ca: 'Ca tối' },
  onQuayLai,
  onChuyenTab,
  onDangXuat
}) {
  const [loaiYeuCau, setLoaiYeuCau] = useState('doi_ca'); // 'xin_nghi' | 'doi_ca'
  const [ngayChon, setNgayChon] = useState('2026-11-22');
  const [nguoiDoiCa, setNguoiDoiCa] = useState('Trần Ngọc Mai');
  const [lyDo, setLyDo] = useState('Có việc gia đình đột xuất cuối tuần');
  const [daGui, setDaGui] = useState(false);

  const lichTuan = [
    { thu: 'Thứ 2', ngay: '17/11', ca: 'Ca tối (17:00–22:00)', trangThai: 'da_xong' },
    { thu: 'Thứ 3', ngay: '18/11', ca: 'Ca tối (17:00–22:00)', trangThai: 'da_xong' },
    { thu: 'Thứ 4', ngay: '19/11', ca: 'Ca tối (17:00–22:00)', trangThai: 'dang_lam' },
    { thu: 'Thứ 5', ngay: '20/11', ca: 'Ca sáng (10:00–15:00)', trangThai: 'sap_toi' },
    { thu: 'Thứ 6', ngay: '21/11', ca: 'Nghỉ ca tuần', trangThai: 'nghi' },
    { thu: 'Thứ 7', ngay: '22/11', ca: 'Ca tối (17:00–22:30)', trangThai: 'sap_toi' },
    { thu: 'Chủ nhật', ngay: '23/11', ca: 'Ca cả ngày (10:00–22:00)', trangThai: 'sap_toi' }
  ];

  const handleGuiYeuCau = (e) => {
    e.preventDefault();
    setDaGui(true);
    setTimeout(() => {
      alert('Đã gửi yêu cầu đổi/nghỉ ca tới Quản lý xét duyệt (A07)');
      setDaGui(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f9f7f2] flex flex-col justify-between pb-8 shadow-xl border-x border-[#272d29]/5">
      <HeaderNhanVien
        tieuDe="Ca làm và yêu cầu nghỉ"
        nhanVien={nhanVien}
        tabHienTai="caLamViec"
        onChuyenTab={onChuyenTab}
        onDangXuat={onDangXuat}
      />

      <main className="px-4 py-3 space-y-4 flex-1">
        {/* Ca hiện tại đang làm việc */}
        <div className="bg-[#2d4336] text-white rounded-2xl p-4 shadow-sm border border-[#2d4336]">
          <span className="text-[11px] font-bold text-emerald-200 tracking-wider uppercase block mb-1">
            CA ĐANG LÀM VIỆC HÔM NAY
          </span>
          <h2 className="text-lg font-bold">
            Ca tối · 17:00 – 22:00
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#d8ead9] mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Check-in: 16:55 (Đúng giờ)</span>
            <span className="text-white/40">·</span>
            <span>Phụ trách Tầng 1 (Bàn 01–12)</span>
          </div>
        </div>

        {/* Lịch làm việc trong tuần */}
        <div className="bg-white rounded-2xl p-4 border border-[#272d29]/10 shadow-xs">
          <h3 className="text-xs font-bold text-[#272d29] uppercase mb-2.5">
            Lịch phân ca tuần này (17/11 - 23/11)
          </h3>
          <div className="space-y-2 text-xs">
            {lichTuan.map((l, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl flex items-center justify-between border ${
                  l.trangThai === 'dang_lam'
                    ? 'bg-[#f9ede6] border-[#b64d2d] text-[#b64d2d] font-bold'
                    : 'bg-stone-50 border-stone-200 text-[#272d29]'
                }`}
              >
                <div>
                  <span className="font-bold">{l.thu} ({l.ngay}): </span>
                  <span>{l.ca}</span>
                </div>
                {l.trangThai === 'dang_lam' && (
                  <span className="text-[10px] bg-[#b64d2d] text-white px-2 py-0.5 rounded-full font-bold">
                    Đang làm
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form gửi yêu cầu đổi ca / xin nghỉ */}
        <form onSubmit={handleGuiYeuCau} className="bg-white rounded-2xl p-4 border border-[#272d29]/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#272d29] uppercase">
            Tạo yêu cầu đổi ca / xin nghỉ
          </h3>

          {/* Tab chọn loại yêu cầu */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLoaiYeuCau('doi_ca')}
              className={`py-1.5 rounded-lg transition-all ${
                loaiYeuCau === 'doi_ca' ? 'bg-white text-[#272d29] shadow-xs font-bold' : 'text-[#72776f]'
              }`}
            >
              Đổi ca làm việc
            </button>
            <button
              type="button"
              onClick={() => setLoaiYeuCau('xin_nghi')}
              className={`py-1.5 rounded-lg transition-all ${
                loaiYeuCau === 'xin_nghi' ? 'bg-white text-[#272d29] shadow-xs font-bold' : 'text-[#72776f]'
              }`}
            >
              Xin nghỉ phép
            </button>
          </div>

          <div className="text-xs space-y-2.5">
            <div>
              <label className="block text-[11px] font-bold text-[#272d29] mb-1">
                NGÀY MUỐN ĐỔI / NGHỈ
              </label>
              <input
                type="date"
                value={ngayChon}
                onChange={(e) => setNgayChon(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
              />
            </div>

            {loaiYeuCau === 'doi_ca' && (
              <div>
                <label className="block text-[11px] font-bold text-[#272d29] mb-1">
                  NHÂN VIÊN ĐỔI CA CÙNG
                </label>
                <select
                  value={nguoiDoiCa}
                  onChange={(e) => setNguoiDoiCa(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
                >
                  <option value="Trần Ngọc Mai">Trần Ngọc Mai (Thu ngân / Phục vụ)</option>
                  <option value="Lê Quốc Huy">Lê Quốc Huy (Bếp)</option>
                  <option value="Hoàng Văn Nam">Hoàng Văn Nam (Phục vụ ca sáng)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#272d29] mb-1">
                LÝ DO CỤ THỂ
              </label>
              <textarea
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                placeholder="Nhập lý do gửi quản lý xét duyệt..."
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={daGui}
            className="w-full py-3 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send size={15} />
            <span>{daGui ? 'Đang gửi...' : 'Gửi yêu cầu tới Quản lý'}</span>
          </button>
        </form>
      </main>
    </div>
  );
}
