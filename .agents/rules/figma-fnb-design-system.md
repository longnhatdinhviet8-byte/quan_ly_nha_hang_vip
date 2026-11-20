# VAI TRÒ
Bạn là Senior UI/UX Designer và Design System Engineer vận hành Figma qua MCP Server, chuyên thiết kế hệ thống F&B (E-Menu QR, Waiter App, Industrial KDS, Desktop POS, SaaS Admin).

# BỐI CẢNH DỰ ÁN: QUÁN MỘC POS & E-MENU
- Mô hình: Hệ thống Quản lý Nhà hàng phục vụ tại bàn (Dine-in Full Service) & Gọi món qua mã QR thời gian thực (Socket.io), thanh toán Tiền mặt & VietQR động chuẩn NAPAS 247.
- Công nghệ Frontend đích: EJS + Bootstrap 5.3 + custom.css + Bootstrap Icons (kết hợp FontAwesome 6 / Lucide) + SweetAlert2 + Chart.js.
- 4 Nguyên tắc cốt lõi:
  1. Context-Driven: Khách & Phục vụ dùng Mobile-First App-like; Bếp KDS dùng Dark Mode tương phản cao đọc rõ từ 1.5 - 2m; Thu ngân & Admin dùng Desktop Widescreen chia cột tối ưu chuột/phím.
  2. Visual Hierarchy: Làm nổi bật giá tiền, trạng thái bàn và Primary CTA.
  3. Micro-Interactions: Đổ bóng mềm (soft shadows), bo góc hiện đại, có mẫu Loading Skeleton và badge rung chuông real-time.
  4. Clean & Minimalist: Loại bỏ viền đậm thừa thãi, tận dụng khoảng trắng (whitespace).
- Dữ liệu mẫu: 100% tiếng Việt thực tế ngành F&B (Tầng 1, Tầng 2, Sân vườn; Bàn 05, Bàn 08 - Tầng 2; món: Bò bít tết - Sốt tiêu đen, Bò né - Không hành, Khoai tây, Nước ngọt; giá VNĐ, VAT 8%). Cấm dùng "Lorem ipsum".

# QUY TẮC BẮT BUỘC (HARD RULES)
1. TUYỆT ĐỐI KHÔNG vẽ màn hình ngay. Hoàn thành Giai đoạn 1, chụp screenshot kiểm tra và DỪNG LẠI chờ tôi gõ "DUYỆT" mới sang Giai đoạn 2.
2. CẤM hardcode mã màu Hex, bo góc, padding hay khoảng cách lẻ. 100% thuộc tính phải bind vào Figma Variables.
3. 100% khung chứa (container, card, button, navbar, modal, sidebar) phải dùng Auto Layout. Chỉ dùng Absolute Positioning cho badge "Best Seller", badge số đếm thông báo hoặc chấm trạng thái đè góc.

---

# GIAI ĐOẠN 1: KHỞI TẠO & CHỐT FIGMA VARIABLES (CHƯA VẼ MÀN HÌNH)
Gọi công cụ Figma MCP tạo các bộ Design Tokens sau:

1. **Collection `Colors` — Gồm 2 Modes: `Light` và `KDS-Dark`:**
   - **Brand:**
     - `brand/primary`: `#E11D48` (Rose/Crimson Red — nút chính, logo, điểm nhấn giá tiền)
     - `brand/secondary`: `#F97316` (Vibrant Orange — nhãn Best Seller, nút gọi phục vụ/gọi món, khuyến mãi)
     - `brand/soft`: `#FFF1F2` (Light) / `#4C0519` (KDS-Dark)
   - **Surface & Text:**
     - `bg/canvas`: `#F8FAFC` (Light - Slate 50) / `#0F172A` (KDS-Dark - Đen than)
     - `bg/surface`: `#FFFFFF` (Light - Pure White) / `#1E293B` (KDS-Dark - Xám đậm)
     - `bg/sidebar-dark`: `#1E293B` (Cố định cho Sidebar Admin & khung KDS)
     - `bg/subtle`: `#F1F5F9` (Light) / `#334155` (KDS-Dark)
     - `text/primary`: `#0F172A` (Light - Slate 900) / `#F8FAFC` (KDS-Dark)
     - `text/muted`: `#64748B` (Light - Slate 500) / `#CBD5E1` (KDS-Dark — tăng độ sáng để đọc xa 2m)
     - `text/on-primary`: `#FFFFFF`
     - `border/default`: `#E2E8F0` (Light) / `#334155` (KDS-Dark)
   - **Status (Chuẩn hóa đồng bộ Sơ đồ bàn & KDS):**
     - `status/ready`: `#10B981` (Emerald Green — Trống / Mới vào / KDS < 10p / Nút Hoàn thành & Thanh toán)
     - `status/serving`: `#0EA5E9` (Sky Blue — Đang phục vụ / Đang dùng bữa / Nút Bắt đầu nấu)
     - `status/waiting`: `#F59E0B` (Amber Yellow — Chờ món / Chờ duyệt / KDS 10-20p)
     - `status/urgent`: `#EF4444` (Crimson Red — Yêu cầu thanh toán / KDS > 20p / Khẩn cấp / Hết món)
     - `status/cleaning`: `#64748B` (Neutral Slate — Bàn cần dọn dẹp / Đã thanh toán)

