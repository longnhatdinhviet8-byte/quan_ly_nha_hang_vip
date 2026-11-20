// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// W07 · ĐẶT MÓN HỘ KHÁCH (430x980) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { X, Search, Plus, Minus, Send } from 'lucide-react';
import { DANH_SACH_MON_AN } from '../../dungChung/duLieuMau';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function ModalDatMonHoKhach({
  ban = { ma_ban: 'B08', ten_ban: 'BÀN 08', so_cho: 4 },
  onDong,
  onXacNhanDatMon
}) {
  const [tuKhoa, setTuKhoa] = useState('');
  const [monChonList, setMonChonList] = useState([]);

  const monLoc = DANH_SACH_MON_AN.filter(m =>
    !tuKhoa || m.ten_mon.toLowerCase().includes(tuKhoa.toLowerCase()) || m.ma_mon.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  const tangMon = (mon) => {
    setMonChonList(prev => {
      const tonTai = prev.find(item => item.id === mon.id);
      if (tonTai) {
        return prev.map(item => item.id === mon.id ? { ...item, so_luong: item.so_luong + 1 } : item);
      }
      return [...prev, { ...mon, so_luong: 1, ghi_chu: '' }];
    });
  };

  const giamMon = (monId) => {
    setMonChonList(prev =>
      prev.map(item => item.id === monId ? { ...item, so_luong: item.so_luong - 1 } : item)
          .filter(item => item.so_luong > 0)
    );
  };

  const capNhatGhiChu = (monId, ghiChu) => {
    setMonChonList(prev => prev.map(item => item.id === monId ? { ...item, ghi_chu: ghiChu } : item));
  };

  const tongTien = monChonList.reduce((sum, item) => sum + (item.gia * item.so_luong), 0);

  const handleGui = () => {
    onXacNhanDatMon(monChonList);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-[#f9f7f2] rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 border border-[#272d29]/10 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-[#272d29]/10">
            <div>
              <span className="text-[11px] font-bold text-[#b64d2d] uppercase tracking-wider">
                NHÂN VIÊN GỌI MÓN
              </span>
              <h3 className="text-lg font-bold text-[#272d29]">
                Đặt món cho {ban.ten_ban || 'Bàn 08'}
              </h3>
            </div>
            <button
              onClick={onDong}
              className="p-1.5 rounded-full hover:bg-stone-200 text-[#72776f]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative my-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#72776f]" />
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm tên món hoặc mã món…"
              className="w-full bg-white border border-[#272d29]/10 rounded-xl pl-9 pr-3 py-2 text-xs text-[#272d29] focus:outline-none focus:ring-2 focus:ring-[#b64d2d]/20"
            />
          </div>

          {/* Danh sách món chọn */}
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 mb-3">
            {monLoc.map((mon) => {
              const dangChon = monChonList.find(item => item.id === mon.id);
              return (
                <div
                  key={mon.id}
                  className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-[#272d29] truncate">{mon.ten_mon}</p>
                    <p className="text-[#b64d2d] font-semibold">{dinhDangTien(mon.gia)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {dangChon ? (
                      <>
                        <button
                          type="button"
                          onClick={() => giamMon(mon.id)}
                          className="w-7 h-7 rounded-md border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center font-bold text-[#272d29]">
                          {dangChon.so_luong}
                        </span>
                        <button
                          type="button"
                          onClick={() => tangMon(mon)}
                          className="w-7 h-7 rounded-md bg-[#b64d2d] text-white flex items-center justify-center hover:bg-[#a14022]"
                        >
                          <Plus size={13} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => tangMon(mon)}
                        className="px-3 py-1.5 rounded-lg bg-[#f9ede6] text-[#b64d2d] font-bold hover:bg-[#b64d2d] hover:text-white transition-colors"
                      >
                        + Thêm
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Món đã chọn để gửi */}
          {monChonList.length > 0 && (
            <div className="bg-white p-3 rounded-xl border border-stone-200 mb-3 space-y-2">
              <span className="text-[11px] font-bold text-[#272d29] uppercase">Món đã chọn ({monChonList.length}):</span>
              {monChonList.map(item => (
                <div key={item.id} className="text-xs border-b border-stone-100 pb-1.5 last:border-0 last:pb-0">
                  <div className="flex justify-between font-semibold">
                    <span>{item.ten_mon} × {item.so_luong}</span>
                    <span>{dinhDangTien(item.gia * item.so_luong)}</span>
                  </div>
                  <input
                    type="text"
                    value={item.ghi_chu}
                    onChange={(e) => capNhatGhiChu(item.id, e.target.value)}
                    placeholder="Ghi chú (ít cay, không hành...)"
                    className="w-full text-[11px] bg-stone-50 border border-stone-200 rounded px-2 py-1 mt-1 text-[#272d29]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nút gửi */}
        <div className="pt-2">
          <button
            onClick={handleGui}
            disabled={monChonList.length === 0}
            className="w-full py-3.5 px-4 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-sm flex items-center justify-between shadow-md disabled:opacity-50 transition-all"
          >
            <span className="flex items-center gap-1.5">
              <Send size={16} />
              <span>Gửi gọi món ngay</span>
            </span>
            <span>{dinhDangTien(tongTien)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
