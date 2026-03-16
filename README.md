<div align="center">
  <img src="https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</div>

# TopInvestment — Nền Tảng Phân Tích & Sàng Lọc Phân Khúc Chuyên Sâu

TopInvestment là hệ thống phân tích và sàng lọc tự động dành riêng cho thị trường chứng khoán Thái Lan (SET). Với việc kết hợp kho dữ liệu tài chính lịch sử 25 năm cùng những thuật toán mạnh mẽ, nền tảng giúp nhà đầu tư cá nhân số hóa các phương pháp đầu tư kinh điển rườm rà thành những quyết định trực quan ngay trên Dashboard.

## 🌟 Lõi Phân Tích Hệ Thống (Bộ Lọc Đa Chiều)

Hệ thống cung cấp 3 lăng kính đầu tư chuyên biệt, được tinh chỉnh dữ liệu và thuật toán dành riêng cho đặc thù của thị trường chứng khoán Thái Lan (SET):

### 1. Bộ lọc CANSLIM (Đầu tư Tăng trưởng - Growth Investing)
- **Mục tiêu**: Nhận diện các doanh nghiệp đang trong đà tăng trưởng lợi nhuận bứt phá và có dòng tiền thông minh (quỹ ngoại, tổ chức) bảo trợ.
- **Tiêu chí cốt lõi**: Lợi nhuận quý/năm (EPS) tăng trưởng tối thiểu 25%, sức mạnh giá (RS Rating) đạt top 20% thị trường, và có câu chuyện đổi mới (sản phẩm/ban lãnh đạo mới).
- **Điểm nổi bật**: Kỷ luật quản trị rủi ro cắt lỗ tuyệt đối ở mức 7-8%, giúp nhà đầu tư bơi ngược dòng tìm ra các "siêu cổ phiếu" ngay cả khi kinh tế vĩ mô tăng trưởng chậm. (Hệ thống cung cấp bảng Rating độc quyền, biểu đồ RS Line, khối lượng OBV và đánh giá EPS tăng tốc).

### 2. Bộ lọc Benjamin Graham (Đầu tư Giá trị - Value Investing)
- **Mục tiêu**: Tìm kiếm các doanh nghiệp có nền tảng tài chính cực kỳ vững chắc nhưng đang bị ngài thị trường (Mr. Market) định giá thấp hơn giá trị nội tại.
- **Tiêu chí cốt lõi**: Đảm bảo "Biên an toàn" (Margin of Safety) với P/E < 15, P/B < 1.5, tỷ lệ Nợ/Vốn chủ sở hữu (D/E) < 1.0 và tỷ số thanh toán hiện hành > 1.5.
- **Điểm nổi bật**: Bộ khiên phòng thủ vững chắc, loại bỏ hoàn toàn các doanh nghiệp sử dụng đòn bẩy tài chính quá mức hoặc kinh doanh thiếu ổn định trong 10 năm qua. (Tích hợp Radar điểm Graham, biểu đồ Biên an toàn Waterfall, bảng phân phối P/E cùng ngành).

### 3. Bộ lọc Dividend Yield (Đầu tư Dòng tiền - Income Investing)
- **Mục tiêu**: Săn tìm những "con bò sữa" tạo ra dòng tiền thụ động an toàn, chống lại lạm phát và giúp nhà đầu tư tránh xa "cạm bẫy cổ tức" (Dividend Trap).
- **Tiêu chí cốt lõi**: Tỷ suất cổ tức > 5%, duy trì chi trả liên tục 3-5 năm và Hệ số bao phủ cổ tức (DCR) > 1.5.
- **Điểm nổi bật**: Đảm bảo doanh nghiệp chi trả cổ tức bằng tiền tươi thóc thật từ lợi nhuận cốt lõi, vẫn giữ lại đủ dư địa vốn để tái đầu tư thay vì gồng nợ để trả tiền. (Được trang bị biểu đồ phân tán săn bò sữa, Heatmap dòng tiền cổ tức các ngành, và máy quét DCR liên tục).

---

## 🏗️ Kiến Trúc Hệ Thống

Dự án tuân theo tiêu chuẩn **Client-Server Architecture**, chia làm 3 phân hệ độc lập nhằm tối ưu hóa hiệu suất xử lý dữ liệu lớn (Big Data):

