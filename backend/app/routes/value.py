from fastapi import APIRouter

from app.schemas.value import ValueFilterRequest, ValueFilterResponse
from app.services.value_service import ValueService

router = APIRouter(prefix="/filters", tags=["Value Investing Filter"])


@router.post("/value", response_model=ValueFilterResponse)
async def run_value_filter(request: ValueFilterRequest):
    """Apply value-investing screening criteria and return matching stocks."""
    service = ValueService()
    return service.run_filter(request)
