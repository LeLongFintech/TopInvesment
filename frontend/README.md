# Frontend — TopInvestment Dashboard

Giao diện người dùng độc quyền cho hệ thống sàng lọc cổ phiếu thị trường chứng khoán Thái Lan (SET). Xây dựng trên nền tảng `React 18` + `TypeScript` + `Vite` và hệ thống biểu đồ tài chính cấp cao.

## 🌈 Giao Diện (UI/UX) Thông Minh Đa Chiều

Dashboard cung cấp lăng kính trực quan nhất về thị trường thông qua việc ảo hóa các dãy số báo cáo tài chính khô khan thành các điểm ảnh.

Hệ thống bao gồm 3 phân khu chuyên sâu:

### 1. Bộ lọc Tăng trưởng CANSLIM
- **Trải nghiệm**: Thanh khoản màu Rating theo bách phân vị: **Xanh dương** (Siêu Việt ≥ 90), **Xanh lá** (Mạnh ≥ 70), **Vàng** (Trung bình), **Đỏ** (Kém).
- **Biểu đồ Cấp cao**: 
  - Heatmap Dẫn dắt Ngành (Nhìn toàn cảnh vĩ mô dòng tiền vào nhóm Ngành).
  - Biểu đồ nến lai đường SMA50 & SMA150 chấm phá điểm Mua/Bán kỹ thuật.
  - Gauge đo ROE & Combo Chart tăng trưởng EPS.

### 2. Bộ lọc Giá trị Benjamin Graham
- **Trải nghiệm**: Máy quét Margin of Safety bảo thủ và an toàn.
- **Biểu đồ Cấp cao**:
  - Radar Spider Chart chấm 6 điểm hoàn thiện tài chính của doanh nghiệp.
  - Bubble Plot phát hiện bẫy định giá đắt/rẻ.
  - P/E Histogram cho biết vị thế đắt rẻ trong cùng một Ngành.
  - Waterfall bóc tách phần trăm chiết khấu ("Món Hời").

### 3. Bộ lọc Dòng tiền Cổ tức (Dividend Yield)
- **Trải nghiệm**: Sách lược săn Bò Sữa Cashflow. Dễ dàng định vị Cạm bẫy Cổ tức nhờ đường DCR đỏ ngầu.
- **Biểu đồ Cấp cao**:
  - Sector Heatmap Cổ tức chia ngành: Xem khối nào giàu tiền mặt chi trả nhất.
  - Dashboard Scatter bóc giá trị thực sự của DCR vs Yield.
  - Combo EPS & Cổ tức tiền mặt qua 5-10 năm.

---

## 🏗️ Cấu Trúc Khối Chuyên Biệt

```
frontend/src/
├── api/                    # Cổng kết nối Backend (Fetch data)
│   ├── valueApi.ts         # Gọi Model Graham
│   ├── canslimApi.ts       # Gọi Model CANSLIM
│   └── dividendApi.ts      # Gọi Model Dividend
├── assets/
│   └── index.css           # Token Design: Dark/Light colors mix
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx     # Menu điều hướng tĩnh
│   ├── ui/                 # Core Components (DatePicker, Button)
│   ├── charts/canslim      # ~ 5 Biểu đồ tăng trưởng (Recharts + Apex)
│   ├── charts/graham       # ~ 12 Biểu đồ giá trị (Recharts + Apex)
│   └── charts/dividend     # ~ 2 Biểu đồ Cashflow
├── context/
│   └── ThemeContext.tsx    # Hook đổi màu Dark / Light siêu nhanh
├── pages/
│   ├── ValueFilter.tsx     # Layout Module Graham
│   ├── CanslimFilter.tsx   # Layout Module CANSLIM
│   └── DividendFilter.tsx  # Layout Module Cổ Tức
├── App.tsx                 # Router & Wrapper Layout
└── main.tsx                # Hydrate rễ Root React
```

## 🛠️ Triển Khai Nhanh Development

Framework Frontend được xây dựng dựa trên Vite. Điểm lợi là quá trình chắp vá nóng (Hot Module Reload) chưa tới 50ms khi bạn đang code biểu đồ. 

```bash
# Trỏ vào file frontend
cd frontend

# Cài đặt dependency khắt khe (dùng pnpm)
pnpm install

# Build Dev-Server
pnpm dev
```

Truy cập màn hình điều khiển: `http://localhost:3000`. Cần chắc chắn API Backend (`localhost:8000`) đang kết nối để fetch bảng phân tích cổ phiếu!

## ⚡ Công Nghệ Giao Diện Core

- **Engine Vẽ React**: `React 18` siêu phân luồng.
- **Hệ Thống Phân Kiểu**: `TypeScript` bóc lỗi tĩnh.
- **Kiến Trúc Tốc Độ**: `Vite` cực nhẹ.
- **Lưới Cấu Trúc Mĩ Thuật**: `TailwindCSS` (Cấu hình tokens màu CSS Variables tùy chỉnh).
- **Trái Tim Xử Lý Chart**: `ApexCharts` (Render tương tác nặng cực đẹp) & `Recharts` (Đóng gói SVG tĩnh tiện dụng).
- **Hệ Biểu Trưng**: `Material Symbols` Google 2024.
