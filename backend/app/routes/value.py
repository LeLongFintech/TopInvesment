from fastapi import APIRouter

from app.schemas.value import GrahamFilterRequest, GrahamFilterResponse
from app.services.value_service import ValueService

router = APIRouter(prefix="/filters", tags=["Benjamin Graham Filter"])


@router.post("/value", response_model=GrahamFilterResponse)
async def run_graham_filter(request: GrahamFilterRequest):
    """Apply Benjamin Graham screening criteria and return matching stocks."""
    service = ValueService()
    return service.run_filter(request)
