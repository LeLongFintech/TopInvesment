# TopInvestment Backend API

Backend REST API siêu tốc cho nền tảng phân tích chứng khoán TopInvestment, tập trung đo lường và đưa ra nhận định dữ liệu trên thị trường chứng khoán (SET). Hệ thống cung cấp các điểm cuối (endpoints) để vận hành các bộ lọc chứng khoán chuyên sâu (CANSLIM, Benjamin Graham, Cổ tức) và xây dựng dữ liệu cho hệ sinh thái biểu đồ phân tích (Radar, Scatter, Treemap, v.v.).

## 🏗 Tổng Quan Kiến Trúc

Hệ thống được thiết kế theo mô hình **Client-Server** với kiến trúc phân tầng (Layered Architecture) bên trong Backend để đảm bảo tính phân tách trách nhiệm (Separation of Concerns), dễ dàng mở rộng và bảo trì:

```text
backend/
├── app/
│   ├── main.py              # Entry point của ứng dụng FastAPI. Khởi tạo app, middleware (CORS, Logging), và mount routers.
│   ├── config.py            # Quản lý cấu hình (Environment Variables) sử dụng pydantic-settings.
│   ├── routes/              # Tầng Controller: Tiếp nhận HTTP requests, routing tới các services tương ứng.
│   ├── services/            # Tầng Business Logic: Chứa các quy tắc nghiệp vụ phức tạp (tính toán biểu đồ, filter phụ).
│   ├── repositories/        # Tầng Data Access: Giao tiếp trực tiếp với PostgreSQL thông qua SQLAlchemy (Raw SQL ưu tiên hiệu năng).
│   ├── schemas/             # Tầng Data Validation: Định nghĩa cấu trúc dữ liệu I/O bằng Pydantic models.
│   └── middleware/          # Tầng Interceptor: Middleware tùy chỉnh (VD: Logging chi tiết thời gian phản hồi từng Request).
├── database/                # Tầng Data Pipeline & ETL (Tách biệt khỏi hệ thống Web API).
│   ├── load_data.py         # Script ETL nạp dữ liệu từ file thô (Excel) vào Data Warehouse.
│   ├── compute_graham.py    # Script Pre-compute: Tính toán trước 14 chỉ số giá trị phòng thủ.
│   ├── compute_canslim.py   # Script Pre-compute: Tính toán và xếp hạng phân vị (Percentile) cho CANSLIM.
│   └── compute_dividend.py  # Script Pre-compute: Tính toán các chỉ số sức khỏe năng lực duy trì cổ tức.
├── requirements.txt         # Quản lý thư viện phụ thuộc (FastAPI, SQLAlchemy, Pandas, ...).
└── .env                     # Biến môi trường (Database credentials, JWT secret nếu có, v.v.).
```

## 🛠 Công Nghệ & Kỹ Thuật Cốt Lõi

Hệ thống được thiết kế hướng tới **Data-Intensive Application** (ứng dụng xử lý cường độ dữ liệu cao), đặt hiệu năng truy vấn và trả tải hàng vạn record dữ liệu tài chính trong thời gian thực bằng các kỹ thuật:

1. **Framework Cốt Lõi**: **FastAPI** (Python). Tận dụng tối đa lập trình bất đồng bộ (Asynchronous) của Python 3, giúp Backend đạt tốc độ phản hồi cực nhanh tương đương NodeJS, hỗ trợ tích hợp tự động Swagger UI/ReDoc tài liệu API.
2. **Cơ Sở Dữ Liệu**: **PostgreSQL** đóng vai trò Data Warehouse lưu trữ thông tin cơ sở, bao quát hàng triệu điểm dữ liệu tài chính qua 25 năm của các doanh nghiệp trên sàn.
3. **Data Access (Tối Ưu Hiệu Năng Truy Vấn)**: Không lạm dụng ORM cồng kềnh cho các truy vấn phức hợp. Hệ thống sử dụng **SQLAlchemy 2.0 Core với tính năng Raw SQL (`text()`)**. Kỹ thuật này giúp:
   - Tận dụng tối đa công cụ Query Planner của PostgreSQL.
   - Tránh độ trễ (Overhead) trong việc ánh xạ Data Models (Object-Relational Mapping) đối với các bảng lớn.
   - Trực tiếp chuyển biến chuỗi rows kết quả truy xuất sang định dạng Dictionary/JSON.
