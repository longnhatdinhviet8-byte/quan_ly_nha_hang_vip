// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// ĐỊNH TUYẾN ỨNG DỤNG VÀ ĐIỀU PHỐI 5 PHÂN HỆ NGHIỆP VỤ
// ============================================================================

import React, { useState, useEffect } from 'react';
import TrangChaoMung from '../trang/thucDonQr/TrangChaoMung';
import TrangThucDon from '../trang/thucDonQr/TrangThucDon';
import TrangGioHang from '../trang/gioHang/TrangGioHang';
import TrangTheoDoiMon from '../trang/theoDoiDonMon/TrangTheoDoiMon';
import TrangYeuCauThanhToanKhach from '../trang/thanhToan/TrangYeuCauThanhToanKhach';
import TrangVietQrKhach from '../trang/thanhToan/TrangVietQrKhach';
import TrangThanhToanThanhCong from '../trang/thanhToan/TrangThanhToanThanhCong';
import TrangDanhGiaDichVu from '../trang/danhGiaDichVu/TrangDanhGiaDichVu';
import TrangDangNhap from '../trang/dangNhap/TrangDangNhap';
import TrangSoDoBan from '../trang/soDoBan/TrangSoDoBan';
import TrangChiTietBan from '../trang/soDoBan/TrangChiTietBan';
import TrangCaLamViecNhanVien from '../trang/caLamViec/TrangCaLamViecNhanVien';
import TrangKdsBep from '../trang/dieuPhoiBep/TrangKdsBep';
import TrangPosKiemBill from '../trang/thanhToan/TrangPosKiemBill';
import TrangQuanTri from '../trang/quanTri/TrangQuanTri';
import { DANH_SACH_MON_AN, DON_MAU_BAN_08 } from '../dungChung/duLieuMau';

