// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A12 · QUẢN LÝ THỰC ĐƠN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import ModalThemSuaMon from './ModalThemSuaMon';
import { DANH_SACH_MON_AN as DANH_SACH_MON_AN_MAU, DANH_MUC_THUC_DON } from '../../dungChung/duLieuMau';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function TrangQuanLyThucDon() {
  const [danhSach, setDanhSach] = useState(DANH_SACH_MON_AN_MAU);
  const [tuKhoa, setTuKhoa] = useState('');
  const [danhMucChon, setDanhMucChon] = useState('all');
  const [monChinhSua, setMonChinhSua] = useState(null);
  const [hienThemMoi, setHienThemMoi] = useState(false);

  const monLoc = danhSach.filter(m => {
    const khopTuKhoa = !tuKhoa || m.ten_mon.toLowerCase().includes(tuKhoa.toLowerCase()) || m.ma_mon.toLowerCase().includes(tuKhoa.toLowerCase());
    const khopDm = danhMucChon === 'all' || m.danh_muc_id === danhMucChon;
    return khopTuKhoa && khopDm;
  });

  const toggleConHang = (id) => {
    setDanhSach(prev => prev.map(m => m.id === id ? { ...m, con_hang: !m.con_hang } : m));
  };

  const xoaMon = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa món này khỏi thực đơn?')) {
      setDanhSach(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleLuu = (monMoi) => {
    if (monChinhSua) {
      setDanhSach(prev => prev.map(m => m.id === monMoi.id ? monMoi : m));
    } else {
      setDanhSach(prev => [monMoi, ...prev]);
    }
    setMonChinhSua(null);
    setHienThemMoi(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Quản trị thực đơn món ăn & combo
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Điều chỉnh giá, phân bổ trạm bếp chế biến, quản lý hình ảnh và trạng thái bán hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm tên món hoặc mã..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#b64d2d]"
            />
          </div>

          <button
            onClick={() => setHienThemMoi(true)}
            className="py-2.5 px-4 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Thêm món mới (A13)</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc danh mục */}
      <div className="flex items-center gap-2">
        {DANH_MUC_THUC_DON.map(dm => (
          <button
            key={dm.id}
            onClick={() => setDanhMucChon(dm.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              danhMucChon === dm.id ? 'bg-[#272d29] text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {dm.ten}
          </button>
        ))}
      </div>

      {/* Bảng món ăn */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 font-bold text-[#72776f] uppercase">
            <tr>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Mã món</th>
              <th className="p-4">Tên món ăn</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Trạm bếp</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4">Trạng thái bán</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {monLoc.map((mon) => (
              <tr key={mon.id} className="hover:bg-stone-50/80 transition-colors">
                <td className="p-4">
                  <img src={mon.hinh_anh} alt={mon.ten_mon} className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                </td>
                <td className="p-4 font-mono font-bold text-[#b64d2d]">{mon.ma_mon}</td>
                <td className="p-4">
                  <p className="font-bold text-sm text-[#272d29]">{mon.ten_mon}</p>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{mon.mo_ta}</p>
                </td>
                <td className="p-4 font-semibold text-stone-700">{mon.danh_muc_ten}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-[#2d4336]">
                    {mon.tram_bep === 'bep_nong' ? 'Bếp nóng' : mon.tram_bep === 'bep_lanh' ? 'Bếp lạnh' : 'Bar pha chế'}
                  </span>
                </td>
                <td className="p-4 font-extrabold text-sm text-[#b64d2d]">
                  {dinhDangTien(mon.gia)}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleConHang(mon.id)}
                    className="flex items-center gap-1.5"
                  >
                    {mon.con_hang ? (
                      <span className="text-[#226b4c] font-bold flex items-center gap-1">
                        <ToggleRight size={28} className="text-[#226b4c]" />
                        <span>Đang bán</span>
                      </span>
                    ) : (
                      <span className="text-[#a42c35] font-bold flex items-center gap-1">
                        <ToggleLeft size={28} className="text-stone-300" />
                        <span>Hết hàng</span>
                      </span>
                    )}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setMonChinhSua(mon)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-600 hover:text-[#b64d2d]"
                      title="Sửa món"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => xoaMon(mon.id)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-600 hover:text-[#a42c35]"
                      title="Xóa món"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal A13: Thêm hoặc Sửa món */}
      {(hienThemMoi || monChinhSua) && (
        <ModalThemSuaMon
          monCanSua={monChinhSua}
          onDong={() => { setHienThemMoi(false); setMonChinhSua(null); }}
          onLuu={handleLuu}
        />
      )}
    </div>
  );
}
