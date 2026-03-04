from pydantic import BaseModel, Field


class StockBase(BaseModel):
    symbol: str = Field(..., description="Mã cổ phiếu, ví dụ: FPT, VNM")
    company_name: str = Field(..., description="Tên công ty")
    price: float = Field(..., description="Giá hiện tại")
    change_percent: float = Field(0.0, description="Biến động giá (%)")
    volume: int = Field(0, description="Khối lượng giao dịch")


class StockDetail(StockBase):
    industry: str | None = Field(None, description="Ngành")
    market_cap: float | None = Field(None, description="Vốn hóa thị trường")
    pe_ratio: float | None = Field(None, description="P/E")
    pb_ratio: float | None = Field(None, description="P/B")
    roe: float | None = Field(None, description="ROE (%)")
    eps: float | None = Field(None, description="EPS")
    dividend_yield: float | None = Field(None, description="Tỷ suất cổ tức (%)")


class PaginatedResponse(BaseModel):
    items: list = Field(default_factory=list)
    total: int = Field(0, description="Tổng số kết quả")
    page: int = Field(1, description="Trang hiện tại")
    page_size: int = Field(20, description="Số kết quả mỗi trang")
