from fastapi import APIRouter

from app.schemas.canslim import CanslimFilterRequest, CanslimFilterResponse
from app.services.canslim_service import CanslimService

router = APIRouter(prefix="/filters", tags=["CANSLIM Filter"])

service = CanslimService()


@router.post("/canslim", response_model=CanslimFilterResponse)
async def run_canslim_filter(request: CanslimFilterRequest):
    """Apply CANSLIM 2-layer screening and return ranked results."""
    return service.run_filter(request)
