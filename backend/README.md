# Backend — TopInvestment API

REST API server phục vụ các bộ lọc cổ phiếu thị trường Thái Lan. Xây dựng trên FastAPI với PostgreSQL.

## Kiến trúc

```
backend/
├── app/
│   ├── main.py              # Entry point, đăng ký routes + middleware
│   ├── config.py            # Đọc biến môi trường (.env)
│   ├── routes/              # Định tuyến API
│   │   ├── value.py         # POST /filters/value
│   │   ├── canslim.py       # POST /filters/canslim
│   │   ├── dividend.py      # POST /filters/dividend
│   │   └── stocks.py        # GET  /stocks
│   ├── services/            # Logic nghiệp vụ
│   │   ├── value_service.py       # Engine bộ lọc Benjamin Graham
│   │   ├── canslim_service.py     # Engine bộ lọc CANSLIM (2 lớp)
│   │   └── dividend_service.py    # Engine bộ lọc Cổ tức
│   ├── schemas/             # Request/Response models (Pydantic)
│   ├── repositories/        # Kết nối PostgreSQL (SQLAlchemy)
│   └── middleware/          # Logging middleware
├── database/                # Data pipeline
│   ├── load_data.py         # Nạp dữ liệu Excel → PostgreSQL
│   ├── compute_graham.py    # Tính 14 chỉ số Graham (daily)
│   └── compute_canslim.py   # Tính 12 chỉ số CANSLIM (daily)
├── requirements.txt
├── .env.example
└── .env
```

## Cài đặt

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

## Cấu hình

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Nội dung `.env`:

```
DATABASE_URL=postgresql://username:password@localhost:5432/topinvestment
```

## Data Pipeline

Pipeline chạy tuần tự, mỗi bước phụ thuộc vào bước trước:

```bash
# Bước 1: Nạp dữ liệu thô từ Excel vào PostgreSQL
python -m database.load_data

# Bước 2: Tính toán chỉ số Graham (graham_metrics table)
python -m database.compute_graham

# Bước 3: Tính toán chỉ số CANSLIM (canslim_metrics table)
python -m database.compute_canslim
```

Thời gian xử lý phụ thuộc vào lượng dữ liệu. Với ~3 triệu dòng market_data, mỗi pipeline mất khoảng 3–5 phút.

## Chạy API Server

```bash
uvicorn app.main:app --reload
```

Server khởi chạy tại http://localhost:8000. Tài liệu API tự động tại http://localhost:8000/docs.

## API Endpoints

### Bộ lọc Benjamin Graham

```
POST /api/v1/filters/value
```

Request body:

```json
{
  "date": "2024-12-31",
  "eps_consecutive_years": 10,
  "pe_max": 15.0,
  "pb_max": 1.5,
  "graham_gt_price": true,
  "margin_of_safety_min": 0.20,
  "de_max": 1.0,
  "cr_min": 2.0,
  "div_yield_min": 0.05
}
```

### Bộ lọc CANSLIM

```
POST /api/v1/filters/canslim
```

Request body:

```json
{
  "date": "2024-12-31",
  "delta_eps_min": 20.0,
  "delta_sales_min": 25.0,
  "roe_min": 0.17,
  "rs_rating_min": 80
}
```

Response bao gồm: raw metrics, 4 ratings (RS, EPS, SMR, A/D) xếp hạng bách phân vị (1–99), và chỉ số CR tổng hợp.

### Bộ lọc Cổ tức

```
POST /api/v1/filters/dividend
```

Request body:

```json
{
  "consecutive_years": 5,
  "dividend_yield_min": 0.05,
  "coverage_ratio_min": 1.5
}
```

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Framework | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Data Processing | Pandas, NumPy |
| Validation | Pydantic |
