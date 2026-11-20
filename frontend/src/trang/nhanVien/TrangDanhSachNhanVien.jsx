// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A02 · DANH SÁCH NHÂN VIÊN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Users, UserPlus, Shield, Eye, Settings, Search, CheckCircle2 } from 'lucide-react';
import ModalHoSoNhanVien from './ModalHoSoNhanVien';
import ModalPhanQuyenGiaoBan from './ModalPhanQuyenGiaoBan';
import ModalCapTaiKhoan from './ModalCapTaiKhoan';
import { DANH_SACH_NHAN_SU as DANH_SACH_NHAN_SU_MAU } from '../../dungChung/duLieuMau';

export default function TrangDanhSachNhanVien() {
  const [danhSach, setDanhSach] = useState(DANH_SACH_NHAN_SU_MAU);
  const [tuKhoa, setTuKhoa] = useState('');
  const [nhanVienXem, setNhanVienXem] = useState(null);
  const [nhanVienPhanQuyen, setNhanVienPhanQuyen] = useState(null);
  const [hienCapTk, setHienCapTk] = useState(false);

  const nhanSuLoc = danhSach.filter(nv =>
    !tuKhoa || nv.ho_ten.toLowerCase().includes(tuKhoa.toLowerCase()) || nv.ten_dang_nhap.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  const mauVaiTro = {
    quan_ly: 'bg-purple-100 text-purple-800',
    thu_ngan: 'bg-blue-100 text-blue-800',
    bep: 'bg-amber-100 text-amber-800',
    phuc_vu: 'bg-emerald-100 text-[#226b4c]'
  };

  const handleTaoTk = (thongTin) => {
    const nvMoi = {
      id: Date.now(),
      ma_nv: `NV-00${danhSach.length + 1}`,
      ho_ten: thongTin.hoTen,
      ten_dang_nhap: thongTin.tenDangNhap,
      vai_tro: thongTin.vaiTro,
      vai_tro_ten: thongTin.vaiTro === 'quan_ly' ? 'Quản Lý' : thongTin.vaiTro === 'thu_ngan' ? 'Thu Ngân' : thongTin.vaiTro === 'bep' ? 'Đầu Bếp' : 'Nhân Viên Phục Vụ',
      so_dien_thoai: thongTin.soDienThoai,
      khu_vuc_phu_trach: 'Tầng 1 · Bàn 01–12',
      trang_thai: 'dang_lam_viec',
      ngay_vao_lam: new Date().toLocaleDateString('vi-VN')
    };
    setDanhSach(prev => [nvMoi, ...prev]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Tiêu đề & nút hành động */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Quản trị nhân sự & phân quyền
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Danh sách nhân sự toàn hệ thống, cấp tài khoản và giao bàn theo ca
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm tên nhân viên..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#b64d2d]"
            />
          </div>

          <button
            onClick={() => setHienCapTk(true)}
            className="py-2.5 px-4 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <UserPlus size={16} />
            <span>Cấp tài khoản mới (A05)</span>
          </button>
        </div>
      </div>

      {/* Bảng nhân sự */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 font-bold text-[#72776f] uppercase">
            <tr>
              <th className="p-4">Mã NV</th>
              <th className="p-4">Họ và tên</th>
              <th className="p-4">Tài khoản</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Khu vực phụ trách</th>
              <th className="p-4">Số điện thoại</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {nhanSuLoc.map((nv) => (
              <tr key={nv.id} className="hover:bg-stone-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-[#b64d2d]">{nv.ma_nv}</td>
                <td className="p-4 font-bold text-[#272d29]">{nv.ho_ten}</td>
                <td className="p-4 font-mono text-stone-600">{nv.ten_dang_nhap}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${mauVaiTro[nv.vai_tro] || 'bg-stone-100'}`}>
                    {nv.vai_tro_ten || nv.vai_tro}
                  </span>
                </td>
                <td className="p-4 text-[#2d4336] font-medium">{nv.khu_vuc_phu_trach}</td>
                <td className="p-4 text-stone-600">{nv.so_dien_thoai}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#226b4c] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#226b4c]"></span>
                    Đang làm việc
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setNhanVienXem(nv)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-600 hover:text-[#272d29]"
                      title="Xem hồ sơ (A03)"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setNhanVienPhanQuyen(nv)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-600 hover:text-[#b64d2d]"
                      title="Phân quyền & giao bàn (A04)"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal A03 */}
      {nhanVienXem && (
        <ModalHoSoNhanVien
          nhanVien={nhanVienXem}
          onDong={() => setNhanVienXem(null)}
        />
      )}

      {/* Modal A04 */}
      {nhanVienPhanQuyen && (
        <ModalPhanQuyenGiaoBan
          nhanVien={nhanVienPhanQuyen}
          onDong={() => setNhanVienPhanQuyen(null)}
          onLuuPhanQuyen={(data) => {
            alert(`Đã cập nhật phân quyền và khu vực phụ trách cho ${nhanVienPhanQuyen.ho_ten}`);
          }}
        />
      )}

      {/* Modal A05 */}
      {hienCapTk && (
        <ModalCapTaiKhoan
          onDong={() => setHienCapTk(false)}
          onTaoTaiKhoan={handleTaoTk}
        />
      )}
    </div>
  );
}
