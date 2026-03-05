from fastapi import APIRouter

from app.schemas.dividend import DividendFilterRequest, DividendFilterResponse
from app.services.dividend_service import DividendService

router = APIRouter(prefix="/filters", tags=["Dividend Filter"])

service = DividendService()


@router.post("/dividend", response_model=DividendFilterResponse)
async def run_dividend_filter(request: DividendFilterRequest):
    """Apply dividend screening criteria and return matching stocks."""
    return service.run_filter(request)
