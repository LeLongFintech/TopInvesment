from fastapi import APIRouter

from app.schemas.value import GrahamFilterRequest, GrahamFilterResponse, StockDetailResponse
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
