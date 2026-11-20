// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// P01 · POS KIỂM BILL VÀ SƠ ĐỒ THANH TOÁN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  Percent,
  Printer,
  Sparkles,
  Users,
  Split,
  CheckCircle2,
  Receipt
} from 'lucide-react';
import SidebarThuNgan from '../../thanhPhan/SidebarThuNgan';
import ModalGiamGiaChietKhau from './ModalGiamGiaChietKhau';
import ModalThanhToanTienMat from './ModalThanhToanTienMat';
import ModalThanhToanVietQrPos from './ModalThanhToanVietQrPos';
import ModalTachHoaDon from './ModalTachHoaDon';
import ModalChiaDeuHoaDon from './ModalChiaDeuHoaDon';
import ModalInHoaDonK80 from './ModalInHoaDonK80';
import ModalHoanTatDonBan from './ModalHoanTatDonBan';
import TrangLichSuHoaDonPos from './TrangLichSuHoaDonPos';
import { DANH_SACH_BAN as DANH_SACH_BAN_MAU, DON_MAU_BAN_08 } from '../../dungChung/duLieuMau';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function TrangPosKiemBill({ onDangXuat }) {
  const [tabSidebar, setTabSidebar] = useState('soDoHoaDon');
  const [khuVucChon, setKhuVucChon] = useState('Tầng 1');
  const [banDangChon, setBanDangChon] = useState(DANH_SACH_BAN_MAU.find(b => b.ma_ban === 'B08') || DANH_SACH_BAN_MAU[0]);

  // Modal states
  const [hienGiamGia, setHienGiamGia] = useState(false);
  const [hienTienMat, setHienTienMat] = useState(false);
  const [hienVietQr, setHienVietQr] = useState(false);
  const [hienTachHd, setHienTachHd] = useState(false);
  const [hienChiaDeu, setHienChiaDeu] = useState(false);
  const [hienInK80, setHienInK80] = useState(false);
  const [hienDonBan, setHienDonBan] = useState(false);

  const [tienGiamGia, setTienGiamGia] = useState(0);

  const banLoc = DANH_SACH_BAN_MAU.filter(b => b.khu_vuc === khuVucChon);

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
    yeu_cau_thanh_toan: 'Yêu cầu tính tiền',
    can_don_dep: 'Cần dọn dẹp'
  };

  const tongTienGoc = DON_MAU_BAN_08.tong_cong || 838080;
  const tongPhaiThu = Math.max(0, tongTienGoc - tienGiamGia);

  return (
    <div className="flex h-screen bg-[#f8f7f2] font-sans overflow-hidden">
      {/* Sidebar Thu ngân POS */}
      <SidebarThuNgan
        tabHienTai={tabSidebar}
        onChuyenTab={setTabSidebar}
        onDangXuat={onDangXuat}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {tabSidebar === 'lichSuHoaDon' ? (
          <div className="flex-1 overflow-y-auto">
            <TrangLichSuHoaDonPos onXemChiTietIn={() => setHienInK80(true)} />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Cột trái: Sơ đồ bàn theo tầng */}
            <div className="flex-1 flex flex-col p-6 overflow-y-auto border-r border-stone-200">
              {/* Header sơ đồ */}
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-4">
                <div>
                  <h1 className="text-xl font-black text-[#272d29] tracking-tight">
                    Sơ đồ bàn & kiểm bill
                  </h1>
                  <p className="text-xs text-[#72776f] mt-0.5">
                    Ca tối · Kiểm tra món và số tiền trước khi xác nhận thanh toán
                  </p>
                </div>

                {/* Khu vực Tabs */}
                <div className="flex items-center gap-1.5 bg-stone-200/60 p-1 rounded-xl text-xs font-semibold">
                  {['Tầng 1', 'Tầng 2', 'Sân vườn'].map(kv => (
                    <button
                      key={kv}
                      onClick={() => setKhuVucChon(kv)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        khuVucChon === kv ? 'bg-white text-[#272d29] shadow-xs font-bold' : 'text-stone-600'
                      }`}
                    >
                      {kv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lưới các bàn ăn */}
              <div className="grid grid-cols-3 gap-3">
                {banLoc.map((b) => {
                  const chon = banDangChon?.ma_ban === b.ma_ban;
                  const badgeClass = mauTrangThai[b.trang_thai] || 'bg-stone-100 text-stone-600';
                  return (
                    <div
                      key={b.ma_ban}
                      onClick={() => setBanDangChon(b)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-32 ${
                        chon
                          ? 'bg-white border-2 border-[#b64d2d] shadow-md ring-2 ring-[#b64d2d]/10'
                          : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-black text-2xl text-[#272d29] leading-none">{b.ten_ban}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                          {tenTrangThai[b.trang_thai] || b.trang_thai}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>{b.so_cho} chỗ</span>
                          {b.so_khach > 0 && <span>{b.so_khach} khách</span>}
                        </div>
                        {b.tam_tinh > 0 && (
                          <div className="font-bold text-xs text-[#b64d2d]">
                            {dinhDangTien(b.tam_tinh)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cột phải: Khung kiểm tra bill và hành động thanh toán */}
            <div className="w-96 bg-white flex flex-col h-screen border-l border-stone-200 shrink-0">
              {/* Header bill */}
              <div className="p-5 border-b border-stone-200 bg-stone-50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-[#b64d2d] uppercase tracking-wider block">
                      HÓA ĐƠN CHI TIẾT
                    </span>
                    <h2 className="text-xl font-black text-[#272d29]">
                      {banDangChon?.ten_ban || 'Bàn 08'}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {banDangChon?.khu_vuc || 'Tầng 1'} · {banDangChon?.so_khach || 4} khách · Giờ vào: 19:08
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-600 bg-stone-200 px-2 py-1 rounded">
                    #HD-0819
                  </span>
                </div>
              </div>

              {/* Danh sách món trong bill */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 text-xs">
                {DON_MAU_BAN_08.chi_tiet.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-2 border-b border-stone-100">
                    <div>
                      <h4 className="font-bold text-[#272d29]">{item.ten_mon}</h4>
                      <p className="text-[11px] text-stone-500">
                        {item.so_luong} × {dinhDangTien(item.don_gia)}
                      </p>
                      {item.ghi_chu && (
                        <p className="text-[10px] text-amber-700 italic">{item.ghi_chu}</p>
                      )}
                    </div>
                    <span className="font-bold text-[#272d29]">
                      {dinhDangTien(item.thanh_tien)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Khối tính tiền */}
              <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Tiền món (4 món):</span>
                  <span className="font-semibold">{dinhDangTien(DON_MAU_BAN_08.tong_tien_mon)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Thuế VAT (8%):</span>
                  <span className="font-semibold">{dinhDangTien(DON_MAU_BAN_08.thue_vat)}</span>
                </div>
                {tienGiamGia > 0 && (
                  <div className="flex justify-between text-[#a42c35] font-bold">
                    <span>Chiết khấu giảm giá:</span>
                    <span>-{dinhDangTien(tienGiamGia)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-300 flex justify-between items-baseline font-black text-base text-[#272d29]">
                  <span>TỔNG THANH TOÁN:</span>
                  <span className="text-xl text-[#b64d2d]">{dinhDangTien(tongPhaiThu)}</span>
                </div>
              </div>

              {/* Nhóm nút thanh toán & nghiệp vụ hóa đơn */}
              <div className="p-4 bg-white border-t border-stone-200 space-y-2">
                {/* 2 nút thanh toán chính */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setHienVietQr(true)}
                    className="py-3 px-3 bg-[#2d4336] hover:bg-[#202e28] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <QrCode size={16} />
                    <span>VietQR (P04)</span>
                  </button>

                  <button
                    onClick={() => setHienTienMat(true)}
                    className="py-3 px-3 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Banknote size={16} />
                    <span>Tiền mặt (P03)</span>
                  </button>
                </div>

                {/* Các nút nghiệp vụ phụ */}
                <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-stone-700">
                  <button
                    onClick={() => setHienGiamGia(true)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-center"
                    title="Giảm giá"
                  >
                    Giảm giá (P02)
                  </button>
                  <button
                    onClick={() => setHienTachHd(true)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-center"
                    title="Tách HĐ"
                  >
                    Tách HĐ (P05)
                  </button>
                  <button
                    onClick={() => setHienChiaDeu(true)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-center"
                    title="Chia đều"
                  >
                    Chia đều (P06)
                  </button>
                  <button
                    onClick={() => setHienInK80(true)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-center"
                    title="In bill"
                  >
                    In K80 (P07)
                  </button>
                </div>

                {/* Nút hoàn tất & dọn bàn */}
                <button
                  onClick={() => setHienDonBan(true)}
                  className="w-full py-2.5 bg-stone-100 hover:bg-[#ebf4ed] text-stone-600 hover:text-[#226b4c] border border-stone-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Hoàn tất & chuyển dọn bàn (P08)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal P02 Giảm giá */}
      {hienGiamGia && (
        <ModalGiamGiaChietKhau
          tongTienGoc={tongTienGoc}
          onDong={() => setHienGiamGia(false)}
          onApDung={(kq) => {
            setTienGiamGia(kq.soTienGiam);
            setHienGiamGia(false);
          }}
        />
      )}

      {/* Modal P03 Tiền mặt */}
      {hienTienMat && (
        <ModalThanhToanTienMat
          tongTien={tongPhaiThu}
          onDong={() => setHienTienMat(false)}
          onXacNhanThanhToan={() => {
            setHienTienMat(false);
            setHienInK80(true);
          }}
        />
      )}

      {/* Modal P04 VietQR */}
      {hienVietQr && (
        <ModalThanhToanVietQrPos
          ban={banDangChon}
          tongTien={tongPhaiThu}
          onDong={() => setHienVietQr(false)}
          onXacNhanThanhToan={() => {
            setHienVietQr(false);
            setHienInK80(true);
          }}
        />
      )}

      {/* Modal P05 Tách HĐ */}
      {hienTachHd && (
        <ModalTachHoaDon
          ban={banDangChon}
          onDong={() => setHienTachHd(false)}
          onXacNhanTach={() => {
            setHienTachHd(false);
            alert('Đã tách thành 2 hóa đơn thành công!');
          }}
        />
      )}

      {/* Modal P06 Chia đều */}
      {hienChiaDeu && (
        <ModalChiaDeuHoaDon
          tongTien={tongPhaiThu}
          onDong={() => setHienChiaDeu(false)}
          onXacNhanChia={(info) => {
            alert(`Đã tạo ${info.soNguoi} phiếu thanh toán ${dinhDangTien(info.moiNguoi)}/khách`);
          }}
        />
      )}

      {/* Modal P07 In K80 */}
      {hienInK80 && (
        <ModalInHoaDonK80
          ban={banDangChon}
          giamGia={tienGiamGia}
          onDong={() => setHienInK80(false)}
          onXacNhanIn={() => {
            alert('Lệnh in hóa đơn K80 đã được gửi tới máy in nhiệt!');
          }}
        />
      )}

      {/* Modal P08 Hoàn tất & dọn bàn */}
      {hienDonBan && (
        <ModalHoanTatDonBan
          ban={banDangChon}
          onDong={() => setHienDonBan(false)}
          onXacNhanDonBan={() => {
            setHienDonBan(false);
            alert(`Đã đánh dấu ${banDangChon.ten_ban} "Cần dọn dẹp" và thông báo tới nhân viên phục vụ!`);
          }}
        />
      )}
    </div>
  );
}
