// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// TRANG QUẢN TRỊ NHÀ HÀNG TOÀN DIỆN (A01 - A20) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import SidebarQuanTri from '../../thanhPhan/SidebarQuanTri';
import TrangTongQuanVanHanh from './TrangTongQuanVanHanh';
import TrangDanhSachNhanVien from '../nhanVien/TrangDanhSachNhanVien';
import TrangLichPhanCaAdmin from '../caLamViec/TrangLichPhanCaAdmin';
import TrangDuyetNghiDoiCaAdmin from '../caLamViec/TrangDuyetNghiDoiCaAdmin';
import TrangQuanLyPhongBan from '../quanLyBanQr/TrangQuanLyPhongBan';
import TrangThietLapBanVaQr from '../quanLyBanQr/TrangThietLapBanVaQr';
import TrangQuanLyThucDon from '../quanLyThucDon/TrangQuanLyThucDon';
import TrangBaoCaoDoanhThu from '../baoCaoDoanhThu/TrangBaoCaoDoanhThu';
import TrangPhanHoiKhachHang from './TrangPhanHoiKhachHang';
import TrangDieuPhoiKhanCap from './TrangDieuPhoiKhanCap';
import TrangDuyetHuyMonAdmin from './TrangDuyetHuyMonAdmin';
import TrangNhatKyKiemToan from './TrangNhatKyKiemToan';
import TrangThongTinNhaHang from './TrangThongTinNhaHang';
import TrangCauHinhVietQR from './TrangCauHinhVietQR';
import TrangTienIchDuLieu from './TrangTienIchDuLieu';

export default function TrangQuanTri({ onDangXuat }) {
  const [tabHienTai, setTabHienTai] = useState('tongQuan');

  return (
    <div className="flex h-screen bg-[#f8f7f2] font-sans overflow-hidden">
      {/* Sidebar Quản trị chuẩn Figma */}
      <SidebarQuanTri
        tabHienTai={tabHienTai}
        onChuyenTab={setTabHienTai}
        onDangXuat={onDangXuat}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto">
        {tabHienTai === 'tongQuan' && (
          <TrangTongQuanVanHanh onChuyenTab={setTabHienTai} />
        )}

        {tabHienTai === 'nhanSu' && (
          <TrangDanhSachNhanVien />
        )}

        {tabHienTai === 'phanCa' && (
          <TrangLichPhanCaAdmin onChuyenSangDuyetNghi={() => setTabHienTai('duyetNghi')} />
        )}

        {tabHienTai === 'duyetNghi' && (
          <TrangDuyetNghiDoiCaAdmin onQuayLaiLich={() => setTabHienTai('phanCa')} />
        )}

        {tabHienTai === 'phongBan' && (
          <TrangQuanLyPhongBan onChuyenSangTaoQr={() => setTabHienTai('thietLapQr')} />
        )}

        {tabHienTai === 'thietLapQr' && (
          <TrangThietLapBanVaQr onQuayLai={() => setTabHienTai('phongBan')} />
        )}

        {tabHienTai === 'thucDon' && (
          <TrangQuanLyThucDon />
        )}

        {tabHienTai === 'baoCao' && (
          <TrangBaoCaoDoanhThu />
        )}

        {tabHienTai === 'phanHoi' && (
          <TrangPhanHoiKhachHang />
        )}

        {tabHienTai === 'dieuPhoiBep' && (
          <TrangDieuPhoiKhanCap />
        )}

        {tabHienTai === 'duyetHuyMon' && (
          <TrangDuyetHuyMonAdmin />
        )}

        {tabHienTai === 'nhatKyKiemToan' && (
          <TrangNhatKyKiemToan />
        )}

        {tabHienTai === 'caiDat' && (
          <div className="space-y-8 pb-12">
            <TrangThongTinNhaHang />
            <TrangCauHinhVietQR />
            <TrangTienIchDuLieu />
          </div>
        )}
      </div>
    </div>
  );
}