export default function DinhTuyenUngDung({ phanHeHienTai, onChuyenPhanHe, thongTinBan }) {
  // State phân hệ khách hàng E-Menu (C01 - C14)
  const [trangKhach, setTrangKhach] = useState('chaoMung'); // chaoMung, thucDon, gioHang, theoDoi, yeuCauThanhToan, vietQr, thanhCong, danhGia
  
  // Nạp giỏ hàng đã lưu từ LocalStorage để phòng ngừa mất món khi reload trang
  const [gioHang, setGioHang] = useState(() => {
    try {
      const maBan = thongTinBan?.ma_ban || 'B08';
      const daLuu = localStorage.getItem(`gio_hang_${maBan}`);
      if (daLuu) return JSON.parse(daLuu);
    } catch (e) {
      console.warn('Lỗi đọc giỏ hàng:', e);
    }
    return [
      { id: 1, ten_mon: 'Bò lúc lắc', so_luong: 2, gia: 189000, ghi_chu: 'Ít cay, chín vừa' },
      { id: 2, ten_mon: 'Gỏi ngó sen tôm', so_luong: 1, gia: 89000, ghi_chu: 'Không hành' },
      { id: 3, ten_mon: 'Cơm chiên hải sản', so_luong: 1, gia: 129000, ghi_chu: '' },
      { id: 4, ten_mon: 'Trà đào cam sả', so_luong: 4, gia: 45000, ghi_chu: 'Ít ngọt' }
    ];
  });

  // Tự động lưu giỏ hàng vào LocalStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      const maBan = thongTinBan?.ma_ban || 'B08';
      localStorage.setItem(`gio_hang_${maBan}`, JSON.stringify(gioHang));
    } catch (e) {}
  }, [gioHang, thongTinBan]);

  // State nhân viên phục vụ (W01 - W11)
  const [trangPhucVu, setTrangPhucVu] = useState('soDoBan'); // soDoBan, chiTietBan, caLamViec
  const [banDangXem, setBanDangXem] = useState(null);
  const [nguoiDung, setNguoiDung] = useState(null);

  // Thêm món vào giỏ
  const handleThemVaoGio = (monMoi) => {
    setGioHang(prev => {
      const tonTai = prev.find(item => item.id === monMoi.id);
      if (tonTai) {
        return prev.map(item => item.id === monMoi.id ? { ...item, so_luong: item.so_luong + monMoi.so_luong, ghi_chu: monMoi.ghi_chu || item.ghi_chu } : item);
      }
      return [...prev, monMoi];
    });
  };

  const handleCapNhatSoLuong = (id, soLuongMoi) => {
    if (soLuongMoi <= 0) {
      setGioHang(prev => prev.filter(item => item.id !== id));
    } else {
      setGioHang(prev => prev.map(item => item.id === id ? { ...item, so_luong: soLuongMoi } : item));
    }
  };

  // PHÂN HỆ 1: KHÁCH HÀNG QR E-MENU (C01 - C14)
  if (phanHeHienTai === 'khachHang') {
    if (trangKhach === 'chaoMung') {
      return (
        <TrangChaoMung
          ban={thongTinBan}
          onKhamPhaThucDon={() => setTrangKhach('thucDon')}
          onDangNhapNhanVien={() => onChuyenPhanHe('dangNhap')}
          onChuyenTab={(tab) => {
            if (tab === 'monDaGoi') setTrangKhach('theoDoi');
            if (tab === 'hoTro') setTrangKhach('theoDoi');
          }}
        />
      );
    }

    if (trangKhach === 'thucDon') {
      return (
        <TrangThucDon
          ban={thongTinBan}
          gioHang={gioHang}
          onThemVaoGio={handleThemVaoGio}
          onXemGioHang={() => setTrangKhach('gioHang')}
          onChuyenTab={(tab) => {
            if (tab === 'monDaGoi') setTrangKhach('theoDoi');
            if (tab === 'hoTro') setTrangKhach('theoDoi');
          }}
          onGoiHoTro={() => setTrangKhach('theoDoi')}
        />
      );
    }

    if (trangKhach === 'gioHang') {
      return (
        <TrangGioHang
          gioHang={gioHang}
          onCapNhatSoLuong={handleCapNhatSoLuong}
          onQuayLaiThucDon={() => setTrangKhach('thucDon')}
          onGuiDon={() => {
            alert('Đã gửi đơn gọi món tới nhân viên phục vụ bàn duyệt!');
            setTrangKhach('theoDoi');
          }}
          onChuyenTab={(tab) => {
            if (tab === 'thucDon') setTrangKhach('thucDon');
            if (tab === 'monDaGoi') setTrangKhach('theoDoi');
          }}
        />
      );
    }

    if (trangKhach === 'theoDoi') {
      return (
        <TrangTheoDoiMon
          onYeuCauTinhTien={() => setTrangKhach('yeuCauThanhToan')}
          onChuyenTab={(tab) => {
            if (tab === 'thucDon') setTrangKhach('thucDon');
          }}
        />
      );
    }

    if (trangKhach === 'yeuCauThanhToan') {
      return (
        <TrangYeuCauThanhToanKhach
          onChuyenVietQr={() => setTrangKhach('vietQr')}
          onThanhToanTienMat={() => {
            alert('Đã thông báo thu ngân tới bàn thanh toán tiền mặt!');
            setTrangKhach('thanhCong');
          }}
          onQuayLaiTheoDoi={() => setTrangKhach('theoDoi')}
          onChuyenTab={(tab) => {
            if (tab === 'thucDon') setTrangKhach('thucDon');
            if (tab === 'monDaGoi') setTrangKhach('theoDoi');
          }}
        />
      );
    }

    if (trangKhach === 'vietQr') {
      return (
        <TrangVietQrKhach
          onThanhToanXong={() => setTrangKhach('thanhCong')}
          onQuayLaiYeuCau={() => setTrangKhach('yeuCauThanhToan')}
          onChuyenTab={(tab) => {
            if (tab === 'thucDon') setTrangKhach('thucDon');
          }}
        />
      );
    }

    if (trangKhach === 'thanhCong') {
      return (
        <TrangThanhToanThanhCong
          onDanhGia={() => setTrangKhach('danhGia')}
          onVeTrangChu={() => setTrangKhach('chaoMung')}
        />
      );
    }

    if (trangKhach === 'danhGia') {
      return (
        <TrangDanhGiaDichVu
          onGuiDanhGia={() => {}}
          onVeTrangChu={() => setTrangKhach('chaoMung')}
        />
      );
    }
  }

  // PHÂN HỆ 2: NHÂN VIÊN PHỤC VỤ (W01 - W11)
  if (phanHeHienTai === 'phucVu') {
    if (trangPhucVu === 'chiTietBan' && banDangXem) {
      return (
        <TrangChiTietBan
          ban={banDangXem}
          onQuayLai={() => setTrangPhucVu('soDoBan')}
          onBaoThanhToan={() => {
            alert(`Đã gửi yêu cầu thanh toán cho ${banDangXem.ten_ban} tới Thu ngân POS`);
            setTrangPhucVu('soDoBan');
          }}
        />
      );
    }

    if (trangPhucVu === 'caLamViec') {
      return (
        <TrangCaLamViecNhanVien
          onQuayLai={() => setTrangPhucVu('soDoBan')}
          onChuyenTab={(tab) => setTrangPhucVu(tab)}
          onDangXuat={() => onChuyenPhanHe('dangNhap')}
        />
      );
    }

    return (
      <TrangSoDoBan
        onChonBan={(ban) => {
          setBanDangXem(ban);
          setTrangPhucVu('chiTietBan');
        }}
        onChuyenTab={(tab) => setTrangPhucVu(tab)}
        onDangXuat={() => onChuyenPhanHe('dangNhap')}
      />
    );
  }

  // PHÂN HỆ 3: BẾP THÔNG MINH KDS (K01 - K06)
  if (phanHeHienTai === 'bep') {
    return (
      <TrangKdsBep
        onDangXuat={() => onChuyenPhanHe('dangNhap')}
      />
    );
  }

  // PHÂN HỆ 4: THU NGÂN POS DESKTOP (P01 - P09)
  if (phanHeHienTai === 'thuNgan') {
    return (
      <TrangPosKiemBill
        onDangXuat={() => onChuyenPhanHe('dangNhap')}
      />
    );
  }

  // PHÂN HỆ 5: QUẢN TRỊ NHÀ HÀNG ADMIN (A01 - A20)
  if (phanHeHienTai === 'quanTri') {
    return (
      <TrangQuanTri
        onDangXuat={() => onChuyenPhanHe('dangNhap')}
      />
    );
  }

  // ĐĂNG NHẬP CHUNG
  return (
    <TrangDangNhap
      onQuayLaiMenuKhach={() => onChuyenPhanHe('khachHang')}
      onDangNhapThanhCong={(user) => {
        setNguoiDung(user);
        if (user.vaiTro === 'quan_ly') onChuyenPhanHe('quanTri');
        else if (user.vaiTro === 'thu_ngan') onChuyenPhanHe('thuNgan');
        else if (user.vaiTro === 'bep') onChuyenPhanHe('bep');
        else onChuyenPhanHe('phucVu');
      }}
    />
  );
}
