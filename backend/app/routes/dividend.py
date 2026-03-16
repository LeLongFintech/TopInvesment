from fastapi import APIRouter

from app.schemas.dividend import DividendFilterRequest, DividendFilterResponse, DividendChartDetailResponse
from app.services.dividend_service import DividendService

router = APIRouter(prefix="/filters", tags=["Dividend Filter"])

service = DividendService()


@router.post("/dividend", response_model=DividendFilterResponse)
async def run_dividend_filter(request: DividendFilterRequest):
    """Apply dividend screening criteria and return matching stocks."""
    return service.run_filter(request)


@router.get("/dividend/stock/{symbol}", response_model=DividendChartDetailResponse)
async def get_dividend_chart_detail(symbol: str):
    """Yearly DPS, yield, DCR for a single stock — powers 2 dividend charts."""
    return service.get_chart_detail(symbol)
