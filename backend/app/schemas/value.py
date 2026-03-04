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
    de_max: float | None = Field(
        1.0,
        description="D/E tối đa (Graham khuyến nghị < 1)",
    )
    cr_min: float | None = Field(
        2.0,
        description="Current Ratio tối thiểu (Graham khuyến nghị > 2)",
    )
    div_yield_min: float | None = Field(
        0.05,
        description="Lợi suất cổ tức tối thiểu (0.05 = 5%)",
    )
    sort_by: str = Field(
        "margin_of_safety",
        description="Sắp xếp theo: margin_of_safety | pe | pb | graham_number | eps | de_ratio | current_ratio | dividend_yield",
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
    de_ratio: float | None = Field(None, description="Nợ / Vốn chủ sở hữu")
    current_ratio: float | None = Field(None, description="Tỷ số thanh toán hiện hành")
    dividend_yield: float | None = Field(None, description="Lợi suất cổ tức")
    payout_ratio: float | None = Field(None, description="Tỷ lệ chi trả cổ tức")


# ── Chart data models ──────────────────────────────────────────

class ScatterPoint(BaseModel):
    """Scatter Plot: P/E (X) vs Margin of Safety (Y)."""
    symbol: str
    pe: float
    margin_of_safety: float


class BubblePoint(BaseModel):
    """Bubble Chart: P/E (X) vs P/B (Y), size = Graham Number."""
    symbol: str
    pe: float
    pb: float
    graham_number: float


class SectorSlice(BaseModel):
    """Donut Chart: sector allocation."""
    industry: str
    count: int
    percentage: float


class TreemapItem(BaseModel):
    """Treemap: industry valuation heatmap."""
    symbol: str
    industry: str
    close_price: float
    pe: float


class ShieldItem(BaseModel):
    """Shield Bar: CR + D/E for top stocks."""
    symbol: str
    current_ratio: float
    de_ratio: float


class GrahamFilterResponse(BaseModel):
    items: list[GrahamResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 50
    filter_date: str = ""

    # Chart data (computed from ALL filtered results, not just current page)
    chart_scatter: list[ScatterPoint] = Field(default_factory=list)
    chart_bubble: list[BubblePoint] = Field(default_factory=list)
    chart_sectors: list[SectorSlice] = Field(default_factory=list)
    chart_treemap: list[TreemapItem] = Field(default_factory=list)
    chart_shield: list[ShieldItem] = Field(default_factory=list)


# ── Stock detail (drill-down) ──────────────────────────────

class StockHistoryPoint(BaseModel):
    date: str
    close_price: float
    graham_number: float | None = None
    pe: float | None = None
    pb: float | None = None
    margin_of_safety: float | None = None
    de_ratio: float | None = None
    current_ratio: float | None = None


class StockDetailResponse(BaseModel):
    symbol: str
    gics_industry: str | None = None
    history: list[StockHistoryPoint] = Field(default_factory=list)

