from fastapi import APIRouter, Query

from app.schemas.canslim import CanslimFilterRequest, CanslimFilterResponse
from app.schemas.canslim_detail import CanslimStockDetailResponse
from app.services.canslim_service import CanslimService
from app.services.canslim_detail_service import CanslimDetailService

router = APIRouter(prefix="/filters", tags=["CANSLIM Filter"])

service = CanslimService()
detail_service = CanslimDetailService()


@router.post("/canslim", response_model=CanslimFilterResponse)
async def run_canslim_filter(request: CanslimFilterRequest):
    """Apply CANSLIM 2-layer screening and return ranked results."""
    return service.run_filter(request)


@router.get("/canslim/stock/{symbol}", response_model=CanslimStockDetailResponse)
async def get_canslim_stock_detail(
    symbol: str,
    years: int = Query(1, ge=1, le=5, description="Number of years of daily data"),
):
    """Return historical data for a single stock — powers 7 CANSLIM charts."""
    return detail_service.get_stock_detail(symbol, years)

