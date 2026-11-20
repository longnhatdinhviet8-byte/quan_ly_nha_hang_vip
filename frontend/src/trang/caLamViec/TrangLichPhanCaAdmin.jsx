// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A06 · LỊCH PHÂN CA (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Calendar, Plus, Clock, Users, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { DANH_SACH_NHAN_SU } from '../../dungChung/duLieuMau';

export default function TrangLichPhanCaAdmin({ onChuyenSangDuyetNghi }) {
  const [tuanHienTai, setTuanHienTai] = useState('Tuần 47 (17/11 - 23/11/2026)');

  const ngayTrongTuan = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  const maTranPhanCa = [
    { nv: 'Nguyễn Minh Anh (QL)', ca: ['Ca tối', 'Ca tối', 'Ca tối', 'Ca sáng', 'Nghỉ', 'Ca cả ngày', 'Ca cả ngày'] },
    { nv: 'Trần Ngọc Mai (Thu ngân)', ca: ['Ca sáng', 'Ca sáng', 'Ca tối', 'Ca tối', 'Ca tối', 'Nghỉ', 'Ca sáng'] },
    { nv: 'Lê Quốc Huy (Bếp trưởng)', ca: ['Ca tối', 'Ca tối', 'Ca tối', 'Ca tối', 'Nghỉ', 'Ca tối', 'Ca tối'] },
    { nv: 'Nguyễn Thị Lan (Phục vụ)', ca: ['Ca tối', 'Ca tối', 'Ca tối', 'Ca sáng', 'Nghỉ', 'Ca tối', 'Ca cả ngày'] }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Lịch phân ca làm việc tuần
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Sắp xếp ca sáng, ca tối, theo dõi nghỉ phép và phân bổ nhân sự
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-[#272d29]">
            <ChevronLeft size={16} className="cursor-pointer text-stone-400 hover:text-stone-700" />
            <span>{tuanHienTai}</span>
            <ChevronRight size={16} className="cursor-pointer text-stone-400 hover:text-stone-700" />
          </div>

          <button
            onClick={onChuyenSangDuyetNghi}
            className="py-2 px-3 bg-[#f9ede6] hover:bg-[#b64d2d] text-[#b64d2d] hover:text-white rounded-xl font-bold text-xs transition-colors"
          >
            Duyệt nghỉ & đổi ca (A07) →
          </button>
        </div>
      </div>

      {/* Bảng ma trận phân ca */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 font-bold text-[#72776f] uppercase">
            <tr>
              <th className="p-4 w-60">Nhân sự</th>
              {ngayTrongTuan.map((ngay, idx) => (
                <th key={idx} className="p-4 text-center">{ngay}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {maTranPhanCa.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-stone-50/80">
                <td className="p-4 font-bold text-[#272d29]">{row.nv}</td>
                {row.ca.map((c, cIdx) => {
                  const laNghi = c === 'Nghỉ';
                  const laToi = c.includes('tối');
                  return (
                    <td key={cIdx} className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
                        laNghi
                          ? 'bg-stone-100 text-stone-400'
                          : laToi
                          ? 'bg-[#2d4336] text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
