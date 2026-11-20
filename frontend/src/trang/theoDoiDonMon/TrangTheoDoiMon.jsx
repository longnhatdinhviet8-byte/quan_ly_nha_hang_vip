// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// C05 · THEO DÕI MÓN (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Clock, CheckCircle2, Flame, AlertCircle, PhoneCall, Receipt, Sparkles } from 'lucide-react';
import HeaderKhach from '../../thanhPhan/HeaderKhach';
import DieuHuongDuoiKhach from '../../thanhPhan/DieuHuongDuoiKhach';
import ModalGoiHoTro from './ModalGoiHoTro';
import ModalThongBaoHetMon from './ModalThongBaoHetMon';
import ModalDeXuatThayMon from './ModalDeXuatThayMon';
import { dinhDangTien } from '../../dungChung/dinhDang';
import { DON_MAU_BAN_08 } from '../../dungChung/duLieuMau';

export default function TrangTheoDoiMon({
  ban = { ma_ban: 'B08', ten_ban: 'Bàn 08' },
  donMon = DON_MAU_BAN_08,
  onYeuCauTinhTien,
  onChuyenTab,
  onGoiHoTro
}) {
  const [hienModalHoTro, setHienModalHoTro] = useState(false);
  const [hienModalHetMon, setHienModalHetMon] = useState(false);
  const [hienModalThayMon, setHienModalThayMon] = useState(false);

  const chiTiet = donMon?.chi_tiet || DON_MAU_BAN_08.chi_tiet;

  // Phân nhóm trạng thái món
  const monChoDuyet = chiTiet.filter(m => m.trang_thai === 'cho_duyet');
  const monDangNau = chiTiet.filter(m => m.trang_thai === 'dang_nau');
  const monDaPhucVu = chiTiet.filter(m => m.trang_thai === 'hoan_thanh' || m.trang_thai === 'da_phuc_vu');

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f9f7f2] flex flex-col justify-between pb-28 shadow-xl border-x border-[#272d29]/5">
      {/* Header chuẩn Figma */}
      <HeaderKhach
        tieuDe="Theo dõi món"
        ban={ban}
        onMoThongBao={() => setHienModalHoTro(true)}
      />

      <main className="px-5 py-4 flex-1 space-y-4">
        {/* Banner trạng thái đơn tổng */}
        <div className="bg-[#2d4336] text-white rounded-2xl p-4 shadow-sm border border-[#2d4336]">
          <div className="flex items-center gap-2 mb-1 text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wide uppercase">
              ĐÃ GỬI YÊU CẦU GỌI MÓN
            </span>
          </div>
          <h2 className="text-lg font-bold">
            Đơn #{donMon?.ma_don || 'ORD-081'} · {donMon?.thoi_gian || '19:25'}
          </h2>
          <p className="text-xs text-[#d8ead9] mt-0.5">
            Phục vụ {donMon?.phuc_vu_phu_trach || 'Nguyễn Thị Lan'} đang hỗ trợ bàn của bạn.
          </p>
        </div>

        {/* Danh sách các nhóm trạng thái món */}

        {/* 1. Đang chờ duyệt */}
        {monChoDuyet.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#795c21]">
              <Clock size={15} />
              <span>Chờ nhân viên duyệt ({monChoDuyet.length})</span>
            </div>
            {monChoDuyet.map((m) => (
              <div
                key={m.id}
                onClick={() => setHienModalHetMon(true)}
                className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors"
                title="Nhấn để xem giả lập cảnh báo hết món"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#272d29]">{m.ten_mon} × {m.so_luong}</h4>
                  <p className="text-[11px] text-[#795c21] mt-0.5">Đang đợi phục vụ xác nhận chuyển bếp</p>
                </div>
                <span className="text-xs font-semibold text-[#795c21]">Chờ duyệt</span>
              </div>
            ))}
          </div>
        )}

        {/* 2. Đang nấu */}
        {monDangNau.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#b64d2d]">
              <Flame size={15} />
              <span>Bếp đang chế biến ({monDangNau.length})</span>
            </div>
            {monDangNau.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-[#b64d2d]/20 rounded-xl p-3.5 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#272d29]">{m.ten_mon} × {m.so_luong}</h4>
                  <p className="text-[11px] text-[#72776f] mt-0.5 italic">{m.ghi_chu || 'Đang nấu trên chảo gang'}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-[#f9ede6] text-[#b64d2d] rounded text-[11px] font-bold">
                    Đang nấu
                  </span>
                  <p className="text-[10px] text-[#72776f] mt-1">Ước tính ~4p</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Hoàn thành & Đã phục vụ */}
        {monDaPhucVu.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#226b4c]">
              <CheckCircle2 size={15} />
              <span>Đã hoàn thành & lên bàn ({monDaPhucVu.length})</span>
            </div>
            {monDaPhucVu.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-stone-200 rounded-xl p-3.5 flex items-center justify-between opacity-80"
              >
                <div>
                  <h4 className="text-sm font-semibold text-[#272d29]">{m.ten_mon} × {m.so_luong}</h4>
                  <p className="text-[11px] text-[#72776f] mt-0.5">{m.ghi_chu || 'Đã phục vụ tại bàn'}</p>
                </div>
                <span className="text-xs font-bold text-[#226b4c] bg-[#ebf4ed] px-2 py-0.5 rounded">
                  Đã lên bàn
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Các nút gọi dịch vụ tại chỗ */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <button
            onClick={() => setHienModalHoTro(true)}
            className="py-3 px-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-[#272d29] flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <PhoneCall size={15} className="text-[#795c21]" />
            <span>Gọi hỗ trợ</span>
          </button>

          <button
            onClick={onYeuCauTinhTien}
            className="py-3 px-3 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Receipt size={15} />
            <span>Yêu cầu tính tiền</span>
          </button>
        </div>
      </main>

      {/* Điều hướng cuối */}
      <DieuHuongDuoiKhach
        tabHienTai="monDaGoi"
        onChuyenTab={onChuyenTab}
        soLuongMonDangCho={monDangNau.length + monChoDuyet.length}
      />

      {/* Modal C07 Gọi hỗ trợ */}
      {hienModalHoTro && (
        <ModalGoiHoTro
          ban={ban}
          onDong={() => setHienModalHoTro(false)}
          onGuiYeuCau={(req) => {
            console.log('Đã gửi hỗ trợ:', req);
          }}
        />
      )}

      {/* Modal C06/C13 Thông báo hết món */}
      {hienModalHetMon && (
        <ModalThongBaoHetMon
          monHet={monChoDuyet[0] || { ten_mon: 'Cơm chiên hải sản', so_luong: 1, gia: 129000 }}
          onDong={() => setHienModalHetMon(false)}
          onChonMonThayThe={() => {
            setHienModalHetMon(false);
            setHienModalThayMon(true);
          }}
          onXacNhanHuyMon={() => {
            setHienModalHetMon(false);
          }}
        />
      )}

      {/* Modal C14 Đề xuất thay món */}
      {hienModalThayMon && (
        <ModalDeXuatThayMon
          monHet={monChoDuyet[0] || { ten_mon: 'Cơm chiên hải sản', so_luong: 1, gia: 129000 }}
          onDong={() => setHienModalThayMon(false)}
          onDongYThayMon={(monMoi) => {
            setHienModalThayMon(false);
            alert(`Đã đổi sang: ${monMoi.ten_mon}`);
          }}
          onMoThucDonTuChon={() => {
            setHienModalThayMon(false);
            onChuyenTab('thucDon');
          }}
        />
      )}
    </div>
  );
}
