// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// APP CHÍNH - 100% GIAO DIỆN CHUẨN FIGMA (KHÔNG CÓ THANH CÔNG CỤ DƯ THỪA)
// ============================================================================

import React, { useState, useEffect } from 'react';
import DinhTuyenUngDung from './dinhTuyen/DinhTuyenUngDung';
import ThongBaoToast from './thanhPhan/ThongBaoToast';
import { taoKetNoiSocket } from './dungChung/ketNoiSocket';
import { api } from './dungChung/api';

export default function App() {
  // Lấy thông tin bàn từ URL QR hoặc bộ nhớ tạm
  const layThongTinBanKhoiTao = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const maBanUrl = params.get('ban');
      const tokenUrl = params.get('token');
      if (maBanUrl || tokenUrl) {
        const banMoi = {
          ma_ban: maBanUrl || 'B08',
          ten_ban: `Bàn ${ (maBanUrl || 'B08').replace('B', '') }`,
          khu_vuc: 'Tầng 1 (Khu Máy Lạnh)',
          token: tokenUrl || 'BAN_B08_TOKEN_SECURE_2026'
        };
        localStorage.setItem('ban_hien_tai', JSON.stringify(banMoi));
        return banMoi;
      }
      const banLuu = localStorage.getItem('ban_hien_tai');
      if (banLuu) return JSON.parse(banLuu);
    } catch (e) {
      console.warn('Lỗi đọc bàn lưu trữ:', e);
    }
    return {
      ma_ban: 'B08',
      ten_ban: 'Bàn 08',
      khu_vuc: 'Tầng 1 (Khu Máy Lạnh)',
      token: 'BAN_B08_TOKEN_SECURE_2026'
    };
  };

  // Lấy phân hệ từ URL search params hoặc thông tin đăng nhập
  const layPhanHeKhoiTao = () => {
    const params = new URLSearchParams(window.location.search);
    const phanHeUrl = params.get('phanHe');
    if (phanHeUrl) return phanHeUrl;

    const nguoiDung = api.layNguoiDung();
    if (nguoiDung) {
      if (nguoiDung.vaiTro === 'quan_ly') return 'quanTri';
      if (nguoiDung.vaiTro === 'thu_ngan') return 'thuNgan';
      if (nguoiDung.vaiTro === 'bep') return 'bep';
      if (nguoiDung.vaiTro === 'phuc_vu') return 'phucVu';
    }
    return 'khachHang'; // Mặc định là Khách hàng E-Menu quét mã QR tại bàn (C01)
  };

  const [phanHe, setPhanHe] = useState(layPhanHeKhoiTao);
  const [thongTinBan, setThongTinBan] = useState(layThongTinBanKhoiTao);
  const [thongBao, setThongBao] = useState(null);

  // Xác thực token bàn từ Backend nếu có
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      api.get(`/api/ban-an/qr/${token}`)
        .then(ban => {
          if (ban) {
            const duLieuBan = {
              id: ban.id,
              ma_ban: ban.ma_ban,
              ten_ban: ban.ten_ban,
              khu_vuc: ban.ten_khu_vuc || 'Tầng 1 (Khu Máy Lạnh)',
              so_cho: ban.so_cho || 4,
              trang_thai: ban.trang_thai,
              token: ban.qr_token
            };
            setThongTinBan(duLieuBan);
            localStorage.setItem('ban_hien_tai', JSON.stringify(duLieuBan));
          }
        })
        .catch(err => {
          console.warn('Xác thực QR token bàn không thành công, dùng bàn mặc định:', err.message);
        });
    }
  }, []);

  useEffect(() => {
    // Khởi tạo Socket.io lắng nghe sự kiện từ máy chủ Backend
    const socket = taoKetNoiSocket();
    if (socket) {
      socket.on('don-mon-moi', (data) => {
        setThongBao({
          loai: 'info',
          noiDung: `Đơn gọi món mới từ Bàn ${data.ma_ban || '08'} (#${data.ma_don || 'ORD-081'})`
        });
      });

      socket.on('trang-thai-mon', (data) => {
        setThongBao({
          loai: 'success',
          noiDung: `Món "${data.ten_mon}" đã cập nhật: ${data.trang_thai}`
        });
      });

      socket.on('het-mon', (data) => {
        setThongBao({
          loai: 'error',
          noiDung: `Cảnh báo: Món "${data.ten_mon}" vừa hết nguyên liệu!`
        });
      });

      socket.on('lenh-bep-khan-cap', (data) => {
        setThongBao({
          loai: 'error',
          noiDung: `Chỉ đạo gấp từ Quản lý: ${data.noiDung}`
        });
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#272d29] flex flex-col font-sans selection:bg-[#f9ede6] selection:text-[#b64d2d]">
      {/* Vùng hiển thị màn hình 100% chuẩn Figma (Không có thanh công cụ trên cùng) */}
      <main className="flex-1 flex flex-col">
        <DinhTuyenUngDung
          phanHeHienTai={phanHe}
          onChuyenPhanHe={setPhanHe}
          thongTinBan={thongTinBan}
        />
      </main>

      {/* Toast thông báo realtime */}
      {thongBao && (
        <ThongBaoToast
          loai={thongBao.loai}
          noiDung={thongBao.noiDung}
          onDong={() => setThongBao(null)}
        />
      )}
    </div>
  );
}