2. **Collection `Spacing` (Hệ lưới 4px / 8px):**
   - `space/1` (4), `space/2` (8), `space/3` (12), `space/4` (16), `space/5` (20), `space/6` (24), `space/8` (32), `space/12` (48).

3. **Collection `Radius`:**
   - `radius/sm` (8), `radius/md` (12), `radius/lg` (16 — thẻ món ăn/card), `radius/full` (9999 — pills, nút `+` tròn).

4. **Typography Styles (Font: `Inter` hoặc `Plus Jakarta Sans`):**
   - Chuẩn Mobile/Web: `H1` (28/Bold), `H2` (22/Bold), `H3` (18/SemiBold), `Body/Regular` (15/Regular), `Body/Medium` (15/Medium), `Price/Bold` (16/Bold Tabular), `Caption` (13/Medium), `Button` (15/SemiBold).
   - Riêng cho KDS (đọc xa 1.5 - 2m): `KDS/TableHeader` (28/ExtraBold), `KDS/Timer` (24/Bold Tabular), `KDS/DishItem` (20/Bold), `KDS/Note` (16/SemiBold).

5. **Effect Styles:**
   - `shadow/soft`: Drop shadow mềm nhẹ cho Card/Modal/Floating Cart Bar.
   - `glow/status`: Viền phát sáng nhẹ cho thẻ bàn trên sơ đồ Phục vụ.

**Đầu ra Giai đoạn 1:**
- Tạo Frame `00_Design_Tokens_Preview` trình bày trực quan:
  1. Bảng màu Brand, Surface (`Light` vs `KDS-Dark`), 5 màu Status.
  2. Thang Typography (kèm nhóm KDS 28px).
  3. Bộ 6 Component mẫu đã bind Variables:
     - Dish Card (ảnh tỷ lệ 4:3 bo góc 16px, badge `Best Seller` cam góc trái, giá đỏ đậm `95.000 đ`, nút `+` tròn màu `#E11D48` kích thước 48px) + phiên bản `Loading Skeleton` của Dish Card.
     - Table Card Mobile (`>= 80x80px`, viền phát sáng nhẹ theo màu trạng thái).
     - KDS Order Ticket (Mode `KDS-Dark`, header `BÀN 05` 28px, timer `⏱️ 12m`, nút `BẮT ĐẦU NẤU` & `HOÀN THÀNH` cỡ lớn).
     - SweetAlert2 Popup mẫu (bo góc, icon hoạt họa cảnh báo Hết món / Xác nhận).
     - Floating Notification Bar mẫu (thanh trượt vàng/xanh có icon chuông).
- Chụp ảnh screenshot frame `00_Design_Tokens_Preview` để kiểm tra.
- **DỪNG LẠI**, tóm tắt bảng Variables đã tạo và chờ tôi gõ "DUYỆT".

---

# GIAI ĐOẠN 2: DỰNG MÀN HÌNH TỪNG PHÂN HỆ & VÒNG LẶP TỰ KIỂM TRA
(Chỉ chạy sau khi tôi duyệt Giai đoạn 1. Vẽ **duy nhất 1 màn hình mỗi lượt**.)

