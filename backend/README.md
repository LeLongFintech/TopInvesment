# Backend — TopInvestment API Engine

REST API Server siêu tốc phục vụ hệ sinh thái các bộ lọc chứng khoán tinh gọn chuyên sâu cho thị trường Thái Lan (SET). Kiến trúc Server được xây dựng trên `FastAPI` với `PostgreSQL`.

## 🏗️ Tổng Quan Kiến Trúc (Backend)

```
backend/
├── app/
│   ├── main.py              # Entry point khởi chạy Server & Swagger UI
│   ├── config.py            # Quản lý cấu hình biến môi trường
│   ├── routes/              # Endpoints API theo luồng
│   │   ├── value.py         # POST /filters/value & GET Charts
│   │   ├── canslim.py       # POST /filters/canslim & GET Charts
│   │   ├── dividend.py      # POST /filters/dividend & GET Charts
│   │   └── stocks.py        # Quản lý danh mục & Auto-complete
│   ├── services/            # Tầng Logic (Bộ não rà soát chỉ số)
│   │   ├── value_service.py       # Lõi lọc Benjamin Graham
│   │   ├── canslim_service.py     # Lõi lọc CANSLIM (Engine Rating 2 Lớp)
│   │   └── dividend_service.py    # Lõi lọc Cổ tức (Income Cashflow)
│   ├── schemas/             # Pydantic Schema kiểm thử In/Out data
│   ├── repositories/        # SQL Engine (Truy vấn tự động hóa)
│   └── middleware/          # Security & Request Logging
├── database/                # Tầng Data Pipeline (Xây Data Warehouse)
│   ├── load_data.py         # Nạp data Excel thô -> Bảng SQL
│   ├── compute_graham.py    # Compute 14 chỉ số giá trị phòng thủ
│   └── compute_canslim.py   # Compute 12 chỉ số xếp hạng tăng trưởng
├── requirements.txt         # Package chuẩn
├── .env.example             # Template cấu hình DB
└── .env                     # File chứa Password, URL chạy cục bộ
```

---

## 🚀 Huấn Luyện & Tính Toán Dữ Liệu (Data Pipeline)

Hệ thống sở hữu môt Data Pipeline được thiết kế để tự động nội suy và tính toán trước (Pre-compute) toàn bộ các chỉ số nặng nề, lưu xuống dạng Data Warehouse để Backend API chỉ việc `Query + Filter`.

Trình tự chạy Pipeline (chạy tuần tự):

```bash
# BƯỚC 1: ETL dòng dữ liệu siêu khổng lồ (3 triệu ròng thị trường + BCTC 25 năm)
python -m database.load_data

# BƯỚC 2: Machine tính toán biên phòng thủ Graham
python -m database.compute_graham

# BƯỚC 3: Máy xếp phân vị bách (Percentile) cho CANSLIM
python -m database.compute_canslim
```
> Thời gian xử lý Engine khoảng 3-5 phút phụ thuộc cấu hình RAM.

---

## 🌐 Khởi Chạy Server API

Chạy Backend thông qua `uvicorn` (FastAPI Server):

```bash
uvicorn app.main:app --reload --port 8000
```
- Server REST: `http://localhost:8000`
- API Sandbox (Swagger UI để Test): `http://localhost:8000/docs`

---

## 🛠️ API Endpoints (Lõi Kinh Điển)

### 1. The Growth: Bộ Lọc CANSLIM
Nhận diện các doanh nghiệp đang trong đà tăng trưởng bứt phá với lực đẩy tổ chức. Trả về hệ thống Rating EPS/RS độc quyền.

```http
POST /api/v1/filters/canslim
```
**Payload mẫu:**
```json
{
  "date": "2024-12-31",
  "delta_eps_min": 25.0,
  "delta_sales_min": 25.0,
  "roe_min": 0.17,
  "rs_rating_min": 80
}
```

### 2. The Value: Lưới Lọc Benjamin Graham
Quét giá trị nội tại cốt lõi, loại bỏ công ty sử dụng đòn bẩy bong bóng, cung cấp ngay "Biên an toàn".

```http
POST /api/v1/filters/value
```
**Payload mẫu:**
```json
{
  "date": "2024-12-31",
  "eps_consecutive_years": 10,
  "pe_max": 15.0,
  "pb_max": 1.5,
  "graham_gt_price": true,
  "margin_of_safety_min": 0.20,
  "de_max": 1.0,
  "cr_min": 1.5,
  "div_yield_min": 0.05
}
```

### 3. The Income: Cỗ Máy "Bò Sữa" Cổ Tức
Dò tìm những cỗ máy tạo tiền mặt trơn tru, miễn nhiễm khủng hoảng thông qua hệ số bao phủ (DCR).

```http
POST /api/v1/filters/dividend
```
**Payload mẫu:**
```json
{
  "consecutive_years": 5,
  "dividend_yield_min": 0.05,
  "coverage_ratio_min": 1.5,
  "sort_by": "avg_coverage_ratio",
  "sort_order": "desc"
}
```

---

## ⚙️ Công Nghệ Backend

Hệ thống được thiết kế nhắm tới Data-Intensive Application. Xây dựng độc quyền hoàn toàn bằng Python stack:

- **Framework**: `FastAPI` (Bất đồng bộ - Async, tự gen docs, nhanh gấp 3 Flask/Django).
- **Core Database**: `PostgreSQL 15+`.
- **ORM & Quản lý Schema**: `SQLAlchemy 2.0`.
- **Data Engineering**: `Pandas`, `NumPy` thao tác matrix siêu cấp.
- **Data Validation**: `Pydantic` V2 (viết bằng Rust siêu tốc).
