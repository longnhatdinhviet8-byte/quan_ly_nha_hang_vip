---
name: antigravity-c4-component-architect
description: >-
  Specialized architectural skill for scanning software repositories, analyzing dependencies, API routes, database schemas, and synthesizing clean, standardized C4 Model architecture diagrams (System Context, Container, Component, and Code levels) using Mermaid and PlantUML.
---

# Antigravity C4 Component Architect

This skill guides the agent to act as a Principal Software Architect, performing automated bottom-up code analysis and producing standardized **C4 Model** diagrams (Context, Container, Component, Code) for architectural documentation, reports, and technical specifications.

---

## 1. The C4 Model Hierarchy

When documenting software systems, structure architecture diagrams according to the 4 progressive levels of zoom:

1. **Level 1: System Context Diagram**
   - **Scope:** Highest level abstraction.
   - **Focus:** The system under design, surrounded by its users (actors) and external third-party systems (e.g., VietQR API, Payment Gateways, Email/SMS services).
   - **Audience:** Technical and non-technical stakeholders, product managers.

2. **Level 2: Container Diagram**
   - **Scope:** High-level technical architecture.
   - **Focus:** Deployable units and executables (Web Application, Single-Page App, API Server, Mobile App, Database, File Storage).
   - **Audience:** Developers, operations, system architects.

3. **Level 3: Component Diagram**
   - **Scope:** Inside a single container (e.g., inside the Express.js Backend Server).
   - **Focus:** Major internal structural modules (Controllers, Services, Repositories, Real-time Socket Handlers, Authentication Middleware).
   - **Audience:** Software engineers implementing features.

4. **Level 4: Code / Class Diagram**
   - **Scope:** Detailed design of complex classes, data structures, or algorithms.

---

## 2. Generating C4 Diagrams with Mermaid

### A. System Context Diagram (Level 1)
```mermaid
flowchart TD
    Customer["👤 Khách hàng (Dine-in Customer)"]
    Staff["🤵 Nhân viên (Waiter & Cashier)"]
    Chef["👨‍🍳 Bếp & Pha chế (Kitchen Staff)"]

    RMS["🏛️ Hệ Thống Quản Lý Nhà Hàng (RMS)\n[Node.js / Express MVC]"]
    VietQR["🏦 Hệ Thống Ngân Hàng VietQR\n[External Payment Service]"]

    Customer -->|"Quét QR gọi món & thanh toán"| RMS
    Staff -->|"Quản lý bàn, duyệt đơn, in bill"| RMS
    Chef -->|"Xem đơn & cập nhật chế biến"| RMS
    RMS -->|"Tạo mã QR thanh toán động"| VietQR
```

### B. Container Diagram (Level 2)
```mermaid
flowchart TD
    User["👤 Khách hàng & Nhân viên"]

    subgraph RMS_Boundary["Hệ Thống Quản Lý Nhà Hàng (RMS)"]
        WebClient["📱 Giao Diện Web Trình Duyệt\n[EJS, HTML5, Bootstrap 5, Socket.io Client]\nPhục vụ Khách QR, POS Thu ngân, Waiter, KDS"]
        WebServer["🖥️ Máy Chủ Ứng Dụng Web\n[Node.js / Express.js]\nXử lý nghiệp vụ MVC, API & Real-time WebSockets"]
        Database[("💾 Cơ Sở Dữ Liệu\n[SQLite3]\nLưu trữ tài khoản, menu, bàn, đơn hàng, hóa đơn")]
    end

    User -->|"HTTPS / WebSocket"| WebClient
    WebClient -->|"HTTP Requests"| WebServer
    WebClient <-->|"Socket.io (Bi-directional)"| WebServer
    WebServer -->|"SQL Queries / SQLite driver"| Database
```

### C. Component Diagram (Level 3 - Express MVC Container)
```mermaid
flowchart TD
    Client["Trình duyệt Client (HTTP / Socket)"]

    subgraph Express_App["Container: Express.js Web Server"]
        Router["Express Routers\n(/tables, /menu, /orders, /billing)"]
        AuthMid["Auth & RBAC Middleware\n(Session / Role verification)"]
        
        subgraph Controllers["Controllers Layer"]
            OrderCtrl["OrderController\n(Xử lý đơn & luồng duyệt)"]
            TableCtrl["TableController\n(Quản lý trạng thái bàn)"]
            BillingCtrl["BillingController\n(Tính tiền & sinh VietQR)"]
        end

        subgraph Realtime["Real-time Layer"]
            SocketHandler["Socket.io Server\n(Phát sự kiện đến room bếp, bàn)"]
        end

        subgraph Models["Models & Data Access"]
            OrderModel["OrderModel"]
            TableModel["TableModel"]
            InvoiceModel["InvoiceModel"]
        end
    end

    DB[("SQLite3 Database")]

    Client --> Router
    Router --> AuthMid
    AuthMid --> Controllers
    Controllers --> Models
    Controllers --> Realtime
    Realtime <-->|"Push events"| Client
    Models -->|"Query"| DB
```

---

## 3. Automated Code Scanning Protocol

When instructed to document architecture from an existing codebase:
1. **Scan `package.json`**: Identify dependencies, framework, database connectors, and engines.
2. **Inspect routing directory (`routes/` or `controllers/`)**: Map out all functional endpoints.
3. **Inspect data schema (`models/` or SQL migrations)**: Map database tables and relationships.
4. **Identify communication protocols**: Check for WebSockets, HTTP REST, background workers.
5. **Synthesize**: Generate corresponding C4 Context, Container, and Component diagrams with concise annotations.