4. **Data Pipeline & Pre-computation (Tính toán trước)**:
   - Áp dụng kỹ thuật Batch Processing với thư viện **Pandas** và **NumPy** để tính toán ma trận với hiệu năng xử lý C/C++.
   - Triết lý thiết kế: *"Tính toán nặng một lần, truy vấn nhẹ nhiều lần"* (Pre-compute). Các chỉ số phức tạp, có tính chất hồi quy như *Số Graham, Biên an toàn (Margin of Safety), Xếp hạng RS (Relative Strength)* đều được tính trước. API lúc này chỉ thực thi nhiệm vụ `Query & Filter`, giảm thiểu thời gian CPU khi render kết quả.
5. **Data Validation & Serialization**: Sử dụng **Pydantic V2** (engine do Rust đảm nhiệm). Đảm bảo mọi Payload (POST request) người dùng gửi lên và Model Data trả về Frontend đều được kiểm soát nghiêm ngặt về Type Hint và Structure, loại bỏ triệt để lỗi Runtime DataType.
6. **Chart Aggregation At Backend**: Thay vì ném mảng Json thô, Tầng `services/` làm nhiệm vụ Aggregate Data cục bộ. Tính toán hình thái hiển thị (tỷ lệ phần trăm phần khúc Donut, tọa độ Scatter, nhóm size cho Treemap) và phân phát theo dạng ăn liền (*Ready-to-use Chart Data*), giúp offload hoàn toàn tài nguyên render trên thiết bị Frontend/Browser của user.

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Chuẩn Bị Môi Trường
Yêu cầu hệ thống: Python 3.10+ & PostgreSQL 15+. Cài đặt thư viện:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

Cấu hình thông tin bằng cách tạo file `.env`:
```env
# URL Kết nối CSDL Postgre của bạn
DATABASE_URL=postgresql://postgres:password_here@localhost:5432/topinvestment
# Cho phép Frontend gọi API
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### 2. Khởi Động Data Pipeline (Khay Dữ Liệu)
Data Pipeline đảm nhiệm việc Extract, Transform và Load (ETL) vào DB. Cần chạy chuỗi scripts sau khi có Batch Database mới thô:
```bash
# 1. Nạp data gốc (Market data, BCTC, Danh mục Stocks)
python -m database.load_data

# 2. Sinh dữ liệu Core Value
python -m database.compute_graham

# 3. Sinh dữ liệu Core Growth & Phân Vị Điểm
python -m database.compute_canslim

# 4. Sinh dữ liệu Core Income
python -m database.compute_dividend
```

### 3. Vận Hành API Server
Server sử dụng Uvicorn chuẩn ASGI:
```bash
uvicorn app.main:app --reload --port 8000
```
- **RESTful Endpoints Base**: `http://localhost:8000/api/v1/...`
- **Swagger Documentation**: `http://localhost:8000/docs`

## 🧠 Lõi Nghiệp Vụ Chuyên Sâu Các Bộ Lọc

Hệ thống cung cấp cơ chế 3 cỗ máy lọc (Screener Engines) trọng điểm:

*   **CANSLIM Engine** (`/filters/canslim`): Đo lường sự bứt tốc thu nhập. Tự động tính tỷ lệ tăng trưởng EPS định kỳ, Doanh thu phân kỳ nhiều quý. Chấm điểm sức mạnh tương đối (RS - Relative Strength) độc quyền dựa trên biến động nến và khối lượng giao dịch.
*   **Benjamin Graham Engine** (`/filters/value`): Engine đánh giá sức mạnh nội lực phòng thủ tài chính khắt khe nhất. Truy quét thông qua hệ số P/E thấp, P/B sát thực giá trị sổ sách, khả năng bù đắp dòng tiền (Current Ratio) và cấu trúc nợ lý tưởng (D/E). Trả về ngay lập tức giá trị **Biên an toàn (Margin of Safety)** chênh lệch thực tế.
*   **Dividend Income Engine** (`/filters/dividend`): Lọc mẻ lưới các Cỗ Máy "Bò Sữa" trả cổ tức vĩ đại. Tìm kiếm các doanh nghiệp có chuỗi chi trả tiền mặt ổn định qua nhiều năm, duy trì mức lợi tức (Yield) vượt lạm phát và cực kỳ quan trọng là có hệ số bảo trợ thanh toán tỉ suất cổ tức tối thiểu từ Dòng Tiền Tự Do.

Mỗi bộ lọc đều gắn kèm với các Endpoints phụ trợ trả về dữ liệu siêu chi tiết cung cấp cho các Dashboard thị giác hóa (VD: Trajectory EPS, lưới so sánh Industry P/E distribution, Mô hình Radar Rating hiện hành).
