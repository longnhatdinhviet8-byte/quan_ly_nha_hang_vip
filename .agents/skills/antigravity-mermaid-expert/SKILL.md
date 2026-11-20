---
name: antigravity-mermaid-expert
description: >-
  Expert guidelines and best practices for creating, validating, styling, and rendering flawless Mermaid.js diagrams (Flowcharts, ERDs, Sequence diagrams, State, Class, XY charts) in Antigravity chat, markdown artifacts, and web docs. Prevents syntax errors, handles node quoting, entity cardinality, and theme consistency.
---

# Antigravity Mermaid Expert Guide

This skill trains the agent to produce robust, visually aesthetic, and zero-error Mermaid diagrams across all supported diagram types in Markdown and Antigravity artifacts.

---

## 1. Syntax Reliability & Error Prevention Rules

1. **Always Quote Node Labels with Special Characters:**
   - Any label containing parentheses `()`, brackets `[]`, braces `{}`, quotes, colons `:`, slashes `/`, or ampersands `&` **MUST** be enclosed in double quotes.
   - **Correct:** `id["Tầng 1 (10 bàn)"]`
   - **Incorrect:** `id[Tầng 1 (10 bàn)]` (will crash Mermaid parser).

2. **Never Use Unescaped HTML in Labels:**
   - Avoid `<br>`, `<b>`, `<i>` inside node texts in chat artifacts unless strictly validated. Use newline strings inside quotes if supported or split into sub-nodes.

3. **Supported Diagram Types in Antigravity Artifacts:**
   - Flowcharts / Graphs: `flowchart TD` / `flowchart LR` / `graph TD` / `graph LR`
   - Sequence Diagrams: `sequenceDiagram`
   - State Diagrams: `stateDiagram-v2` or `stateDiagram`
   - Class Diagrams: `classDiagram`
   - Entity-Relationship Diagrams: `erDiagram`
   - XY Charts: `xychart-beta`
   - *Note:* For roadmaps or project schedules, use directed flowcharts or Markdown tables instead of unsupported diagram types.

---

## 2. Best Practices by Diagram Type

### A. Flowcharts (`flowchart TD` / `flowchart LR`)
- Use meaningful alphanumeric node IDs (`startNode`, `checkAuth`, `saveOrder`).
- Clearly distinguish decisions with `{...}`, processes with `[...]`, and external systems with `[(...)]`.
- Example:
```mermaid
flowchart TD
    Start(["Khách quét QR"]) --> Scan["Đọc table_id"]
    Scan --> CheckActive{"Bàn đang hoạt động?"}
    CheckActive -- "Có" --> LoadMenu["Tải thực đơn EJS"]
    CheckActive -- "Không" --> OpenTable["Thu ngân mở bàn mới"]
    OpenTable --> LoadMenu
```

### B. Sequence Diagrams (`sequenceDiagram`)
- Always declare participants / actors explicitly with `actor` or `participant`.
- Use `autonumber` for clear step-by-step reading in reports.
- Use `alt / else / end`, `opt / end`, and `loop / end` for control flows.
- Example:
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    participant Server as Express Server
    participant DB as SQLite DB
    participant Kitchen as Màn hình Bếp KDS

    Customer->>Server: Gửi order món (HTTP/WebSocket)
    Server->>DB: Lưu order & order_details
    DB-->>Server: Trả về order_id
    Server-->>Kitchen: Bắn socket 'new_order' (Real-time)
    Server-->>Customer: Phản hồi tạo đơn thành công
```

### C. Entity-Relationship Diagrams (`erDiagram`)
- Use standard Crow's Foot notation:
  - Exactly one: `||`
  - Zero or one: `|o`
  - Zero or more: `}o`
  - One or more: `}|`
- Explicitly define fields, types, and constraints (`PK`, `FK`).
- Example:
```mermaid
erDiagram
    TABLES ||--o{ ORDERS : "chứa"
    ORDERS ||--|{ ORDER_DETAILS : "gồm"
    MENU_ITEMS ||--o{ ORDER_DETAILS : "được gọi trong"
    CATEGORIES ||--|{ MENU_ITEMS : "phân loại"

    TABLES {
        int id PK
        string table_number
        string status
        int capacity
    }
    ORDERS {
        int id PK
        int table_id FK
        datetime created_at
        string status
        float total_amount
    }
```

---

## 3. Styling & Subgraphs

- Group related components into subgraphs with clear identifiers:
```mermaid
flowchart LR
    subgraph ClientLayer["Lớp Client"]
        QR["QR Mobile Web"]
        POS["Cashier Desktop"]
    end
    subgraph ServerLayer["Lớp Backend"]
        Express["Express MVC"]
    end
    ClientLayer --> ServerLayer
```
- Keep node labels concise, meaningful, and professional.