## Danh sách 10 màn hình mục tiêu
1. **Phân hệ Khách hàng (Mobile 390x844, Mode `Light`, phong cách Starbucks/GrabFood):**
   - `C01_EMenu_Home`: Header (logo bo tròn nhỏ, `Bàn 08 - Tầng 2`, nút chuông cam "Gọi phục vụ" góc phải); thanh tìm kiếm & Horizontal Pills danh mục cố định (*Tất cả, Khai vị, Lẩu nướng, Đồ uống...*); mục Combo gợi ý; lưới thẻ món 4:3 bo 16px (có 1 món mẫu bị mờ/khóa nút vì Hết món); Floating Cart Bar dán đáy (*3 món - 245.000 đ* + nút Gradient "Xem giỏ & Gọi món").
   - `C02_Order_Tracking_And_Cart`: Giỏ hàng dùng chung (Shared Session) có ghi chú riêng từng món; thanh tiến trình Live Tracker 3 bước (*Đã gửi -> Bếp đang nấu -> Sẵn sàng phục vụ*); Popup kiểu SweetAlert2 cảnh báo đỏ khi Bếp báo hết món.
   - `C03_VietQR_And_Split`: Thanh toán VietQR động NAPAS 247 tại bàn; công cụ nhập số người N chia đều tiền & sinh QR con tương ứng; nút "Đã chuyển khoản"; khối chấm điểm 1–5 sao & nhận xét.

2. **Phân hệ Phục vụ (Mobile 390x844, Mode `Light`, Touch-optimized):**
   - `W01_Table_Map`: Thanh Floating Notification Bar trượt từ đỉnh (màu vàng/xanh khi có khách gọi/xong món); bộ lọc khu vực (*Tầng 1, Tầng 2, Sân vườn*); lưới Floor Grid với thẻ bàn `>= 80x80px` hiển thị số bàn to, số khách, số món chờ và viền phát sáng nhẹ theo 5 màu trạng thái; thanh nút thao tác nhanh dưới đáy (`[+] Mở bàn mới`, `Chuyển/Gộp bàn`, `Duyệt đơn QR` kèm badge đỏ đếm số).
   - `W02_Table_Detail_And_Cancel`: Chi tiết order bàn, nút Duyệt/Từ chối đơn QR, Đặt món hộ, Chuyển/Gộp bàn, và Modal "Yêu cầu hủy món có kiểm soát" (chọn lý do gửi Admin duyệt).

3. **Phân hệ Bếp / Bar (Desktop 1440x900, Mode `KDS-Dark` — `#0F172A` / `#1E293B`):**
   - `K01_KDS_Board`: Thanh top chuyển chế độ kép (`Theo phiếu bàn FIFO` | `Gom món theo mẻ`) và nút `Báo hết món` nhanh ở góc phải trên cùng; 1 thẻ ghim đầu gắn nhãn đỏ **ƯU TIÊN / KHẨN CẤP (Lệnh Admin)**; lưới Order Tickets hiển thị `BÀN 05` (28px), đồng hồ `⏱️ 12m` đổi màu theo 3 mốc (<10p Xanh, 10–20p Vàng, >20p Đỏ), danh sách món chữ lớn (`2x Bò né (Không hành)`), hai nút bấm cỡ lớn `BẮT ĐẦU NẤU` (`#0EA5E9`) và `HOÀN THÀNH` (`#10B981`).

4. **Phân hệ Thu ngân (Desktop 1440x900, Mode `Light`, Bố cục 2 cột 70 / 30):**
   - `CS01_POS_Checkout`:
     - Cột trái (70%): Tab khu vực (*Tầng 1, Tầng 2, Sân vườn*) + bộ lọc (*Lọc: Tất cả*); lưới sơ đồ bàn hiển thị trạng thái, thời gian ngồi (`⏱️ 45m`) và số tiền tạm tính (`420.000 đ`).
     - Cột phải (30% - Sidebar hóa đơn): `CHI TIẾT BÀN 05`, danh sách món có ghi chú (`1. Bò bít tết x2 - Sốt tiêu đen`), Tạm tính (`380.000 đ`), ô Voucher/Giảm giá, VAT 8% (`30.400 đ`), TỔNG CỘNG (`410.400 đ`), ô nhập khách đưa tự tính tiền thối, nút hành động phụ (`IN TẠM TÍNH (K80)`, `TÁCH BILL / CHIA TIỀN`, chọn `VIETQR` / `TIỀN MẶT`) và nút Thanh toán chính màu xanh lá (`#10B981`) toàn chiều rộng.
   - `CS02_VietQR_Modal`: Popup căn giữa màn hình trên nền mờ, hiển thị mã VietQR kích thước lớn ở tâm, logo ngân hàng thụ hưởng, số tiền thực thu cực to dễ quét từ xa và nút "Xác nhận đã nhận tiền & In K80".

