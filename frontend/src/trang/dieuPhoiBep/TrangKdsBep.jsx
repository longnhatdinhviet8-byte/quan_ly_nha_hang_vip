// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// KDS BẾP THÔNG MINH (K01 - K06) - 100% CHUẨN THIẾT KẾ FIGMA
// ============================================================================

import React, { useState } from 'react';
import { Clock, CheckCircle2, Flame, AlertTriangle, Layers, RotateCcw, Volume2, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import HeaderBep from '../../thanhPhan/HeaderBep';
import ModalChiDaoGapBatBuoc from './ModalChiDaoGapBatBuoc';
import ModalDeNghiUuTien from './ModalDeNghiUuTien';
import { PHIEU_BEP_KDS, GOM_MON_KDS, DANH_SACH_MON_AN, CHI_DAO_BEP_KHAN_CAP } from '../../dungChung/duLieuMau';

export default function TrangKdsBep({ onDangXuat }) {
  const [tabHienTai, setTabHienTai] = useState('theoBan'); // 'theoBan' | 'gomMon' | 'daLamXong' | 'trangThaiMon'
  const [tramHienTai, setTramHienTai] = useState('bepNong');
  const [amThanhBao, setAmThanhBao] = useState(true);
  const [hienChiDaoKhanCap, setHienChiDaoKhanCap] = useState(true);
  const [hienDeNghiUuTien, setHienDeNghiUuTien] = useState(false);

  const [danhSachPhieu, setDanhSachPhieu] = useState(PHIEU_BEP_KDS);
  const [danhSachGomMon, setDanhSachGomMon] = useState(GOM_MON_KDS);
  const [danhSachMon, setDanhSachMon] = useState(DANH_SACH_MON_AN);

  // Món hoàn thành mẫu
  const [danhSachDaXong, setDanhSachDaXong] = useState([
    { id: 201, ten_mon: 'Gỏi ngó sen tôm', ban: 'B08', so_luong: 1, thoi_gian_xong: '19:32', phuc_vu: 'Lan', da_bung: true },
    { id: 202, ten_mon: 'Trà đào cam sả', ban: 'B08', so_luong: 4, thoi_gian_xong: '19:15', phuc_vu: 'Lan', da_bung: true },
    { id: 203, ten_mon: 'Chả giò Mộc', ban: 'B02', so_luong: 2, thoi_gian_xong: '19:28', phuc_vu: 'Mai', da_bung: true }
  ]);

  // Cập nhật trạng thái món trong phiếu
  const capNhatTrangThaiMonTrongPhieu = (ticketId, monId, trangThaiMoi) => {
    setDanhSachPhieu(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            mon_an: ticket.mon_an.map(m => m.id === monId ? { ...m, trang_thai: trangThaiMoi } : m)
          };
        }
        return ticket;
      })
    );
  };

  // Hoàn thành cả phiếu
  const hoanThanhCaPhieu = (ticketId) => {
    const phieu = danhSachPhieu.find(p => p.id === ticketId);
    if (!phieu) return;

    // Chuyển các món vào danh sách đã làm xong
    const cacMonMoi = phieu.mon_an.map((m, idx) => ({
      id: Date.now() + idx,
      ten_mon: m.ten_mon,
      ban: phieu.ma_ban,
      so_luong: m.so_luong,
      thoi_gian_xong: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      phuc_vu: 'Lan',
      da_bung: false
    }));

    setDanhSachDaXong(prev => [...cacMonMoi, ...prev]);
    setDanhSachPhieu(prev => prev.filter(p => p.id !== ticketId));
  };

  // Toggle trạng thái còn hàng / hết hàng của món (K04)
  const toggleHetMon = (monId) => {
    setDanhSachMon(prev =>
      prev.map(m => m.id === monId ? { ...m, con_hang: !m.con_hang } : m)
    );
  };

  const soMonHet = danhSachMon.filter(m => !m.con_hang).length;

  return (
    <div className="w-full min-h-screen bg-[#19241f] text-[#e1eae1] flex flex-col font-sans select-none">
      {/* Header chuẩn Figma KDS */}
      <HeaderBep
        tabHienTai={tabHienTai}
        onChuyenTab={setTabHienTai}
        soPhieuCho={danhSachPhieu.length}
        soGomMon={danhSachGomMon.length}
        soHoanThanh={danhSachDaXong.length}
        soMonHet={soMonHet}
        coChiDaoKhanCap={hienChiDaoKhanCap}
        onMoChiDaoKhanCap={() => setHienChiDaoKhanCap(true)}
        amThanhBao={amThanhBao}
        onBatTatAmThanh={() => setAmThanhBao(!amThanhBao)}
        tramHienTai={tramHienTai}
        onChonTram={setTramHienTai}
        onDangXuat={onDangXuat}
      />

      {/* Nội dung chính theo Tab */}
      <main className="flex-1 p-6 overflow-x-auto">
        {/* TAB 1: K01 · KDS THEO BÀN (FIFO TICKETS) */}
        {tabHienTai === 'theoBan' && (
          <div className="flex gap-5 items-start min-w-max pb-6">
            {danhSachPhieu.map((phieu) => {
              const laTre = phieu.thoi_gian_cho_phut >= 15;
              const laChuY = phieu.thoi_gian_cho_phut >= 10 && phieu.thoi_gian_cho_phut < 15;

              const mauHeader = laTre
                ? 'bg-[#a42c35] text-white border-b-2 border-rose-300'
                : laChuY
                ? 'bg-amber-600 text-white border-b-2 border-amber-300'
                : 'bg-[#2d4336] text-white border-b-2 border-emerald-400';

              return (
                <div
                  key={phieu.id}
                  className="w-80 bg-white text-[#272d29] rounded-2xl shadow-xl overflow-hidden border border-white/20 flex flex-col"
                >
                  {/* Header phiếu */}
                  <div className={`p-4 ${mauHeader} flex justify-between items-start`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-2xl tracking-tight leading-none">
                          {phieu.ma_ban}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/20">
                          #{phieu.ma_don}
                        </span>
                      </div>
                      <p className="text-xs opacity-90 mt-1">
                        Gửi lúc: {phieu.thoi_gian_tao}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-black/25">
                        <Clock size={13} />
                        <span>{phieu.thoi_gian_cho_phut}p</span>
                      </span>
                      {laTre && <p className="text-[10px] font-bold uppercase mt-1 text-rose-200">Ưu tiên ra ngay</p>}
                    </div>
                  </div>

                  {/* Danh sách món ăn trong phiếu */}
                  <div className="p-4 space-y-3 flex-1 bg-stone-50 divide-y divide-stone-200/80">
                    {phieu.mon_an.map((mon) => (
                      <div key={mon.id} className="pt-3 first:pt-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-[#272d29]">
                            <span className="text-base text-[#b64d2d] mr-1.5">{mon.so_luong} ×</span>
                            {mon.ten_mon}
                          </h4>
                          {mon.phut_con_lai && (
                            <span className="text-[11px] font-semibold text-stone-500">
                              ~{mon.phut_con_lai}p
                            </span>
                          )}
                        </div>

                        {mon.ghi_chu && (
                          <div className="bg-[#fbf2dd] text-[#795c21] text-xs font-semibold px-2.5 py-1 rounded-md mt-1.5 inline-block">
                            Ghi chú: {mon.ghi_chu}
                          </div>
                        )}

                        {/* Nút chuyển trạng thái món */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            mon.trang_thai === 'hoan_thanh'
                              ? 'bg-emerald-100 text-[#226b4c]'
                              : mon.trang_thai === 'dang_nau'
                              ? 'bg-orange-100 text-[#b64d2d]'
                              : 'bg-stone-200 text-stone-600'
                          }`}>
                            {mon.trang_thai === 'hoan_thanh' ? '✓ Đã xong' : mon.trang_thai === 'dang_nau' ? 'Đang nấu' : 'Chờ nấu'}
                          </span>

                          {mon.trang_thai !== 'hoan_thanh' ? (
                            <button
                              onClick={() => capNhatTrangThaiMonTrongPhieu(phieu.id, mon.id, 'hoan_thanh')}
                              className="px-3 py-1 bg-[#226b4c] hover:bg-[#1a553c] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                            >
                              Xong món
                            </button>
                          ) : (
                            <button
                              onClick={() => capNhatTrangThaiMonTrongPhieu(phieu.id, mon.id, 'dang_nau')}
                              className="text-[11px] text-stone-400 hover:text-stone-600"
                            >
                              Nấu lại
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Nút hoàn thành toàn bộ phiếu */}
                  <div className="p-3 bg-white border-t border-stone-200">
                    <button
                      onClick={() => hoanThanhCaPhieu(phieu.id)}
                      className="w-full py-2.5 bg-[#2d4336] hover:bg-[#202e28] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <CheckCircle2 size={16} />
                      <span>Hoàn thành cả phiếu {phieu.ma_ban}</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {danhSachPhieu.length === 0 && (
              <div className="text-center py-20 text-[#b3c6ba] w-full">
                <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-3" />
                <h3 className="text-lg font-bold text-white">Bếp đã hoàn thành toàn bộ món!</h3>
                <p className="text-xs text-[#b3c6ba] mt-1">Không còn phiếu chờ chế biến.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: K02 · KDS GOM MÓN (BATCH COOKING) */}
        {tabHienTai === 'gomMon' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-[#202e28] p-4 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
              <div>
                <h2 className="text-base font-bold text-white">Gom món chế biến hàng loạt</h2>
                <p className="text-[#b3c6ba] mt-0.5">Tự động tổng hợp các đĩa cùng loại từ các bàn khác nhau để nấu chung một mẻ.</p>
              </div>
              <button
                onClick={() => setHienDeNghiUuTien(true)}
                className="px-3 py-2 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-xl font-bold flex items-center gap-1.5"
              >
                <span>Mở đề nghị ưu tiên (K06)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {danhSachGomMon.map((gom, idx) => (
                <div key={idx} className="bg-white text-[#272d29] rounded-2xl p-5 shadow-lg border border-stone-200">
                  <div className="flex justify-between items-start pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-xs font-bold text-[#b64d2d] uppercase">{gom.tram}</span>
                      <h3 className="text-xl font-black text-[#272d29]">{gom.ten_mon}</h3>
                    </div>
                    <span className="text-2xl font-black text-[#b64d2d] bg-[#f9ede6] px-3.5 py-1 rounded-xl">
                      {gom.tong_so_luong} đĩa
                    </span>
                  </div>

                  <div className="py-3 space-y-2">
                    <span className="text-xs font-bold text-[#72776f] block">Chi tiết theo từng bàn:</span>
                    {gom.chi_tiet.map((ct, cIdx) => (
                      <div key={cIdx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-extrabold text-sm text-[#272d29] mr-2">{ct.ban}</span>
                          <span className="font-bold text-[#b64d2d]">{ct.so_luong} đĩa</span>
                          <span className="text-stone-500 ml-2">({ct.ghi_chu})</span>
                        </div>
                        <span className="text-stone-400 font-semibold">{ct.thoi_gian_cho}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => alert(`Bếp bắt đầu nấu toàn bộ mẻ ${gom.tong_so_luong} đĩa ${gom.ten_mon}`)}
                    className="w-full mt-2 py-3 bg-[#b64d2d] hover:bg-[#a14022] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Flame size={16} />
                    <span>Nấu chung cả mẻ {gom.tong_so_luong} phần</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: K03 · MÓN ĐÃ HOÀN THÀNH */}
        {tabHienTai === 'daLamXong' && (
          <div className="max-w-5xl mx-auto bg-white text-[#272d29] rounded-2xl shadow-xl overflow-hidden border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-[#272d29] mb-4">Lịch sử món đã chế biến xong trong ca</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-[#72776f] uppercase font-bold border-b">
                  <tr>
                    <th className="p-3">Bàn</th>
                    <th className="p-3">Tên món</th>
                    <th className="p-3">Số lượng</th>
                    <th className="p-3">Thời gian hoàn thành</th>
                    <th className="p-3">Phục vụ bưng</th>
                    <th className="p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {danhSachDaXong.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-sm text-[#272d29]">{item.ban}</td>
                      <td className="p-3 font-semibold">{item.ten_mon}</td>
                      <td className="p-3 font-bold text-[#b64d2d]">{item.so_luong}</td>
                      <td className="p-3 text-stone-500">{item.thoi_gian_xong}</td>
                      <td className="p-3 font-medium">{item.phuc_vu}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ebf4ed] text-[#226b4c]">
                          {item.da_bung ? 'Đã lên bàn' : 'Chờ bưng'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: K04 · TRẠNG THÁI THỰC ĐƠN / BÁO HẾT MÓN NHANH */}
        {tabHienTai === 'trangThaiMon' && (
          <div className="max-w-4xl mx-auto bg-white text-[#272d29] rounded-2xl shadow-xl border border-stone-200 p-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#272d29]">Cập nhật trạng thái còn / hết món</h2>
                <p className="text-xs text-[#72776f] mt-0.5">Bếp trưởng có thể gạt công tắc để lập tức khóa món trên menu QR của khách hàng khi hết nguyên liệu.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-[#a42c35] rounded-full">
                {soMonHet} món đang hết
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {danhSachMon.map((mon) => (
                <div key={mon.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={mon.hinh_anh} alt={mon.ten_mon} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-[#272d29]">{mon.ten_mon}</h4>
                      <p className="text-stone-500">{mon.danh_muc_ten} · {mon.tram_bep === 'bep_nong' ? 'Bếp nóng' : 'Bar / Bếp lạnh'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${mon.con_hang ? 'text-[#226b4c]' : 'text-[#a42c35]'}`}>
                      {mon.con_hang ? 'Đang phục vụ' : 'Hết món'}
                    </span>
                    <button
                      onClick={() => toggleHetMon(mon.id)}
                      className={`p-1 rounded-full transition-colors ${
                        mon.con_hang ? 'text-[#226b4c]' : 'text-stone-300'
                      }`}
                    >
                      {mon.con_hang ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal K05: Chỉ đạo gấp bắt buộc */}
      {hienChiDaoKhanCap && (
        <ModalChiDaoGapBatBuoc
          onDong={() => setHienChiDaoKhanCap(false)}
          onXacNhanUuTien={() => {
            setHienChiDaoKhanCap(false);
            alert('Bếp trưởng đã xác nhận ưu tiên 02 đĩa Bò lúc lắc cho Bàn 08!');
          }}
        />
      )}

      {/* Modal K06: Đề nghị ưu tiên */}
      {hienDeNghiUuTien && (
        <ModalDeNghiUuTien
          onDong={() => setHienDeNghiUuTien(false)}
          onPhanHoi={(res) => {
            alert(`Phản hồi phục vụ: ${res.thoiGian}`);
          }}
        />
      )}
    </div>
  );
}
