from fastapi import APIRouter, HTTPException

from app.repositories.stock_repository import StockRepository
from app.schemas.stock import PaginatedResponse, StockDetail

router = APIRouter(prefix="/stocks", tags=["Stocks"])


@router.get("", response_model=PaginatedResponse)
async def list_stocks(page: int = 1, page_size: int = 20):
    """Return a paginated list of all stocks."""
    repo = StockRepository()
    result = repo.get_all_stocks(page=page, page_size=page_size)
    return PaginatedResponse(
        items=result["data"],
        total=result["count"] or 0,
        page=page,
        page_size=page_size,
    )


@router.get("/{symbol}", response_model=StockDetail)
async def get_stock_detail(symbol: str):
    """Return detailed information for a single stock."""
    repo = StockRepository()
    stock = repo.get_stock_by_symbol(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock '{symbol}' not found")
    return stock
