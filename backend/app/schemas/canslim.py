from pydantic import BaseModel, Field


class CanslimFilterRequest(BaseModel):
    date: str = Field(
        ...,
        description="Ngày tham chiếu (YYYY-MM-DD). Engine lấy canslim_metrics cho ngày này.",
        examples=["2024-12-31"],
    )

    # ── Lớp 1: Hard filter thresholds ──────────────────────────
    delta_eps_min: float = Field(
        20.0,
        description="Delta EPS quý tối thiểu (%). CANSLIM khuyến nghị ≥ 20, ưu tiên ≥ 25.",
    )
    delta_sales_min: float = Field(
        25.0,
        description="Tăng trưởng doanh thu tối thiểu (%)",
    )
    roe_min: float = Field(
        0.17,
        description="ROE tối thiểu (0.17 = 17%)",
    )

    # ── Lớp 2: Percentile ranking thresholds ───────────────────
    rs_rating_min: int = Field(
        80,
        ge=1,
        le=99,
        description="RS Rating tối thiểu (1–99). Chỉ lấy cổ phiếu nằm top.",
    )

    # ── Pagination & sorting ───────────────────────────────────
    sort_by: str = Field(
        "cr_score",
        description="Sắp xếp theo: cr_score | rs_rating | eps_rating | smr_rating | ad_rating",
    )
    sort_order: str = Field("desc", description="asc | desc")
    page: int = Field(1, ge=1)
    page_size: int = Field(50, ge=1, le=200)


class CanslimResultItem(BaseModel):
    symbol: str
    gics_industry: str | None = None
    date: str
    close_price: float

    # ── Raw metrics (from canslim_metrics) ─────────────────────
    delta_eps_quarterly: float | None = None
    delta_sales: float | None = None
    net_profit_margin: float | None = None
    roe: float | None = None
    sgr: float | None = None
    rs_score: float | None = None
    raw_eps: float | None = None
    raw_ad: float | None = None
    delta_vol: float | None = None

    # ── Ratings (1..99, percentile ranked) ─────────────────────
    rs_rating: int = Field(0, description="RS Rating (1–99)")
    eps_rating: int = Field(0, description="EPS Rating (1–99)")
    smr_rating: int = Field(0, description="SMR Rating (1–99)")
    ad_rating: int = Field(0, description="A/D Rating (1–99)")

    # ── Composite score ────────────────────────────────────────
    cr_score: float = Field(
        0.0,
        description="CR = rs×0.35 + eps×0.35 + smr×0.2 + ad×0.1",
    )


class CanslimFilterResponse(BaseModel):
    items: list[CanslimResultItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 50
    filter_date: str = ""
    layer1_count: int = Field(
        0, description="Số CP qua Lớp 1 (hard filter)"
    )
    layer2_count: int = Field(
        0, description="Số CP qua Lớp 2 (RS Rating ≥ threshold)"
    )
