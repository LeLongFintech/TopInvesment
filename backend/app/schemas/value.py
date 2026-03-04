from pydantic import BaseModel, Field


class GrahamFilterRequest(BaseModel):
    date: str = Field(
        ...,
        description="Ngày lấy danh mục (YYYY-MM-DD). Engine sẽ lấy giá close và EPS/BVPS theo năm tương ứng.",
        examples=["2024-12-31"],
    )
    eps_consecutive_years: int = Field(
        10,
        ge=1,
        le=25,
        description="EPS > 0 liên tục bao nhiêu năm (tính ngược từ ngày chọn, nếu không đủ thì lấy tối đa có)",
    )
    pe_max: float | None = Field(
        15.0,
        description="Ngưỡng P/E tối đa (Graham khuyến nghị ≤ 15)",
    )
    pb_max: float | None = Field(
        1.5,
        description="Ngưỡng P/B tối đa (Graham khuyến nghị ≤ 1.5)",
    )
    graham_gt_price: bool = Field(
        True,
        description="Graham Number phải lớn hơn giá hiện tại",
    )
    margin_of_safety_min: float = Field(
        0.20,
        ge=-1.0,
        le=1.0,
        description="Biên an toàn tối thiểu (0.20 = 20%)",
    )
    sort_by: str = Field(
        "margin_of_safety",
        description="Sắp xếp theo: margin_of_safety | pe | pb | graham_number | eps",
    )
    sort_order: str = Field(
        "desc",
        description="Thứ tự sắp xếp: asc | desc",
    )
    page: int = Field(1, ge=1)
    page_size: int = Field(50, ge=1, le=200)


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
    eps_positive_years: int = Field(0, description="Số năm EPS > 0 liên tục (ngược về quá khứ)")


class GrahamFilterResponse(BaseModel):
    items: list[GrahamResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 50
    filter_date: str = ""
