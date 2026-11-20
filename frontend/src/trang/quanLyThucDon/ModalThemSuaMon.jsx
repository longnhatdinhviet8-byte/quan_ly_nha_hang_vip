// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A13 · THÊM VÀ SỬA MÓN (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { X, Check, Upload, Image as ImageIcon } from 'lucide-react';

export default function ModalThemSuaMon({
  monCanSua = null,
  onDong,
  onLuu
}) {
  const [tenMon, setTenMon] = useState(monCanSua?.ten_mon || '');
  const [maMon, setMaMon] = useState(monCanSua?.ma_mon || '');
  const [gia, setGia] = useState(monCanSua?.gia || 120000);
  const [danhMucId, setDanhMucId] = useState(monCanSua?.danh_muc_id || '2');
  const [tramBep, setTramBep] = useState(monCanSua?.tram_bep || 'bep_nong');
  const [thoiGianNau, setThoiGianNau] = useState(monCanSua?.thoi_gian_nau || 15);
  const [hinhAnh, setHinhAnh] = useState(monCanSua?.hinh_anh || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80');
  const [moTa, setMoTa] = useState(monCanSua?.mo_ta || '');
  const [diUng, setDiUng] = useState(monCanSua?.di_ung || '');

  const handleLuu = (e) => {
    e.preventDefault();
    onLuu({
      id: monCanSua?.id || Date.now(),
      ten_mon: tenMon,
      ma_mon: maMon,
      gia: Number(gia),
      danh_muc_id: danhMucId,
      danh_muc_ten: danhMucId === '1' ? 'Khai vị' : danhMucId === '2' ? 'Món chính' : danhMucId === '3' ? 'Đồ uống' : 'Tráng miệng',
      tram_bep: tramBep,
      thoi_gian_nau: Number(thoiGianNau),
      hinh_anh: hinhAnh,
      mo_ta: moTa,
      di_ung: diUng,
      con_hang: true
    });
    onDong();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold text-[#b64d2d] uppercase tracking-wider">
              {monCanSua ? 'CẬP NHẬT MÓN ĂN' : 'TẠO MÓN ĂN MỚI'}
            </span>
            <h3 className="text-lg font-bold text-[#272d29]">
              {monCanSua ? `Chỉnh sửa: ${monCanSua.ten_mon}` : 'Thêm món vào thực đơn'}
            </h3>
          </div>
          <button onClick={onDong} className="p-1 rounded-full hover:bg-stone-100 text-stone-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleLuu} className="py-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">TÊN MÓN ĂN *</label>
              <input
                type="text"
                value={tenMon}
                onChange={(e) => setTenMon(e.target.value)}
                placeholder="Ví dụ: Bò lúc lắc"
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-[#272d29]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">MÃ MÓN (SKU) *</label>
              <input
                type="text"
                value={maMon}
                onChange={(e) => setMaMon(e.target.value)}
                placeholder="BLL-01"
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono text-[#272d29]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">GIÁ BÁN (VNĐ) *</label>
              <input
                type="number"
                value={gia}
                onChange={(e) => setGia(e.target.value)}
                step={1000}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-[#b64d2d]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">DANH MỤC *</label>
              <select
                value={danhMucId}
                onChange={(e) => setDanhMucId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
              >
                <option value="1">Khai vị</option>
                <option value="2">Món chính</option>
                <option value="3">Đồ uống</option>
                <option value="4">Tráng miệng</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">TRẠM BẾP PHỤ TRÁCH *</label>
              <select
                value={tramBep}
                onChange={(e) => setTramBep(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
              >
                <option value="bep_nong">Bếp nóng (Xào, nướng, lẩu)</option>
                <option value="bep_lanh">Bếp lạnh (Gỏi, khai vị)</option>
                <option value="bar_pha_che">Bar (Pha chế, đồ uống)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">LINK HÌNH ẢNH MÓN (URL)</label>
            <input
              type="url"
              value={hinhAnh}
              onChange={(e) => setHinhAnh(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">MÔ TẢ CHI TIẾT NGUYÊN LIỆU</label>
            <textarea
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Thăn bò áp chảo mềm mọng, ớt chuông giòn ngọt..."
              rows={2}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">CẢNH BÁO DỊ ỨNG</label>
            <input
              type="text"
              value={diUng}
              onChange={(e) => setDiUng(e.target.value)}
              placeholder="Có đậu phộng, tôm, hải sản..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[#272d29]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              <span>{monCanSua ? 'Lưu thay đổi' : 'Thêm vào thực đơn'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
