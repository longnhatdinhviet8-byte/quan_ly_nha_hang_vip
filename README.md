# HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)

[![Node.js Version](https://img.shields.io/badge/Node.js-22%20LTS-brightgreen.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20(WAL%20Mode)-blue.svg)](https://sqlite.org/)
[![UI Design](https://img.shields.io/badge/Design-100%25%20Figma%20Fidelity-orange.svg)](https://www.figma.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Test%20Suite-23%2F23%20Passing-success.svg)](./backend/kiemThuBackend.js)

Hệ thống quản lý nhà hàng F&B toàn diện chuẩn hóa theo thiết kế Figma 60 màn hình, hỗ trợ quy trình vận hành khép kín thời gian thực qua WebSockets (Socket.IO) và thanh toán VietQR động chuẩn Napas 247.

---

## 🌟 5 PHÂN HỆ NGHIỆP VỤ CHÍNH

1. **Khách hàng E-Menu (C01 - C14)**: Quét mã QR tại bàn, xem thực đơn phân loại, giỏ hàng chung, đặt món, theo dõi tiến độ bếp realtime, yêu cầu thanh toán & chia tiền nhóm, đánh giá dịch vụ.
2. **Nhân viên Phục vụ (W01 - W11)**: Bản đồ sơ đồ bàn trực quan theo trạng thái màu sắc, duyệt đơn gọi món QR của khách, đặt món hộ, chuyển/gộp bàn, nộp phiếu xin đổi ca.
3. **Bếp thông minh KDS (K01 - K06)**: Hàng đợi món thời gian thực, **chế độ gom mẻ món giống nhau (Batching)** tối ưu năng suất đầu bếp, cập nhật trạng thái nấu (`dang_nau`, `hoan_thanh`, `da_phuc_vu`).
4. **Thu ngân POS Desktop (P01 - P09)**: Kiểm bill bàn, áp dụng chiết khấu/khuyến mãi, thuế VAT 8%, in hóa đơn nhiệt khổ K80 (80mm), đối soát VietQR / tiền mặt.
5. **Quản trị Nhà hàng Admin (A01 - A20)**: Dashboard doanh thu, giờ cao điểm, quản trị nhân sự & phân ca, duyệt nghỉ/đổi ca, nhật ký kiểm toán (Audit Log) bảo mật.

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY MÔI TRƯỜNG ẢO DOCKER (1 CHẠM TỰ ĐỘNG)

Hệ thống đã được đóng gói container hóa hoàn chỉnh. Bạn chỉ cần cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) và chạy lệnh:

```bash
# Khởi chạy môi trường ảo tự động ngầm dưới nền
docker compose up --build -d
```

Sau khi chạy xong, truy cập:
* **Giao diện chính**: `http://localhost:3001`
* **Màn hình đăng nhập nhân viên**: `http://localhost:3001/?phanHe=dangNhap`
* **Kiểm tra sức khỏe hệ thống (Health Check)**: `http://localhost:3001/api/kiem-tra-suc-khoe`

Dừng môi trường ảo:
```bash
docker compose down
```

---

## 💻 HƯỚNG DẪN CHẠY TRỰC TIẾP VỚI NODE.JS (LOCAL / PRODUCTION)

### 1. Chuẩn bị môi trường
Yêu cầu: Node.js 22 LTS trở lên.
```bash
# Cài đặt thư viện Backend
npm install

# Cài đặt thư viện Frontend
cd frontend
npm install
cd ..
```

### 2. Thiết lập cơ sở dữ liệu mẫu
```bash
npm run seed-db
```

### 3. Khởi chạy chế độ phát triển (Development)
* Terminal 1 (Backend API & Socket.io trên cổng 3001):
  ```bash
  npm run dev:backend
  ```
* Terminal 2 (Frontend Vite trên cổng 3000):
  ```bash
  npm run dev:frontend
  ```

### 4. Đóng gói & Chạy chế độ Vận hành thật (Production Single Port)
```bash
# Tự động nạp CSDL & Build frontend
npm run setup:prod

# Khởi chạy máy chủ sản xuất duy nhất tại cổng 3001
npm start
```

---

## 🔑 TÀI KHOẢN ĐĂNG NHẬP MẶC ĐỊNH (Mật khẩu: `123456`)

| Phân hệ | Tên đăng nhập | Vai trò | Chức năng chính |
|---|---|---|---|
| **Quản trị Admin** | `admin` | `quan_ly` | Toàn quyền cấu hình, nhân sự, doanh thu, audit log |
| **Thu ngân POS** | `thungan` (hoặc `thungan01`) | `thu_ngan` | Kiểm bill, thanh toán VietQR, in bill K80, chia tiền |
| **Bếp KDS** | `bep` (hoặc `bep01`) | `bep` | Nhận món, gom mẻ, đổi trạng thái nấu |
| **Phục vụ bàn** | `phucvu` (hoặc `phucvu01`) | `phuc_vu` | Xem sơ đồ bàn, duyệt đơn QR, đổi bàn, nộp đổi ca |

---

## 🧪 BỘ KIỂM THỬ TỰ ĐỘNG (CI/CD TEST SUITE)

Để chạy kiểm thử toàn bộ CSDL và 23 API Backend:
```bash
npm test
```
