// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// C02 · THỰC ĐƠN (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import HeaderKhach from '../../thanhPhan/HeaderKhach';
import DieuHuongDuoiKhach from '../../thanhPhan/DieuHuongDuoiKhach';
import ModalChiTietMon from './ModalChiTietMon';
import { dinhDangTien } from '../../dungChung/dinhDang';
import { DANH_MUC_THUC_DON, DANH_SACH_MON_AN, COMBO_GOI_Y } from '../../dungChung/duLieuMau';
import { api } from '../../dungChung/api';

export default function TrangThucDon({
  ban = { ma_ban: 'B08', ten_ban: 'Bàn 08' },
  danhSachMon: danhSachMonTruyenVao,
  gioHang = [],
  onThemVaoGio,
  onXemGioHang,
  onChuyenTab,
  onGoiHoTro
}) {
  const [tuKhoa, setTuKhoa] = useState('');
  const [danhMucChon, setDanhMucChon] = useState('all');
  const [monDangXem, setMonDangXem] = useState(null);
  const [danhSachMonApi, setDanhSachMonApi] = useState(danhSachMonTruyenVao || null);
  const [danhMucApi, setDanhMucApi] = useState(null);

  // Tự động nạp dữ liệu món ăn từ Backend API
  useEffect(() => {
    if (danhSachMonTruyenVao) return;
    api.get('/api/thuc-don')
      .then(res => {
        if (res) {
          if (Array.isArray(res.monAn)) {
            setDanhSachMonApi(res.monAn);
          } else if (Array.isArray(res)) {
            setDanhSachMonApi(res);
          }
          if (Array.isArray(res.danhMuc) && res.danhMuc.length > 0) {
            setDanhMucApi([
              { id: 'all', ten: 'Tất cả' },
              ...res.danhMuc.map(dm => ({ id: dm.id, ten: dm.ten_danh_muc || dm.ten }))
            ]);
          }
        }
      })
      .catch(err => {
        console.warn('Lấy thực đơn từ API thất bại, chuyển sang fallback dữ liệu mẫu:', err.message);
      });
  }, [danhSachMonTruyenVao]);

  const danhSachMon = danhSachMonApi !== null ? danhSachMonApi : DANH_SACH_MON_AN;
  const danhMucHienThi = danhMucApi || DANH_MUC_THUC_DON;

  // Lọc danh sách món ăn theo từ khóa và danh mục
  const monHienThi = useMemo(() => {
    return (danhSachMon || DANH_SACH_MON_AN).filter(m => {
      const khopTuKhoa = !tuKhoa || m.ten_mon.toLowerCase().includes(tuKhoa.toLowerCase());
      const khopDanhMuc = danhMucChon === 'all' || m.danh_muc_id === danhMucChon;
      return khopTuKhoa && khopDanhMuc;
    });
  }, [danhSachMon, tuKhoa, danhMucChon]);

  // Tính tổng số lượng và số tiền trong giỏ hàng
  const tongSoLuongGio = gioHang.reduce((tong, item) => tong + item.so_luong, 0);
  const tongTienGio = gioHang.reduce((tong, item) => tong + (item.gia * item.so_luong), 0);

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#f9f7f2] flex flex-col justify-between pb-28 shadow-xl border-x border-[#272d29]/5">
      {/* Header chuẩn Figma */}
      <HeaderKhach
        tieuDe="Thực đơn"
        ban={ban}
        onMoThongBao={onGoiHoTro}
      />

      {/* Nội dung chính cuộn dọc */}
      <main className="px-5 py-3 space-y-4 flex-1">
        {/* Ô tìm kiếm món */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72776f]" />
          <input
            type="text"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Tìm món, đồ uống, combo…"
            className="w-full bg-white border border-[#272d29]/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#272d29] placeholder-[#72776f] focus:outline-none focus:ring-2 focus:ring-[#b64d2d]/20 focus:border-[#b64d2d] transition-all"
          />
        </div>

        {/* Thanh trượt danh mục món */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {danhMucHienThi.map((dm) => {
            const active = danhMucChon === dm.id;
            return (
              <button
                key={dm.id}
                onClick={() => setDanhMucChon(dm.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#272d29] text-white shadow-xs'
                    : 'bg-white text-[#72776f] border border-stone-200 hover:border-stone-300'
                }`}
              >
                {dm.ten}
              </button>
            );
          })}
        </div>

        {/* Banner Combo sum vầy gợi ý từ bếp */}
        {danhMucChon === 'all' && !tuKhoa && (
          <div
            onClick={() => {
              setMonDangXem({
                id: 99,
                ten_mon: COMBO_GOI_Y.ten,
                gia: COMBO_GOI_Y.giaKhuyenMai,
                nhan: 'GỢI Ý · TIẾT KIỆM',
                mo_ta: COMBO_GOI_Y.moTa,
                di_ung: 'Gồm các món chính, đồ uống tươi mát phù hợp nhóm 4 khách.',
                hinh_anh: COMBO_GOI_Y.hinh_anh
              });
            }}
            className="bg-[#2d4336] text-white rounded-2xl p-4.5 cursor-pointer shadow-md relative overflow-hidden group border border-[#2d4336]"
          >
            <div className="relative z-10">
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-200/90 block mb-1">
                {COMBO_GOI_Y.tagline}
              </span>
              <h3 className="text-lg font-bold tracking-tight mb-2">
                {COMBO_GOI_Y.ten}
              </h3>
              <div className="flex items-baseline gap-2 text-xs">
                <span className="text-base font-extrabold text-[#f9ede6]">
                  {dinhDangTien(COMBO_GOI_Y.giaKhuyenMai)}
                </span>
                <span className="text-white/60">/</span>
                <span className="text-emerald-200 font-medium">
                  Tiết kiệm {dinhDangTien(COMBO_GOI_Y.tietKiem)}
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-25 group-hover:scale-105 transition-transform duration-500">
              <img src={COMBO_GOI_Y.hinh_anh} alt="Combo" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Tiêu đề mục món */}
        <div className="pt-1">
          <h2 className="text-base font-bold text-[#272d29]">
            {danhMucChon === 'all' ? 'Món ngon được yêu thích' : 'Danh sách món'}
          </h2>
        </div>

        {/* Danh sách thẻ món ăn */}
        <div className="space-y-3">
          {monHienThi.map((mon) => (
            <div
              key={mon.id}
              onClick={() => setMonDangXem(mon)}
              className="bg-white rounded-xl p-3 border border-[#272d29]/10 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#b64d2d]/30 transition-all active:scale-[0.99]"
            >
              {/* Hình ảnh */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                <img
                  src={mon.hinh_anh}
                  alt={mon.ten_mon}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thông tin món */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#272d29] truncate">
                  {mon.ten_mon}
                </h3>
                <p className="text-[11px] text-[#72776f] mt-0.5 truncate">
                  {mon.nhan || `${mon.danh_muc_ten} · Bếp nóng`}
                </p>
                <p className="font-bold text-sm text-[#b64d2d] mt-1.5">
                  {dinhDangTien(mon.gia)}
                </p>
              </div>

              {/* Nút thêm nhanh */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onThemVaoGio({
                    ...mon,
                    so_luong: 1,
                    ghi_chu: '',
                    thanh_tien: mon.gia
                  });
                }}
                className="w-9 h-9 rounded-lg bg-[#f9ede6] hover:bg-[#b64d2d] text-[#b64d2d] hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs"
                title="Thêm món vào giỏ"
              >
                <Plus size={18} className="stroke-[2.5]" />
              </button>
            </div>
          ))}

          {monHienThi.length === 0 && (
            <div className="text-center py-12 px-4 text-stone-400 bg-white rounded-xl border border-dashed border-stone-200">
              <p className="text-sm font-semibold text-stone-600 mb-1">
                {danhSachMon.length === 0 ? 'Thực đơn hiện đang trống' : 'Không tìm thấy món ăn phù hợp'}
              </p>
              <p className="text-xs text-stone-400">
                {danhSachMon.length === 0 ? 'Hệ thống chưa nạp món hoặc CSDL vừa được làm sạch. Quản trị viên có thể nạp dữ liệu mẫu trong phần Cài đặt.' : 'Hãy thử tìm kiếm với tên món khác hoặc chuyển danh mục.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Nút Xem giỏ hàng nổi phía trên Bottom Nav (khi có món trong giỏ) */}
      {tongSoLuongGio > 0 && (
        <div className="fixed bottom-16 left-0 right-0 max-w-[430px] mx-auto px-5 z-40">
          <button
            onClick={onXemGioHang}
            className="w-full py-3.5 px-5 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm flex items-center justify-between shadow-xl transition-all active:scale-[0.99] border border-white/20"
          >
            <span className="flex items-center gap-2">
              <span>Xem giỏ hàng</span>
              <span className="w-1 h-1 rounded-full bg-white/60"></span>
              <span>{tongSoLuongGio} món</span>
            </span>
            <span>{dinhDangTien(tongTienGio)}</span>
          </button>
        </div>
      )}

      {/* Điều hướng cuối */}
      <DieuHuongDuoiKhach
        tabHienTai="thucDon"
        onChuyenTab={onChuyenTab}
        soLuongMonDangCho={tongSoLuongGio}
      />

      {/* Modal chi tiết món (C03) */}
      {monDangXem && (
        <ModalChiTietMon
          mon={monDangXem}
          onDong={() => setMonDangXem(null)}
          onThemVaoGio={onThemVaoGio}
        />
      )}
    </div>
  );
}
