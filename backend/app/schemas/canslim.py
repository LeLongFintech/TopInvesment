from pydantic import BaseModel, Field


class CanslimFilterRequest(BaseModel):
    current_earnings: bool = Field(
        True,
        description="C — EPS quý hiện tại tăng > 20% so với cùng kỳ năm trước",
    )
    annual_earnings: bool = Field(
        True,
        description="A — Tăng trưởng EPS 3 năm > 25%",
    )
    new_highs: bool = Field(
        False,
        description="N — Cổ phiếu đang phá vỡ vùng tích lũy / tạo đỉnh mới",
    )
    rs_rating_min: int = Field(
        80,
        ge=1,
        le=99,
        description="S — Relative Strength Rating tối thiểu (1-99)",
    )
    leader_vs_laggard: bool = Field(
        True,
        description="L — Nhóm ngành nằm trong Top 20%",
    )
    institutional_sponsorship: bool = Field(
        True,
        description="I — Tỷ lệ sở hữu quỹ đang tăng",
    )
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


class CanslimResultItem(BaseModel):
    symbol: str
    company_name: str
    price: float
    change_percent: float
    rs_rating: int = Field(0, description="RS Rating (1-99)")
    volume: int = 0
    canslim_score: int = Field(
        0,
        description="Số tiêu chí CANSLIM đạt được (0-7)",
    )


class CanslimFilterResponse(BaseModel):
    items: list[CanslimResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
