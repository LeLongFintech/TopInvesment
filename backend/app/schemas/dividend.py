from typing import Literal

from pydantic import BaseModel, Field


class DividendFilterRequest(BaseModel):
    consecutive_years: Literal[3, 4, 5] = Field(
        5,
        description="Số năm liên tục trả cổ tức (tham chiếu ngược từ 2025)",
    )
    dividend_yield_min: float = Field(
        0.05,
        ge=0,
        le=1.0,
        description="Ngưỡng tỷ suất cổ tức trung bình tối thiểu (0.05 = 5%)",
    )
    coverage_ratio_min: float = Field(
        1.5,
        ge=0,
        description="Ngưỡng hệ số bao phủ cổ tức trung bình tối thiểu",
    )
    sort_by: str = Field(
        "avg_coverage_ratio",
        description="Sắp xếp theo: avg_coverage_ratio | avg_dividend_yield | latest_dps",
    )
    sort_order: str = Field(
        "desc",
        description="Thứ tự sắp xếp: asc | desc",
    )
    page: int = Field(1, ge=1)
    page_size: int = Field(50, ge=1, le=200)


class DividendResultItem(BaseModel):
    rank: int = Field(..., description="Xếp hạng theo AVG DCR (1 = cao nhất)")
    symbol: str
    gics_industry: str | None = None
    avg_close_price: float = Field(..., description="Giá đóng cửa TB năm cuối")
    avg_dividend_yield: float = Field(..., description="Tỷ suất cổ tức TB qua N năm")
    avg_coverage_ratio: float = Field(..., description="Hệ số bao phủ TB qua N năm")
    latest_dps: float = Field(..., description="Cổ tức/cổ phiếu năm gần nhất")
    consecutive_dividend_years: int = Field(
        ..., description="Số năm trả cổ tức liên tục thực tế"
    )


class DividendFilterResponse(BaseModel):
    items: list[DividendResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 50
    reference_year: int = Field(2025, description="Năm tham chiếu")
    years_analyzed: int = Field(5, description="Số năm phân tích")
