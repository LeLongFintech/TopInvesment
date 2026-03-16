from fastapi import APIRouter, Query

from app.schemas.value import GrahamFilterRequest, GrahamFilterResponse, StockDetailResponse, GrahamChartDetailResponse
from app.services.value_service import ValueService

router = APIRouter(prefix="/filters", tags=["Benjamin Graham Filter"])

service = ValueService()


@router.post("/value", response_model=GrahamFilterResponse)
async def run_graham_filter(request: GrahamFilterRequest):
    """Apply Benjamin Graham screening criteria and return matching stocks."""
    return service.run_filter(request)


@router.get("/value/stock/{symbol}", response_model=StockDetailResponse)
async def get_stock_detail(symbol: str, years: int = 5):
    """Get historical Graham metrics for a specific stock (for detail charts)."""
    return service.get_stock_history(symbol, years)


@router.get("/value/stock/{symbol}/charts", response_model=GrahamChartDetailResponse)
async def get_graham_chart_detail(
    symbol: str,
    date: str = Query(..., description="Filter date (YYYY-MM-DD)"),
):
    """Data for 5 new Graham charts: radar, bullet, waterfall, EPS history, PE histogram."""
    return service.get_chart_detail(symbol, date)

