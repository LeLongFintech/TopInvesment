# TopInvestment — Hệ thống Sàng lọc Cổ phiếu Thị trường Thái Lan

Hệ thống phân tích và sàng lọc cổ phiếu thị trường SET (Stock Exchange of Thailand) dựa trên các phương pháp đầu tư kinh điển. Cung cấp bộ công cụ sàng lọc theo nhiều chiến lược khác nhau, từ đầu tư giá trị (Value Investing) đến đầu tư tăng trưởng (Growth Investing).

## Tổng quan hệ thống

Dự án được xây dựng theo kiến trúc **Client-Server**, gồm 3 tầng chính:

- **Data Pipeline** (`backend/database/`): Tiền xử lý dữ liệu tài chính, tính toán các chỉ số phân tích, lưu trữ vào PostgreSQL.
- **Backend API** (`backend/app/`): REST API phục vụ các bộ lọc cổ phiếu.
- **Frontend** (`frontend/`): Giao diện người dùng hiển thị kết quả sàng lọc và biểu đồ phân tích.

## Các bộ lọc cổ phiếu

### 1. Bộ lọc Benjamin Graham (Value Investing)
Áp dụng triết lý đầu tư giá trị — tìm kiếm doanh nghiệp có nền tảng tài chính vững chắc, đang bị thị trường định giá thấp hơn giá trị nội tại.

**Tiêu chí**: EPS dương liên tục, P/E ≤ 15, P/B ≤ 1.5, Graham Number > Giá, Biên an toàn ≥ 20%, D/E < 1, Current Ratio > 2, Cổ tức ≥ 5%.

### 2. Bộ lọc CANSLIM (Growth Investing)
Sàng lọc cổ phiếu tăng trưởng theo chiến lược của William O'Neil — 2 lớp lọc với xếp hạng bách phân vị.

**Lớp 1 (Điều kiện cứng)**: Delta EPS Quý ≥ 20%, Delta Doanh thu ≥ 25%, ROE ≥ 17%.

**Lớp 2 (Xếp hạng)**: RS Rating ≥ 80, EPS Rating, SMR Rating, A/D Rating → Tổng hợp thành chỉ số CR = RS×0.35 + EPS×0.35 + SMR×0.2 + AD×0.1.

### 3. Bộ lọc Cổ tức (Dividend Investing)
Sàng lọc cổ phiếu trả cổ tức ổn định với hệ số bao phủ cổ tức cao.

**Tiêu chí**: Trả cổ tức liên tục 3–5 năm, Tỷ suất cổ tức TB ≥ 5%, Hệ số bao phủ ≥ 1.5.

## Cấu trúc dự án

```
Project/
├── Data/                   # Dữ liệu nguồn (Excel)
├── backend/
│   ├── app/                # REST API (FastAPI)
│   │   ├── routes/         # Định tuyến API
│   │   ├── services/       # Logic nghiệp vụ (engine)
│   │   ├── schemas/        # Pydantic models
│   │   └── repositories/   # Kết nối database
│   └── database/           # Data pipeline
│       ├── load_data.py    # Nạp dữ liệu vào DB
│       ├── compute_graham.py
│       └── compute_canslim.py
├── frontend/
│   └── src/
│       ├── api/            # Kết nối Backend
│       ├── components/     # UI components
│       ├── pages/          # Các trang giao diện
│       └── context/        # Quản lý state
├── docs/                   # Tài liệu dự án
└── RULES.md                # Quy tắc code
```

## Yêu cầu hệ thống

- Python 3.12+
- Node.js 18+
- PostgreSQL 15+
- pnpm (package manager)

## Khởi chạy nhanh

### 1. Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Cấu hình database
cp .env.example .env
# Sửa DATABASE_URL trong .env

# Nạp dữ liệu
python -m database.load_data
python -m database.compute_graham
python -m database.compute_canslim

# Chạy API server
uvicorn app.main:app --reload
```

### 2. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### 3. Truy cập

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs

## Nguồn dữ liệu

Dữ liệu tài chính được thu thập từ các nguồn công khai trên thị trường SET (Stock Exchange of Thailand), bao gồm:

- Báo cáo tài chính: Income Statement, Balance Sheet, Cash Flow
- Dữ liệu giao dịch: Giá đóng cửa, giá cao, giá thấp, khối lượng
- EPS theo quý

Khoảng thời gian: **2000 – 2025**.

## Nhóm phát triển

Dự án môn học **Phân tích Chứng khoán** — Học kỳ 7.

| Vai trò | Thành viên |
|---|---|
| **Leader / Lead Kỹ thuật** | Lê Hoàng Long |
| **Lead Nội dung** | Lê Thị Thanh Mai |
| **Lead Nội dung** | Nguyễn Tuấn Vũ |

Tổng số thành viên: **10 người**.

## Giấy phép

Dự án phục vụ mục đích học tập và nghiên cứu.
