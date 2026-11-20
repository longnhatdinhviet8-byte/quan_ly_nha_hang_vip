// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// W06 · CHI TIẾT BÀN (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { ArrowLeft, Clock, Users, Plus, ArrowRight, Merge, Trash2, Receipt, PhoneCall } from 'lucide-react';
import HeaderNhanVien from '../../thanhPhan/HeaderNhanVien';
import ModalDatMonHoKhach from './ModalDatMonHoKhach';
import ModalChuyenBan from './ModalChuyenBan';
import ModalGopBan from './ModalGopBan';
import ModalYeuCauHuyMon from './ModalYeuCauHuyMon';
import { dinhDangTien } from '../../dungChung/dinhDang';
import { DON_MAU_BAN_08 } from '../../dungChung/duLieuMau';

export default function TrangChiTietBan({
  ban = { ma_ban: 'B08', ten_ban: 'Bàn 08', khu_vuc: 'Tầng 1', so_cho: 4, so_khach: 4, thoi_gian_vao: '19:08' },
  donMon = DON_MAU_BAN_08,
  onQuayLai,
  onBaoThanhToan
}) {
  const [hienDatMon, setHienDatMon] = useState(false);
  const [hienChuyenBan, setHienChuyenBan] = useState(false);
  const [hienGopBan, setHienGopBan] = useState(false);
  const [hienHuyMon, setHienHuyMon] = useState(false);

  const chiTiet = donMon?.chi_tiet || DON_MAU_BAN_08.chi_tiet;
  const tongTien = donMon?.tong_tien_mon || 776000;

  const mauTrangThaiMon = {
    cho_duyet: 'bg-amber-100 text-amber-800',
    dang_nau: 'bg-orange-100 text-[#b64d2d]',
    hoan_thanh: 'bg-emerald-100 text-emerald-800',
    da_phuc_vu: 'bg-stone-100 text-stone-600'
  };

  const tenTrangThaiMon = {
    cho_duyet: 'Chờ duyệt',
    dang_nau: 'Đang nấu',
    hoan_thanh: 'Nấu xong',
    da_phuc_vu: 'Đã lên bàn'
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f9f7f2] flex flex-col justify-between pb-8 shadow-xl border-x border-[#272d29]/5">
      <HeaderNhanVien
        tieuDe={`Chi tiết ${ban.ten_ban || 'Bàn 08'}`}
        onQuayLai={onQuayLai}
      />

      <main className="px-4 py-3 space-y-3.5 flex-1">
        {/* Banner tổng quan bàn */}
        <div className="bg-white rounded-2xl p-4 border border-[#272d29]/10 shadow-xs">
          <div className="flex justify-between items-start pb-3 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold text-[#b64d2d] uppercase tracking-wider">
                {ban.khu_vuc || 'TẦNG 1'}
              </span>
              <h2 className="text-xl font-bold text-[#272d29]">
                {ban.ten_ban || 'Bàn 08'}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#226b4c] bg-[#ebf4ed] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#226b4c]"></span>
              Đang phục vụ
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center text-xs">
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[#72776f] block text-[11px]">Số khách</span>
              <span className="font-bold text-[#272d29]">{ban.so_khach || 4} khách</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[#72776f] block text-[11px]">Giờ vào</span>
              <span className="font-bold text-[#272d29]">{ban.thoi_gian_vao || '19:08'}</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[#72776f] block text-[11px]">Thời gian ngồi</span>
              <span className="font-bold text-[#2d4336]">34 phút</span>
            </div>
          </div>
        </div>

        {/* Danh sách món ăn của bàn */}
        <div className="bg-white rounded-2xl p-4 border border-[#272d29]/10 shadow-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-stone-100">
            <span className="text-xs font-bold text-[#272d29]">Danh sách món ăn ({chiTiet.length})</span>
            <span className="text-xs font-bold text-[#b64d2d]">{dinhDangTien(tongTien)}</span>
          </div>

          <div className="divide-y divide-stone-100 py-1">
            {chiTiet.map((item) => (
              <div key={item.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                <div>
                  <h4 className="font-bold text-[#272d29]">
                    {item.ten_mon} <span className="text-[#b64d2d]">× {item.so_luong}</span>
                  </h4>
                  {item.ghi_chu && (
                    <p className="text-[11px] text-[#795c21] italic mt-0.5">
                      Ghi chú: {item.ghi_chu}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-[#272d29] block">
                    {dinhDangTien(item.thanh_tien || (item.don_gia * item.so_luong))}
                  </span>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${mauTrangThaiMon[item.trang_thai] || 'bg-stone-100 text-stone-600'}`}>
                    {tenTrangThaiMon[item.trang_thai] || item.trang_thai}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nhóm nút thao tác nghiệp vụ phục vụ */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setHienDatMon(true)}
            className="p-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-[#272d29] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus size={15} className="text-[#b64d2d]" />
            <span>Đặt món hộ (W07)</span>
          </button>

          <button
            onClick={() => setHienChuyenBan(true)}
            className="p-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-[#272d29] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <ArrowRight size={15} className="text-[#2d4336]" />
            <span>Chuyển bàn (W08)</span>
          </button>

          <button
            onClick={() => setHienGopBan(true)}
            className="p-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-[#272d29] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Merge size={15} className="text-blue-600" />
            <span>Gộp bàn (W09)</span>
          </button>

          <button
            onClick={() => setHienHuyMon(true)}
            className="p-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-[#a42c35] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Trash2 size={15} />
            <span>Hủy món (W10)</span>
          </button>
        </div>

        {/* Nút báo thanh toán */}
        <button
          onClick={onBaoThanhToan}
          className="w-full py-3.5 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Receipt size={16} />
          <span>Báo thanh toán / In tạm tính</span>
        </button>
      </main>

      {/* Modal W07 */}
      {hienDatMon && (
        <ModalDatMonHoKhach
          ban={ban}
          onDong={() => setHienDatMon(false)}
          onXacNhanDatMon={(monMoi) => {
            setHienDatMon(false);
            alert(`Đã thêm ${monMoi.length} món cho ${ban.ten_ban}`);
          }}
        />
      )}

      {/* Modal W08 */}
      {hienChuyenBan && (
        <ModalChuyenBan
          banHienTai={ban}
          onDong={() => setHienChuyenBan(false)}
          onXacNhanChuyen={(info) => {
            setHienChuyenBan(false);
            alert(`Đã chuyển từ ${info.banNguon} sang ${info.banDich}`);
            onQuayLai();
          }}
        />
      )}

      {/* Modal W09 */}
      {hienGopBan && (
        <ModalGopBan
          banHienTai={ban}
          onDong={() => setHienGopBan(false)}
          onXacNhanGop={(info) => {
            setHienGopBan(false);
            alert(`Đã gộp ${info.banChinh} và ${info.banPhu}`);
          }}
        />
      )}

      {/* Modal W10 */}
      {hienHuyMon && (
        <ModalYeuCauHuyMon
          ban={ban}
          danhSachMon={chiTiet}
          onDong={() => setHienHuyMon(false)}
          onGuiYeuCauHuy={(req) => {
            setHienHuyMon(false);
            alert(`Đã gửi yêu cầu hủy món ${req.tenMon} tới Quản lý xét duyệt`);
          }}
        />
      )}
    </div>
  );
}