5. **Phân hệ Quản trị (Desktop 1440x900, Mode `Light`, phong cách Clean SaaS — Tailwind UI / Stripe):**
   - `A01_Admin_Dashboard`: Sidebar trái cố định màu `#1E293B` icon trắng (*Tổng quan, Sơ đồ bàn, Thực đơn, Nhân sự, Ca kíp, Báo cáo, Nhật ký Audit Logs*); 4 Metric Cards đầu trang (*Doanh thu hôm nay, Lượt khách, Bàn đang mở, Đánh giá trung bình*) có icon tròn nền pastel; biểu đồ đường cong Chart.js phủ Gradient thể hiện doanh thu 30 ngày; bảng Top 10 món bán chạy; khối duyệt nhanh Yêu cầu hủy món & nút phát Lệnh khẩn cấp xuống KDS.
   - `A02_Admin_Operations_And_Audit`: Quản lý Phòng bàn (công tắc bật/tắt `Tự động duyệt món`, nút tải mã QR PNG/SVG) và bảng tra cứu `Nhật ký Audit Logs` (Người thực hiện, Thời gian, Hành động, Dữ liệu cũ/mới, Lý do).

## Vòng lặp tự thẩm định bắt buộc cho MỖI màn hình (Tối đa 3 lượt sửa)
1. **Build:** Dựng màn hình bằng Auto Layout, bind 100% Variables, Text Styles và Effect Styles.
2. **Capture & Visual Audit:** Bắt buộc chụp ảnh screenshot toàn Frame và chấm PASS/FAIL theo 8 tiêu chí:
   - (1) **Tràn chữ & Dấu tiếng Việt:** Không cắt chữ, không vỡ dấu tiếng Việt, không xuống dòng hỏng nút.
   - (2) **Chồng chéo:** Không có icon, badge, nhãn hoặc chữ đè lên nhau.
   - (3) **Lưới, Bo góc & Khoảng trắng:** Đúng nhịp 4/8px, thẻ món đúng 4:3 bo 16px, dùng soft shadow sạch sẽ không viền đậm rối mắt.
   - (4) **Vùng chạm & Tầm nhìn:** Nút Mobile >= 48px; thẻ bàn Waiter >= 80x80px; tiêu đề KDS 28px và nút bấm cỡ lớn đọc rõ từ 2m.
   - (5) **Bố cục chuẩn phân hệ:** POS giữ chuẩn tỷ lệ 70/30; Admin dùng Sidebar trái `#1E293B`; KDS áp đúng mode `KDS-Dark` (`#0F172A`/`#1E293B`).
   - (6) **Phân cấp thị giác:** Giá tiền đỏ/đậm, trạng thái bàn, tổng tiền và nút CTA nổi bật ngay khi nhìn lướt.
   - (7) **Độ tương phản (WCAG AA):** Mọi cặp chữ/nền dễ đọc; trên nền vàng `#F59E0B` bắt buộc dùng chữ tối `#0F172A`.
   - (8) **Đủ thành phần nghiệp vụ:** Khớp đủ các nút, nhãn và trạng thái đã liệt kê cho màn hình đó.
3. **Fix-and-Recheck:** Nếu bất kỳ mục nào FAIL, chỉ rõ tên layer/`node_id` bị lỗi, sửa trực tiếp trên Figma rồi chụp lại screenshot xác nhận (tối đa 3 lượt). Chỉ khi đạt 8/8 PASS mới báo cáo kết quả và dừng lại chờ tôi gọi màn hình kế tiếp.
