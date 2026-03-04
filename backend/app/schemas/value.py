from pydantic import BaseModel, Field


class GrahamFilterRequest(BaseModel):
    date: str = Field(
        ...,
        description="Ngày lấy danh mục (YYYY-MM-DD). Engine sẽ lấy giá close và EPS/BVPS theo năm tương ứng.",
        examples=["2024-12-31"],
    )
    pe_max: float | None = Field(
        15.0,
        description="Ngưỡng P/E tối đa (Graham khuyến nghị ≤ 15)",
    )
    pb_max: float | None = Field(
        1.5,
        description="Ngưỡng P/B tối đa (Graham khuyến nghị ≤ 1.5)",
    )
    pe_x_pb_max: float | None = Field(
        22.5,
        description="P/E × P/B ≤ 22.5 (tiêu chí phối hợp của Graham)",
    )
    margin_of_safety_min: float | None = Field(
        0.0,
        ge=-1.0,
        le=1.0,
        description="Biên an toàn tối thiểu (0.0 = không lỗ, 0.3 = 30% an toàn)",
    )
    eps_positive: bool = Field(
        True,
        description="Chỉ lọc cổ phiếu có EPS > 0",
    )
    sort_by: str = Field(
        "margin_of_safety",
        description="Sắp xếp theo: margin_of_safety | pe | pb | graham_number",
    )
    sort_order: str = Field(
        "desc",
        description="Thứ tự sắp xếp: asc | desc",
    )
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


class GrahamResultItem(BaseModel):
    symbol: str
    gics_industry: str | None = None
    date: str
    close_price: float
    eps: float
    bvps: float
    pe: float | None = None
    pb: float | None = None
    graham_number: float | None = Field(None, description="V = √(22.5 × EPS × BVPS)")
    margin_of_safety: float | None = Field(None, description="(V - Price) / V")


class GrahamFilterResponse(BaseModel):
    items: list[GrahamResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
    filter_date: str = ""
