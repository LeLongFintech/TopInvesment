from app.repositories.stock_repository import StockRepository
from app.schemas.value import (
    ValueFilterRequest,
    ValueFilterResponse,
    ValueResultItem,
)


class ValueService:
    """Value Investing screening business logic.

    Screens stocks by fundamental metrics: P/E, ROE,
    Margin of Safety, P/B, and market capitalisation.
    """

    def __init__(self) -> None:
        self._repo = StockRepository()

    def run_filter(self, request: ValueFilterRequest) -> ValueFilterResponse:
        """Apply value-investing criteria and return filtered results.

        TODO: Implement real filtering logic once Supabase tables are populated.
        Currently returns an empty result set.
        """
        return ValueFilterResponse(
            items=[],
            total=0,
            page=request.page,
            page_size=request.page_size,
        )
