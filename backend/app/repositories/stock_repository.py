from supabase import Client

from app.repositories.supabase_client import get_supabase_client


class StockRepository:
    """Pure data-access layer — all Supabase queries live here."""

    def __init__(self) -> None:
        self._client: Client = get_supabase_client()

    # ── Stock master data ──────────────────────────────────────
    def get_all_stocks(self, page: int = 1, page_size: int = 20) -> dict:
        offset = (page - 1) * page_size
        response = (
            self._client.table("stocks")
            .select("*", count="exact")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        return {"data": response.data, "count": response.count}

    def get_stock_by_symbol(self, symbol: str) -> dict | None:
        response = (
            self._client.table("stocks")
            .select("*")
            .eq("symbol", symbol.upper())
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None

    # ── Financial data ─────────────────────────────────────────
    def get_financial_data(self, symbol: str) -> list[dict]:
        response = (
            self._client.table("financial_data")
            .select("*")
            .eq("symbol", symbol.upper())
            .order("date", desc=True)
            .execute()
        )
        return response.data

    def get_all_financial_data(self) -> list[dict]:
        response = (
            self._client.table("financial_data")
            .select("*")
            .execute()
        )
        return response.data

    # ── Price data ─────────────────────────────────────────────
    def get_price_data(self, symbol: str, limit: int = 252) -> list[dict]:
        response = (
            self._client.table("price_data")
            .select("*")
            .eq("symbol", symbol.upper())
            .order("date", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data

    # ── Dividend data ──────────────────────────────────────────
    def get_dividend_data(self, symbol: str) -> list[dict]:
        response = (
            self._client.table("dividend_data")
            .select("*")
            .eq("symbol", symbol.upper())
            .order("date", desc=True)
            .execute()
        )
        return response.data

    def get_all_dividend_data(self) -> list[dict]:
        response = (
            self._client.table("dividend_data")
            .select("*")
            .execute()
        )
        return response.data
