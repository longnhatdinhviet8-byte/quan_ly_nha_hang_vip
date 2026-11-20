// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// W02 · SƠ ĐỒ BÀN (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import HeaderNhanVien from '../../thanhPhan/HeaderNhanVien';
import ModalTrungTamThongBao from './ModalTrungTamThongBao';
import ModalDuyetDonQr from './ModalDuyetDonQr';
import ModalTuChoiDonQr from './ModalTuChoiDonQr';
import { NHAN_TRANG_THAI_BAN } from '../../dungChung/hangSo';
import { DANH_SACH_BAN as DANH_SACH_BAN_MAU } from '../../dungChung/duLieuMau';
import { dinhDangTien } from '../../dungChung/dinhDang';
import { api } from '../../dungChung/api';

export default function TrangSoDoBan({
  nhanVien = { hoTen: 'Nguyễn Thị Lan', ca: 'Ca tối' },
  danhSachBan: danhSachBanTruyenVao,
  onChonBan,
  onChuyenTab,
  onDangXuat
}) {
  const [khuVucChon, setKhuVucChon] = useState('Tầng 1');
  const [hienThongBao, setHienThongBao] = useState(false);
  const [hienDuyetQr, setHienDuyetQr] = useState(false);
  const [hienTuChoiQr, setHienTuChoiQr] = useState(false);
  const [soThongBao, setSoThongBao] = useState(3);
  const [danhSachBanApi, setDanhSachBanApi] = useState(danhSachBanTruyenVao || null);

  // Nạp danh sách bàn từ Backend API
  const napDanhSachBan = () => {
    api.get('/api/ban-an')
      .then(res => {
        if (res && Array.isArray(res)) {
          setDanhSachBanApi(res);
        } else if (res && Array.isArray(res.danhSach)) {
          setDanhSachBanApi(res.danhSach);
        }
      })
      .catch(err => {
        console.warn('Lấy danh sách bàn từ API thất bại, chuyển fallback dữ liệu mẫu:', err.message);
      });
  };

  useEffect(() => {
    if (!danhSachBanTruyenVao) {
      napDanhSachBan();
    }
  }, [danhSachBanTruyenVao]);

  const danhSachBan = danhSachBanApi !== null ? danhSachBanApi : DANH_SACH_BAN_MAU;

  // Lọc danh sách bàn theo khu vực
  const banHienThi = (danhSachBan || DANH_SACH_BAN_MAU).filter(b => b.khu_vuc === khuVucChon);

  const tongSoBan = banHienThi.length;
  const soBanCoKhach = banHienThi.filter(b => b.trang_thai !== 'trong').length;

  const mauTrangThai = {
    trong: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    co_khach: 'bg-blue-50 text-blue-700 border-blue-200',
    cho_mon: 'bg-amber-50 text-amber-700 border-amber-200',
    yeu_cau_thanh_toan: 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse',
    can_don_dep: 'bg-stone-100 text-stone-600 border-stone-300'
  };

  const tenTrangThai = {
    trong: 'Trống',
    co_khach: 'Có khách',
    cho_mon: 'Chờ món',
    yeu_cau_thanh_toan: 'Thanh toán',
    can_don_dep: 'Cần dọn dẹp'
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f9f7f2] flex flex-col justify-between pb-8 shadow-xl border-x border-[#272d29]/5">
      {/* Header chuẩn Figma */}
      <HeaderNhanVien
        tieuDe="Sơ đồ bàn"
        nhanVien={nhanVien}
        tabHienTai="soDoBan"
        onChuyenTab={onChuyenTab}
        soThongBaoChuaXuLy={soThongBao}
        onDangXuat={onDangXuat}
      />

      <main className="px-4 py-3 space-y-3.5 flex-1">
        {/* Banner chào và thông tin ca */}
        <div className="bg-white rounded-2xl p-4 border border-[#272d29]/10 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#272d29]">
              Xin chào, {nhanVien.hoTen?.split(' ').pop() || 'Lan'} · {nhanVien.ca || 'Ca tối'}
            </h2>
            <p className="text-xs text-[#72776f] mt-0.5">
              {khuVucChon} · Bàn 01–12 · 17:00–22:00
            </p>
          </div>

          <button
            onClick={() => setHienThongBao(true)}
            className="px-3 py-1.5 bg-[#f9ede6] hover:bg-[#b64d2d] text-[#b64d2d] hover:text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            {soThongBao} đơn chờ
          </button>
        </div>

        {/* Bộ chọn khu vực */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {['Tầng 1', 'Tầng 2', 'Sân vườn'].map((kv) => (
              <button
                key={kv}
                onClick={() => setKhuVucChon(kv)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  khuVucChon === kv
                    ? 'bg-[#272d29] text-white shadow-xs'
                    : 'bg-white text-[#72776f] border border-stone-200 hover:border-stone-300'
                }`}
              >
                {kv}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-semibold text-[#72776f]">
            {tongSoBan} bàn · {soBanCoKhach} có khách
          </span>
        </div>

        {/* Lưới các bàn ăn */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {banHienThi.map((ban) => {
            const badgeClass = mauTrangThai[ban.trang_thai] || 'bg-stone-100 text-stone-600 border-stone-200';
            const label = tenTrangThai[ban.trang_thai] || ban.trang_thai;
            const maSo = ban.ma_ban.replace(/^[A-Za-z\-]+/, '');

            return (
              <div
                key={ban.ma_ban}
                onClick={() => onChonBan(ban)}
                className="bg-white rounded-2xl p-4 border border-[#272d29]/10 shadow-xs cursor-pointer hover:border-[#b64d2d]/40 transition-all active:scale-[0.98] flex flex-col justify-between h-32"
              >
                {/* Dòng mã bàn và trạng thái */}
                <div className="flex items-start justify-between">
                  <span className="font-extrabold text-2xl text-[#272d29] leading-none">
                    {maSo || ban.ma_ban}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                    {label}
                  </span>
                </div>

                {/* Thông tin bàn và số tiền */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#72776f]">
                    <span>{ban.so_cho} chỗ</span>
                    {ban.so_khach > 0 && <span>{ban.so_khach} khách</span>}
                  </div>

                  {ban.tam_tinh > 0 && (
                    <div className="font-bold text-xs text-[#b64d2d] truncate">
                      {dinhDangTien(ban.tam_tinh)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal W03 Trung tâm thông báo */}
      {hienThongBao && (
        <ModalTrungTamThongBao
          onDong={() => setHienThongBao(false)}
          onMoDuyetDon={() => {
            setHienThongBao(false);
            setHienDuyetQr(true);
          }}
        />
      )}

      {/* Modal W04 Duyệt đơn QR */}
      {hienDuyetQr && (
        <ModalDuyetDonQr
          onDong={() => setHienDuyetQr(false)}
          onDuyetThanhCong={() => {
            setHienDuyetQr(false);
            setSoThongBao(prev => Math.max(0, prev - 1));
          }}
          onTuChoi={() => {
            setHienDuyetQr(false);
            setHienTuChoiQr(true);
          }}
        />
      )}

      {/* Modal W05 Từ chối đơn QR */}
      {hienTuChoiQr && (
        <ModalTuChoiDonQr
          onDong={() => setHienTuChoiQr(false)}
          onXacNhanTuChoi={() => {
            setHienTuChoiQr(false);
            setSoThongBao(prev => Math.max(0, prev - 1));
          }}
        />
      )}
    </div>
  );
}
