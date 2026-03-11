# Frontend — TopInvestment

Giao diện người dùng cho hệ thống sàng lọc cổ phiếu thị trường Thái Lan. Xây dựng trên React + TypeScript + Vite.

## Cấu trúc thư mục

```
frontend/src/
├── api/                    # Kết nối Backend
│   ├── client.ts           # API base URL
│   ├── valueApi.ts         # Hàm gọi API bộ lọc Benjamin Graham
│   ├── canslimApi.ts       # Hàm gọi API bộ lọc CANSLIM
│   └── dividendApi.ts      # Hàm gọi API bộ lọc Cổ tức
├── assets/
│   └── index.css           # CSS toàn cục, design tokens, theme
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx     # Thanh điều hướng bên trái
│   ├── ui/
│   │   └── DatePicker.tsx  # Component chọn ngày
│   └── charts/graham/      # Biểu đồ phân tích Graham
│       ├── GrahamTreemap.tsx
│       ├── GrahamScatter.tsx
│       ├── GrahamBubble.tsx
│       ├── GrahamShieldBar.tsx
│       ├── GrahamSectorDonut.tsx
│       ├── GrahamPriceVsValue.tsx
│       └── GrahamHistoricalBands.tsx
├── context/
│   └── ThemeContext.tsx     # Quản lý Dark/Light mode
├── pages/
│   ├── Dashboard.tsx        # Trang tổng quan
│   ├── ValueFilter.tsx      # Trang bộ lọc Benjamin Graham
│   ├── CanslimFilter.tsx    # Trang bộ lọc CANSLIM
│   └── DividendFilter.tsx   # Trang bộ lọc Cổ tức
├── App.tsx                  # Component gốc, routing theo tab
└── main.tsx                 # Entry point
```

## Cài đặt

```bash
cd frontend
pnpm install
```

## Chạy Development Server

```bash
pnpm dev
```

Ứng dụng khởi chạy tại http://localhost:3000.

Đảm bảo Backend API đang chạy tại http://localhost:8000 trước khi sử dụng các bộ lọc.

## Các trang chính

### Dashboard
Trang tổng quan hệ thống. Hiển thị thông tin chung về thị trường.

### Bộ lọc Benjamin Graham
- Chọn ngày tham chiếu bằng DatePicker
- 8 tiêu chí lọc có thể bật/tắt và điều chỉnh ngưỡng
- Bảng kết quả với sắp xếp và phân trang
- Click vào mã cổ phiếu để xem biểu đồ lịch sử (Price vs Value, Historical Bands)
- Dashboard biểu đồ: Treemap, Scatter, Bubble, Shield Bar, Sector Donut

### Bộ lọc CANSLIM
- Chọn ngày tham chiếu
- 4 tiêu chí có thể điều chỉnh: Delta EPS, Delta Sales, ROE, RS Rating
- Bảng kết quả với 4 hệ thống Rating (RS, EPS, SMR, A/D) và chỉ số CR tổng hợp
- Biểu đồ xếp hạng ngành theo RS Rating trung bình (Top ngành dẫn dắt)
- Màu sắc Rating: xanh dương (≥90, Blue Chip), xanh lá (≥70), vàng (≥50), đỏ (<50)

### Bộ lọc Cổ tức
- 3 tiêu chí: Số năm liên tục, Tỷ suất cổ tức tối thiểu, Hệ số bao phủ tối thiểu
- Bảng kết quả với progress bar cho tỷ suất cổ tức

## Theme

Hỗ trợ Dark mode và Light mode. Chuyển đổi bằng nút ở góc trên bên phải. Trạng thái được lưu trong localStorage.

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS |
| Icons | Material Symbols |
| Package Manager | pnpm |
