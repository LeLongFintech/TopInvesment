from fastapi import APIRouter

from app.schemas.canslim import CanslimFilterRequest, CanslimFilterResponse
from app.services.canslim_service import CanslimService

router = APIRouter(prefix="/filters", tags=["CANSLIM Filter"])


@router.post("/canslim", response_model=CanslimFilterResponse)
async def run_canslim_filter(request: CanslimFilterRequest):
    """Apply CANSLIM screening criteria and return matching stocks."""
    service = CanslimService()
    return service.run_filter(request)