- **Data Pipeline** (`backend/database/`): Nền tảng làm sạch, tổng hợp, nội suy và tính toán hàng triệu bản ghi (từ năm 2000-2025) từ Excel vào PostgreSQL.
- **Backend API Engine** (`backend/app/`): Động cơ lọc siêu tốc với FastAPI và SQLAlchemy. Trả về hàng ngàn kết quả lọc phức tạp và phân trang dữ liệu trong chưa tới 200ms.
- **Frontend Dashboard** (`frontend/`): Trải nghiệm người dùng mượt mà, Dark/Light Mode chuẩn tài chính, biểu đồ (ApexCharts & Recharts) phân quyền tương tác trơn tru.

---

## 🚀 Hướng Dẫn Khởi Chạy (Local Development)

### Yêu Cầu Môi Trường
- **Python 3.12+**
- **Node.js 18+** & **pnpm 8+**
- **PostgreSQL 15+**

### Bước 1: Thiết Lập Cơ Sở Dữ Liệu (PostgreSQL)
1. Tạo một database rỗng trong PostgreSQL, ví dụ: `topinvestment`.
2. Truy cập thư mục `backend`, sao chép cấu hình biến môi trường:
   ```bash
   cd backend
   cp .env.example .env
   ```
3. Chỉnh sửa file `.env` với thông tin kết nối PostgreSQL của bạn.
   *(Ví dụ: `DATABASE_URL=postgresql://postgres:password123@localhost:5432/topinvestment`)*

### Bước 2: Build Nền Tảng Backend & Data Pipeline
Khởi tạo môi trường ảo và cài đặt thư viện lõi:
```bash
# Đang đứng ở thư mục /backend
python -m venv venv
.\venv\Scripts\activate        # (Windows)
# source venv/bin/activate     # (macOS/Linux)

pip install -r requirements.txt
```

Khởi chạy **Data Pipeline** (Chạy lần lượt từng luồng để đồng bộ DB):
> **Lưu ý**: Dữ liệu rất lớn. Quá trình này có thể tốn từ 3–5 phút cho mỗi lệnh.
```bash
# 1. Nạp dữ liệu thô (Market Data, BCTC)
python -m database.load_data

# 2. Xây dựng Data Warehouse cho bộ lọc Graham
python -m database.compute_graham

# 3. Xây dựng Data Warehouse & Điểm Rating cho bộ lọc CANSLIM
python -m database.compute_canslim

# 4. Xây dựng Data Warehose & Metrics cho bộ lọc cổ tức
python -m database.compute_dividend
```

Mở Server Backend:
```bash
uvicorn app.main:app --reload --port 8000
```
> Server API sẵn sàng tại: http://localhost:8000
> Tài liệu Swagger UI: http://localhost:8000/docs

### Bước 3: Build Nền Tảng Frontend
Mở một terminal mới, trở về thư mục gốc và vào frontend:
```bash
cd frontend

# Cài đặt toàn bộ Node modules
pnpm install

# Khởi chạy giao diện
pnpm dev
```
> Giao diện sẵn sàng tại: http://localhost:3000

---

## 👨‍💻 Tổ Chức & Nhóm Phát Triển

Dự án thuộc khuôn khổ môn học **Phân tích Chứng khoán** — Học kỳ 7.

| Vị trí | Chuyên trách | Họ & Tên |
|---|---|---|
| **Leader / Tech Lead** | Architect, Data Pipeline, Analytics Engine, Full-stack & Project Management | **Lê Hoàng Long** |
| **Lead Content** | Financial Logic Validation, Quality Assurance (QA), and Data Visualization Design | **Lê Thị Thanh Mai** |
| **Lead Content** | Data Sourcing, Filter Criteria Setting, Quality Assurance, and Chart Prototyping | **Nguyễn Tuấn Vũ** |
| **Members** | Financial Model Research, Chart Conceptualization | |

*Tổng quy mô thành viên: 10 thành viên.*

---

## 📜 Giấy Phép & Tuyên Bố Miễn Trừ Trách Nhiệm
- Dự án là sản phẩm học thuật, phục vụ mục đích nghiên cứu Hệ thống thông tin & Phân tích tài chính.
- Toàn bộ kết quả xếp hạng và biểu đồ không cấu thành các lời khuyên hay lệnh mua/bán chứng khoán trong thực tế.
