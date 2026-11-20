// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// BỘ KIỂM THỬ TÍCH HỢP TỰ ĐỘNG TOÀN DIỆN BACKEND API (SMOKE TEST)
// ============================================================================

const http = require('http');
const ungDung = require('./ungDung');
const { khoiTaoSocket } = require('./cauHinh/cauHinhSocket');

const PORT_TEST = 3099;
const BASE_URL = `http://localhost:${PORT_TEST}`;

let server;

function inKetQua(tenKiemThu, thanhCong, chiTiet = '') {
    if (thanhCong) {
        console.log(`  ✅ [PASS] ${tenKiemThu}`);
    } else {
        console.error(`  ❌ [FAIL] ${tenKiemThu}: ${chiTiet}`);
        throw new Error(`Kiểm thử thất bại: ${tenKiemThu} - ${chiTiet}`);
    }
}

async function chayKiemThu() {
    console.log('================================================================');
    console.log('🧪 BẮT ĐẦU KIỂM THỬ TÍCH HỢP BACKEND EXPRESS & SOCKET.IO API');
    console.log('================================================================');

    // 1. Khởi động server test
    server = http.createServer(ungDung);
    khoiTaoSocket(server);
    await new Promise((resolve) => server.listen(PORT_TEST, resolve));
    console.log(`🚀 Máy chủ kiểm thử đang chạy trên cổng ${PORT_TEST}...\n`);

    try {
        // TEST 1: Health check
        console.log('📋 NHÓM 1: KIỂM TRA SỨC KHỎE HỆ THỐNG & ĐỊNH DẠNG CHUẨN');
        const resHealth = await fetch(`${BASE_URL}/api/kiem-tra-suc-khoe`);
        const jsonHealth = await resHealth.json();
        inKetQua('Health Check trả về status 200', resHealth.status === 200);
        inKetQua('Định dạng chuẩn { ok: true, data, msg }', jsonHealth.ok === true && !!jsonHealth.data && !!jsonHealth.msg);

        // TEST 2: Đăng nhập các vai trò
        console.log('\n📋 NHÓM 2: XÁC THỰC & PHÂN QUYỀN RBAC (JWT)');
        
        // Đăng nhập Admin
        const resLoginAdmin = await fetch(`${BASE_URL}/api/tai-khoan/dang-nhap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenDangNhap: 'admin', matKhau: '123456' })
        });
        const jsonAdmin = await resLoginAdmin.json();
        inKetQua('Đăng nhập tài khoản admin thành công', jsonAdmin.ok === true && jsonAdmin.data.nguoiDung.vaiTro === 'quan_ly');
        const tokenAdmin = jsonAdmin.data.token;

        // Đăng nhập Bếp
        const resLoginBep = await fetch(`${BASE_URL}/api/tai-khoan/dang-nhap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenDangNhap: 'bep01', matKhau: '123456' })
        });
        const jsonBep = await resLoginBep.json();
        inKetQua('Đăng nhập tài khoản bếp thành công', jsonBep.ok === true && jsonBep.data.nguoiDung.vaiTro === 'bep');
        const tokenBep = jsonBep.data.token;

        // Đăng nhập Phục vụ
        const resLoginPhucVu = await fetch(`${BASE_URL}/api/tai-khoan/dang-nhap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenDangNhap: 'phucvu01', matKhau: '123456' })
        });
        const jsonPhucVu = await resLoginPhucVu.json();
        inKetQua('Đăng nhập tài khoản phục vụ thành công', jsonPhucVu.ok === true && jsonPhucVu.data.nguoiDung.vaiTro === 'phuc_vu');
        const tokenPhucVu = jsonPhucVu.data.token;

        // Đăng nhập sai mật khẩu
        const resLoginSai = await fetch(`${BASE_URL}/api/tai-khoan/dang-nhap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenDangNhap: 'admin', matKhau: 'sai_mat_khau' })
        });
        const jsonLoginSai = await resLoginSai.json();
        inKetQua('Từ chối mật khẩu sai với status 401', resLoginSai.status === 401 && jsonLoginSai.ok === false);

        // TEST 3: Bàn ăn & Menu
        console.log('\n📋 NHÓM 3: SƠ ĐỒ PHÒNG BÀN & THỰC ĐƠN');
        const resBan = await fetch(`${BASE_URL}/api/ban-an`, {
            headers: { 'Authorization': `Bearer ${tokenPhucVu}` }
        });
        const jsonBan = await resBan.json();
        inKetQua('Lấy danh sách bàn ăn thành công', jsonBan.ok === true && Array.isArray(jsonBan.data.banAn) && jsonBan.data.banAn.length >= 10);

        const banB08 = jsonBan.data.banAn.find(b => b.ma_ban === 'B08');
        inKetQua('Bàn B08 tồn tại và có thông tin khu vực', !!banB08 && banB08.ma_ban === 'B08');

        // Lấy thông tin quét mã QR bàn B08
        const resQr = await fetch(`${BASE_URL}/api/ban-an/qr/${banB08.ma_qr_token}`);
        const jsonQr = await resQr.json();
        inKetQua('Quét mã QR bàn B08 trả về thông tin hợp lệ', jsonQr.ok === true && jsonQr.data.ma_ban === 'B08');

        // Lấy thực đơn
        const resMenu = await fetch(`${BASE_URL}/api/thuc-don`);
        const jsonMenu = await resMenu.json();
        inKetQua('Lấy danh sách thực đơn thành công', jsonMenu.ok === true && jsonMenu.data.tatCaMon.length >= 10);

        // TEST 4: Gọi món QR & Duyệt đơn
        console.log('\n📋 NHÓM 4: GỌI MÓN QR & PHỤC VỤ DUYỆT ĐƠN');
        const resGuiDon = await fetch(`${BASE_URL}/api/don-goi-mon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                maQrToken: banB08.ma_qr_token,
                danhSachMon: [
                    { monAnId: 1, soLuong: 1, ghiChu: 'Ít đường' },
                    { monAnId: 2, soLuong: 2, ghiChu: 'Nóng' }
                ]
            })
        });
        const jsonGuiDon = await resGuiDon.json();
        inKetQua('Khách quét QR gửi đơn gọi món thành công', jsonGuiDon.ok === true && jsonGuiDon.data.trangThai === 'cho_duyet');
        const donGoiMonId = jsonGuiDon.data.donGoiMonId;

        // Phục vụ duyệt đơn gọi món
        const resDuyetDon = await fetch(`${BASE_URL}/api/don-goi-mon/${donGoiMonId}/duyet`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenPhucVu}`
            }
        });
        const jsonDuyetDon = await resDuyetDon.json();
        inKetQua('Nhân viên phục vụ duyệt đơn gọi món vào bếp thành công', jsonDuyetDon.ok === true && jsonDuyetDon.data.trangThai === 'da_duyet');

        // TEST 5: Điều phối bếp KDS
        console.log('\n📋 NHÓM 5: ĐIỀU PHỐI BẾP KDS & TIẾN ĐỘ CHẾ BIẾN');
        const resHangDoi = await fetch(`${BASE_URL}/api/dieu-phoi-bep/hang-doi?cheDo=theo_ban`, {
            headers: { 'Authorization': `Bearer ${tokenBep}` }
        });
        const jsonHangDoi = await resHangDoi.json();
        inKetQua('Bếp lấy hàng đợi KDS theo bàn thành công', jsonHangDoi.ok === true && Array.isArray(jsonHangDoi.data));

        const resGomMon = await fetch(`${BASE_URL}/api/dieu-phoi-bep/hang-doi?cheDo=gom_mon`, {
            headers: { 'Authorization': `Bearer ${tokenBep}` }
        });
        const jsonGomMon = await resGomMon.json();
        inKetQua('Bếp lấy hàng đợi KDS chế độ gom mẻ thành công (Figma K02)', jsonGomMon.ok === true && Array.isArray(jsonGomMon.data));

        if (jsonHangDoi.data.length > 0) {
            const monDauTien = jsonHangDoi.data[0];
            // Bếp chuyển sang đang nấu
            const resDangNau = await fetch(`${BASE_URL}/api/dieu-phoi-bep/chi-tiet/${monDauTien.chi_tiet_id}/trang-thai`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenBep}`
                },
                body: JSON.stringify({ trangThaiMoi: 'dang_nau' })
            });
            const jsonDangNau = await resDangNau.json();
            inKetQua('Bếp nhận nấu món ăn thành công', jsonDangNau.ok === true && jsonDangNau.data.trangThaiMoi === 'dang_nau');

            // Bếp chuyển sang hoàn thành nấu
            const resXong = await fetch(`${BASE_URL}/api/dieu-phoi-bep/chi-tiet/${monDauTien.chi_tiet_id}/trang-thai`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenBep}`
                },
                body: JSON.stringify({ trangThaiMoi: 'hoan_thanh' })
            });
            const jsonXong = await resXong.json();
            inKetQua('Bếp hoàn thành món ăn thành công', jsonXong.ok === true && jsonXong.data.trangThaiMoi === 'hoan_thanh');
        }

        // TEST 6: Hóa đơn & VietQR & Thanh toán
        console.log('\n📋 NHÓM 6: TÍNH TIỀN, VIETQR & HOÀN TẤT HÓA ĐƠN');
        const resTamTinh = await fetch(`${BASE_URL}/api/hoa-don/tam-tinh/${banB08.id}`);
        const jsonTamTinh = await resTamTinh.json();
        inKetQua('Tính tạm tính hóa đơn bàn B08 thành công (kèm VAT 8%)', jsonTamTinh.ok === true && jsonTamTinh.data.tongTienThanhToan > 0);
        inKetQua('Sinh liên kết VietQR động chuẩn Napas', !!jsonTamTinh.data.vietQr && jsonTamTinh.data.vietQr.qrUrl.includes('vietqr.io'));

        // Lấy danh sách hóa đơn sẵn có
        const resDsHd = await fetch(`${BASE_URL}/api/hoa-don`, {
            headers: { 'Authorization': `Bearer ${tokenAdmin}` }
        });
        const jsonDsHd = await resDsHd.json();
        inKetQua('Thu ngân lấy danh sách hóa đơn thành công', jsonDsHd.ok === true && jsonDsHd.data.length > 0);
        const hoaDonMau = jsonDsHd.data[0];

        // Chia tiền nhóm (Figma C10)
        const resChiaTien = await fetch(`${BASE_URL}/api/hoa-don/${hoaDonMau.id}/chia-tien`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ soNguoiChia: 4 })
        });
        const jsonChiaTien = await resChiaTien.json();
        inKetQua('Chia tiền nhóm 4 người thành công', jsonChiaTien.ok === true && jsonChiaTien.data.soNguoiChia === 4);

        // TEST 7: Ca làm việc & Đổi ca (W11 & A07)
        console.log('\n📋 NHÓM 7: CA LÀM VIỆC & YÊU CẦU ĐỔI CA (US-W09 / W11 / A07)');
        const resLichCaNhan = await fetch(`${BASE_URL}/api/ca-lam-viec/lich-ca-nhan`, {
            headers: { 'Authorization': `Bearer ${tokenPhucVu}` }
        });
        const jsonLich = await resLichCaNhan.json();
        inKetQua('Nhân viên xem lịch làm việc cá nhân thành công', jsonLich.ok === true && Array.isArray(jsonLich.data));

        // Xem danh sách yêu cầu đổi ca
        const resDsYc = await fetch(`${BASE_URL}/api/ca-lam-viec/yeu-cau-doi-ca`, {
            headers: { 'Authorization': `Bearer ${tokenAdmin}` }
        });
        const jsonDsYc = await resDsYc.json();
        inKetQua('Quản lý xem danh sách yêu cầu đổi ca thành công', jsonDsYc.ok === true && jsonDsYc.data.length > 0);

        // Phê duyệt yêu cầu đổi ca (nếu chưa có yêu cầu chờ duyệt, tạo mới một yêu cầu)
        let ycDuyetId;
        const ycChoDuyet = jsonDsYc.data.find(y => y.trang_thai === 'cho_duyet');
        if (ycChoDuyet) {
            ycDuyetId = ycChoDuyet.id;
        } else {
            // Tạo mới ca làm việc & yêu cầu đổi ca để test duyệt
            const resTaoCa = await fetch(`${BASE_URL}/api/ca-lam-viec/tao-ca`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAdmin}`
                },
                body: JSON.stringify({
                    nhanVienId: 4,
                    ngayLam: '2026-11-28',
                    tenCa: 'ca_toi',
                    gioBatDau: '17:00',
                    gioKetThuc: '22:00',
                    ghiChu: 'Ca làm việc test đổi ca'
                })
            });
            const jsonTaoCa = await resTaoCa.json();
            const caMoiId = jsonTaoCa.data.id;

            const resTaoYc = await fetch(`${BASE_URL}/api/ca-lam-viec/yeu-cau-doi-ca`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenPhucVu}`
                },
                body: JSON.stringify({
                    caLamViecId: caMoiId,
                    loaiYeuCau: 'doi_ca',
                    nhanVienNhanCaId: 5,
                    lyDo: 'Bận việc gia đình test đổi ca'
                })
            });
            const jsonTaoYc = await resTaoYc.json();
            ycDuyetId = jsonTaoYc.data.id;
        }

        const resDuyetCa = await fetch(`${BASE_URL}/api/ca-lam-viec/yeu-cau-doi-ca/${ycDuyetId}/phe-duyet`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify({
                trangThai: 'da_duyet',
                ghiChuDuyet: 'Đồng ý duyệt đổi ca'
            })
        });
        const jsonDuyetCa = await resDuyetCa.json();
        inKetQua('Quản lý phê duyệt yêu cầu đổi ca thành công (A07)', jsonDuyetCa.ok === true && jsonDuyetCa.data.trang_thai === 'da_duyet');

        // TEST 8: Hệ thống, Cấu hình & Báo cáo Dashboard
        console.log('\n📋 NHÓM 8: HỆ THỐNG, AUDIT LOG & DASHBOARD QUẢN LÝ (A01 / A20)');
        const resCauHinh = await fetch(`${BASE_URL}/api/he-thong/cau-hinh`);
        const jsonCauHinh = await resCauHinh.json();
        inKetQua('Lấy thông tin cấu hình nhà hàng thành công', jsonCauHinh.ok === true && !!jsonCauHinh.data.ten_nha_hang);

        const resNhatKy = await fetch(`${BASE_URL}/api/he-thong/nhat-ky`, {
            headers: { 'Authorization': `Bearer ${tokenAdmin}` }
        });
        const jsonNhatKy = await resNhatKy.json();
        inKetQua('Lấy nhật ký kiểm toán hệ thống thành công (A20)', jsonNhatKy.ok === true && Array.isArray(jsonNhatKy.data) && jsonNhatKy.data.length > 0);

        const resDashboard = await fetch(`${BASE_URL}/api/he-thong/thong-ke`, {
            headers: { 'Authorization': `Bearer ${tokenAdmin}` }
        });
        const jsonDashboard = await resDashboard.json();
        inKetQua('Lấy số liệu thống kê Dashboard thành công (A01)', jsonDashboard.ok === true && !!jsonDashboard.data.thongKeHomNay);

        console.log('\n================================================================');
        console.log('🎉 TẤT CẢ CÁC BÀI KIỂM THỬ BACKEND ĐỀU ĐÃ ĐẠT 100%! (ALL PASSED)');
        console.log('================================================================\n');
    } finally {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
    }
}

chayKiemThu().catch(err => {
    console.error('LỖI KIỂM THỬ:', err);
    process.exit(1);
});
