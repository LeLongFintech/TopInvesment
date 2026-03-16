from pydantic import BaseModel, Field


class QuarterlyEpsPoint(BaseModel):
    quarter: str = Field(..., description="Quarter label, e.g. '2024-Q3'")
    eps: float | None
    revenue_growth: float | None = Field(None, description="YoY revenue growth %")


class AnnualGrowthPoint(BaseModel):
    year: int
    eps_growth: float | None = Field(None, description="EPS annual growth %")
    revenue: float | None
    net_income: float | None
    roe: float | None


class DailyPoint(BaseModel):
    date: str
    close_price: float
    high_price: float | None
    low_price: float | None
    volume: float | None
    rs_score: float | None


class CanslimStockDetailResponse(BaseModel):
    symbol: str
    gics_industry: str | None = None

    # Chart 1 (C): Quarterly EPS + Revenue growth
    quarterly_eps: list[QuarterlyEpsPoint] = []

    # Chart 2 (A): Annual EPS growth
    annual_growth: list[AnnualGrowthPoint] = []

    # Chart 3 (A): Current ROE
    current_roe: float | None = None

    # Charts 4-6 (N, S, L): Daily time series
    daily: list[DailyPoint] = []
