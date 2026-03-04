from app.repositories.stock_repository import StockRepository
from app.schemas.dividend import (
    DividendFilterRequest,
    DividendFilterResponse,
    DividendResultItem,
)


class DividendService:
    """Dividend screening business logic.

    Filters stocks by dividend yield, payout ratio,
    payment frequency, and dividend growth trend.
    """

    def __init__(self) -> None:
        self._repo = StockRepository()

    def run_filter(self, request: DividendFilterRequest) -> DividendFilterResponse:
        """Apply dividend criteria and return filtered results.

        TODO: Implement real filtering logic once Supabase tables are populated.
        Currently returns an empty result set.
        """
        return DividendFilterResponse(
            items=[],
            total=0,
            page=request.page,
            page_size=request.page_size,
        )
