// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// QUẢN LÝ KẾT NỐI REALTIME SOCKET.IO CLIENT
// ============================================================================

import { io } from 'socket.io-client';

let socket = null;

export function khoiTaoSocket() {
  if (!socket) {
    // Kết nối tới cùng host (Vite proxy chuyển tiếp websocket sang port 3001)
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.io] Đã kết nối thời gian thực:', socket.id);
    });

    socket.on('disconnect', (lyDo) => {
      console.log('🔌 [Socket.io] Mất kết nối:', lyDo);
    });
  }
  return socket;
}

export const taoKetNoiSocket = khoiTaoSocket;

export function laySocket() {
  if (!socket) {
    return khoiTaoSocket();
  }
  return socket;
}

export function thamGiaBan(banId) {
  const s = laySocket();
  if (s && banId) {
    s.emit('tham_gia_ban', banId);
  }
}

export function roiBan(banId) {
  const s = laySocket();
  if (s && banId) {
    s.emit('roi_ban', banId);
  }
}

export function thamGiaVaiTro(vaiTro) {
  const s = laySocket();
  if (s && vaiTro) {
    s.emit('tham_gia_vai_tro', vaiTro);
  }
}
