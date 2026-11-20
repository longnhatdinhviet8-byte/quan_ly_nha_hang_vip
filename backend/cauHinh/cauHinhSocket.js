// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// CẤU HÌNH VÀ ĐIỀU PHỐI SOCKET.IO GATEWAY THỜI GIAN THỰC (REAL-TIME)
// ============================================================================

const { Server } = require('socket.io');
const cauHinh = require('./cauHinhChung');

let io = null;

/**
 * Khởi tạo Socket.io Server gắn kết với HTTP Server
 * @param {import('http').Server} mayChuHttp 
 * @returns {Server}
 */
function khoiTaoSocket(mayChuHttp) {
    io = new Server(mayChuHttp, {
        cors: {
            origin: cauHinh.nguonFrontendChoPhep,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        // 1. Gia nhập phòng theo vai trò nội bộ (bep, thu_ngan, phuc_vu, admin)
        socket.on('tham_gia_vai_tro', (vaiTro) => {
            if (['bep', 'thu_ngan', 'phuc_vu', 'quan_ly'].includes(vaiTro)) {
                socket.join(vaiTro);
            }
        });

        // 2. Gia nhập phòng theo bàn ăn (Khách hàng quét QR bàn X)
        socket.on('tham_gia_ban', (banId) => {
            if (banId) {
                socket.join(`ban_${banId}`);
            }
        });

        // 3. Rời phòng
        socket.on('roi_ban', (banId) => {
            if (banId) {
                socket.leave(`ban_${banId}`);
            }
        });

        socket.on('disconnect', () => {
            // Ngắt kết nối socket tự nhiên
        });
    });

    return io;
}

/**
 * Lấy đối tượng IO hiện tại để phát sự kiện từ các Service
 * @returns {Server}
 */
function layIo() {
    if (!io) {
        throw new Error('Socket.io chưa được khởi tạo. Hãy gọi khoiTaoSocket trước.');
    }
    return io;
}

/**
 * Các hàm phát sự kiện Realtime chuẩn hóa toàn dự án
 */
const socketPhat = {
    // Thông báo đơn món mới gửi từ khách QR tới nhân viên phục vụ & bếp
    donHangMoi: (duLieu) => {
        if (!io) return;
        io.to('phuc_vu').emit('don_hang_moi', duLieu);
        io.to('bep').emit('don_hang_moi', duLieu);
        if (duLieu.banId) {
            io.to(`ban_${duLieu.banId}`).emit('trang_thai_don_hang', duLieu);
        }
    },

    // Thông báo Bếp bắt đầu nấu hoặc nấu xong món ăn
    tienDoMonAn: (duLieu) => {
        if (!io) return;
        io.to('phuc_vu').emit('tien_do_mon_an', duLieu);
        io.to('thu_ngan').emit('tien_do_mon_an', duLieu);
        if (duLieu.banId) {
            io.to(`ban_${duLieu.banId}`).emit('tien_do_mon_an', duLieu);
        }
    },

    // Báo chuông khách bấm Gọi phục vụ hoặc Yêu cầu tính tiền
    khachGoiHoTro: (duLieu) => {
        if (!io) return;
        io.to('phuc_vu').emit('khach_goi_ho_tro', duLieu);
        if (duLieu.loaiYeuCau === 'yeu_cau_thanh_toan') {
            io.to('thu_ngan').emit('khach_yeu_cau_thanh_toan', duLieu);
        }
    },

    // Báo trạng thái thanh toán hóa đơn thành công
    thanhToanThanhCong: (duLieu) => {
        if (!io) return;
        io.to('phuc_vu').emit('thanh_toan_thanh_cong', duLieu);
        io.to('thu_ngan').emit('thanh_toan_thanh_cong', duLieu);
        io.to('quan_ly').emit('thanh_toan_thanh_cong', duLieu);
        if (duLieu.banId) {
            io.to(`ban_${duLieu.banId}`).emit('thanh_toan_thanh_cong', duLieu);
        }
    },

    // Báo yêu cầu đổi ca / xin nghỉ mới tới Admin
    yeuCauDoiCaMoi: (duLieu) => {
        if (!io) return;
        io.to('quan_ly').emit('yeu_cau_doi_ca_moi', duLieu);
    },

    // Báo kết quả phê duyệt đổi ca tới nhân viên liên quan
    ketQuaDuyetCa: (duLieu) => {
        if (!io) return;
        io.to('phuc_vu').emit('ket_qua_duyet_ca', duLieu);
    },

    // Cập nhật trạng thái bàn ăn (Trống / Có khách / Chờ món / Yêu cầu thanh toán)
    trangThaiBan: (duLieu) => {
        if (!io) return;
        io.to('phuc_vu').emit('trang_thai_ban', duLieu);
        io.to('thu_ngan').emit('trang_thai_ban', duLieu);
        io.to('quan_ly').emit('trang_thai_ban', duLieu);
    }
};

module.exports = {
    khoiTaoSocket,
    layIo,
    socketPhat
};
