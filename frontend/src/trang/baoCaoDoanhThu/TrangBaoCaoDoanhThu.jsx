// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// A16 · BÁO CÁO DOANH THU (1440x1000) - CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, Download, PieChart } from 'lucide-react';
import { BAO_CAO_DOANH_THU_MAU } from '../../dungChung/duLieuMau';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function TrangBaoCaoDoanhThu() {
  const [kyBaoCao, setKyBaoCao] = useState('hom_nay');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#272d29] tracking-tight">
            Báo cáo tài chính & doanh thu nhà hàng
          </h1>
          <p className="text-xs text-[#72776f] mt-1">
            Phân tích số liệu bán hàng, tỷ trọng kênh thanh toán và xu hướng tiêu dùng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={kyBaoCao}
            onChange={(e) => setKyBaoCao(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#272d29]"
          >
            <option value="hom_nay">Hôm nay (19/11/2026)</option>
            <option value="tuan_nay">Tuần này</option>
            <option value="thang_nay">Tháng này</option>
          </select>

          <button
            onClick={() => alert('Đã xuất file báo cáo Excel / PDF thành công!')}
            className="py-2.5 px-4 bg-[#2d4336] hover:bg-[#202e28] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Download size={16} />
            <span>Xuất file Excel</span>
          </button>
        </div>
      </div>

      {/* 3 Thẻ doanh thu tổng */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-[#72776f] uppercase block mb-1">TỔNG DOANH SỐ</span>
          <h2 className="text-3xl font-black text-[#b64d2d]">
            {dinhDangTien(BAO_CAO_DOANH_THU_MAU.doanhThuHomNay)}
          </h2>
          <p className="text-xs text-[#226b4c] font-bold mt-2">
            {BAO_CAO_DOANH_THU_MAU.tangTruongSoVoiHomQua} so với ngày trước
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-[#72776f] uppercase block mb-1">TỔNG HÓA ĐƠN XUẤT</span>
          <h2 className="text-3xl font-black text-[#272d29]">
            {BAO_CAO_DOANH_THU_MAU.soHoaDon} bill
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            100% hóa đơn hợp lệ có mã QR
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-[#72776f] uppercase block mb-1">TRUNG BÌNH HÓA ĐƠN</span>
          <h2 className="text-3xl font-black text-[#2d4336]">
            {dinhDangTien(BAO_CAO_DOANH_THU_MAU.giaTriTrungBinh)}
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Đạt 109% chỉ tiêu trung bình
          </p>
        </div>
      </div>

      {/* Tỷ trọng kênh thanh toán */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <h3 className="font-bold text-sm text-[#272d29] mb-4">Cơ cấu phương thức thanh toán</h3>
          <div className="space-y-4 text-xs">
            {BAO_CAO_DOANH_THU_MAU.kenhThanhToan.map((k, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1 font-bold">
                  <span>{k.ten}</span>
                  <span className="text-[#b64d2d]">{k.tiLe}% ({dinhDangTien(k.soTien)})</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-[#226b4c]' : idx === 1 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${k.tiLe}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Xếp hạng món theo doanh số */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <h3 className="font-bold text-sm text-[#272d29] mb-4">Món ăn đóng góp doanh thu cao nhất</h3>
          <div className="divide-y divide-stone-100 text-xs">
            {BAO_CAO_DOANH_THU_MAU.monBanChayNhat.map((m, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-[#272d29]">{m.ten}</span>
                <div className="text-right">
                  <span className="font-bold text-[#b64d2d]">{dinhDangTien(m.doanhThu)}</span>
                  <span className="text-stone-400 ml-2">({m.soLuong} phần)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
