// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MÁY CHỦ CHÍNH (ENTRY POINT) - KHỞI CHẠY HTTP VÀ SOCKET.IO GATEWAY
// ============================================================================

const http = require('http');
const ungDung = require('./ungDung');
const { khoiTaoSocket } = require('./cauHinh/cauHinhSocket');
const cauHinh = require('./cauHinh/cauHinhChung');

// Tạo HTTP Server từ ứng dụng Express
const mayChuHttp = http.createServer(ungDung);

// Gắn kết Socket.io Server thời gian thực
const io = khoiTaoSocket(mayChuHttp);

const PORT = cauHinh.congBackend;

if (require.main === module) {
    mayChuHttp.listen(PORT, () => {
        console.log('================================================================');
        console.log('🚀 MÁY CHỦ QUÁN MỘC POS & E-MENU ĐÃ KHỞI CHẠY THÀNH CÔNG!');
        console.log(`📡 Địa chỉ HTTP API:    http://localhost:${PORT}`);
        console.log(`🔌 Cổng Socket.io:      ws://localhost:${PORT}`);
        console.log(`🏥 Kiểm tra sức khỏe:   http://localhost:${PORT}/api/kiem-tra-suc-khoe`);
        console.log(`🗄️ CSDL SQLite:        ${cauHinh.duongDanCsdl}`);
        console.log(`🕒 Thời gian khởi động: ${new Date().toLocaleString('vi-VN')}`);
        console.log('================================================================');
    });

    // Lắng nghe tín hiệu dừng chương trình an toàn
    const dongMayChuAnToan = () => {
        console.log('\n🛑 Đang đóng máy chủ Quán Mộc POS...');
        mayChuHttp.close(() => {
            console.log('✅ Đã đóng toàn bộ kết nối mạng.');
            process.exit(0);
        });
    };

    process.on('SIGINT', dongMayChuAnToan);
    process.on('SIGTERM', dongMayChuAnToan);
}

module.exports = {
    mayChuHttp,
    ungDung,
    io
};
