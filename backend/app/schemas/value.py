from pydantic import BaseModel, Field


class ValueFilterRequest(BaseModel):
    pe_max: float = Field(
        15.0,
        description="Ngưỡng P/E tối đa",
    )
    roe_min: float = Field(
        15.0,
        description="ROE tối thiểu (%)",
    )
    margin_of_safety_min: float = Field(
        20.0,
        ge=0,
        le=100,
        description="Biên an toàn tối thiểu (%)",
    )
    pb_max: float | None = Field(
        None,
        description="Ngưỡng P/B tối đa (tùy chọn)",
    )
    market_cap_min: float | None = Field(
        None,
        description="Vốn hóa tối thiểu (tỷ VNĐ, tùy chọn)",
    )
    industry: str | None = Field(
        None,
        description="Lọc theo ngành (tùy chọn)",
    )
    sort_by: str = Field(
        "margin_of_safety",
        description="Tiêu chí sắp xếp: margin_of_safety | pe | roe | market_cap",
    )
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


class ValueResultItem(BaseModel):
    symbol: str
    company_name: str
    price: float
    intrinsic_value: float = Field(0.0, description="Giá trị nội tại")
    margin_of_safety: float = Field(0.0, description="Biên an toàn (%)")
    pe: float | None = None
    roe: float | None = None


class ValueFilterResponse(BaseModel):
    items: list[ValueResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
