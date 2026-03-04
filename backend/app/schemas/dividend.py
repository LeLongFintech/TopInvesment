from enum import Enum

from pydantic import BaseModel, Field


class DividendFrequency(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    SEMI_ANNUAL = "semi_annual"
    ANNUAL = "annual"


class DividendTrend(str, Enum):
    UP = "up"
    DOWN = "down"
    STABLE = "stable"


class DividendFilterRequest(BaseModel):
    min_yield: float = Field(
        5.0,
        ge=0,
        description="Tỷ suất cổ tức tối thiểu (%)",
    )
    max_payout_ratio: float | None = Field(
        None,
        ge=0,
        le=100,
        description="Ngưỡng payout ratio tối đa (%)",
    )
    frequency: DividendFrequency | None = Field(
        None,
        description="Tần suất trả cổ tức",
    )
    is_aristocrat: bool = Field(
        False,
        description="Chỉ lọc Dividend Aristocrats (tăng cổ tức liên tục ≥ 5 năm)",
    )
    search: str | None = Field(
        None,
        description="Tìm kiếm theo mã hoặc tên công ty",
    )
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


class DividendResultItem(BaseModel):
    symbol: str
    company_name: str
    industry: str | None = None
    price: float
    change_percent: float = 0.0
    dividend_yield: float = Field(0.0, description="Tỷ suất cổ tức (%)")
    payout_ratio: float = Field(0.0, description="Payout Ratio (%)")
    frequency: DividendFrequency | None = None
    trend: DividendTrend = DividendTrend.STABLE


class DividendFilterResponse(BaseModel):
    items: list[DividendResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
