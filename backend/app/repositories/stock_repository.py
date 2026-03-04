from sqlalchemy import text

from app.repositories.database import get_session


class StockRepository:
    """Pure data-access layer — all PostgreSQL queries live here."""

    # ── Stock master data ──────────────────────────────────────
    def get_all_stocks(self, page: int = 1, page_size: int = 20) -> dict:
        offset = (page - 1) * page_size
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT symbol, ipo_date, gics_industry
                    FROM stocks
                    ORDER BY symbol
                    LIMIT :limit OFFSET :offset
                """),
                {"limit": page_size, "offset": offset},
            ).mappings().all()

            count = session.execute(
                text("SELECT COUNT(*) AS cnt FROM stocks")
            ).scalar()

        return {"data": [dict(r) for r in rows], "count": count}

    def get_stock_by_symbol(self, symbol: str) -> dict | None:
        with get_session() as session:
            row = session.execute(
                text("SELECT * FROM stocks WHERE symbol = :symbol LIMIT 1"),
                {"symbol": symbol.upper()},
            ).mappings().first()
        return dict(row) if row else None

    # ── Financial statements ───────────────────────────────────
    def get_balance_sheet(self, symbol: str) -> list[dict]:
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT * FROM balance_sheet
                    WHERE symbol = :symbol
                    ORDER BY date DESC
                """),
                {"symbol": symbol.upper()},
            ).mappings().all()
        return [dict(r) for r in rows]

    def get_income_statement(self, symbol: str) -> list[dict]:
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT * FROM income_statement
                    WHERE symbol = :symbol
                    ORDER BY date DESC
                """),
                {"symbol": symbol.upper()},
            ).mappings().all()
        return [dict(r) for r in rows]

    def get_cash_flow(self, symbol: str) -> list[dict]:
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT * FROM cash_flow
                    WHERE symbol = :symbol
                    ORDER BY date DESC
                """),
                {"symbol": symbol.upper()},
            ).mappings().all()
        return [dict(r) for r in rows]

    def get_eps_quarterly(self, symbol: str) -> list[dict]:
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT * FROM eps_quarterly
                    WHERE symbol = :symbol
                    ORDER BY date DESC
                """),
                {"symbol": symbol.upper()},
            ).mappings().all()
        return [dict(r) for r in rows]

    # ── Market data (price + volume) ───────────────────────────
    def get_market_data(self, symbol: str, limit: int = 252) -> list[dict]:
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT * FROM market_data
                    WHERE symbol = :symbol
                    ORDER BY date DESC
                    LIMIT :limit
                """),
                {"symbol": symbol.upper(), "limit": limit},
            ).mappings().all()
        return [dict(r) for r in rows]

    # ── Bulk queries for filters ───────────────────────────────
    def query_for_canslim(self) -> list[dict]:
        """Get data needed for CANSLIM screening across all stocks."""
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT
                        s.symbol,
                        s.gics_industry,
                        eq.date,
                        eq.eps,
                        eq.net_income_after_tax,
                        eq.common_shares_outstanding_total
                    FROM stocks s
                    LEFT JOIN eps_quarterly eq ON s.symbol = eq.symbol
                    ORDER BY s.symbol, eq.date DESC
                """)
            ).mappings().all()
        return [dict(r) for r in rows]

    def query_for_value(self) -> list[dict]:
        """Get data needed for Value Investing screening."""
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT
                        s.symbol,
                        s.gics_industry,
                        bs.date,
                        bs.total_assets,
                        bs.total_shareholders_equity_incl_minority_interest,
                        inc.net_income_after_tax,
                        inc.revenue_from_business_activities_total,
                        inc.gross_profit_industrials_property_total
                    FROM stocks s
                    LEFT JOIN balance_sheet bs ON s.symbol = bs.symbol
                    LEFT JOIN income_statement inc
                        ON s.symbol = inc.symbol AND bs.date = inc.date
                    ORDER BY s.symbol, bs.date DESC
                """)
            ).mappings().all()
        return [dict(r) for r in rows]

    def query_for_dividend(self) -> list[dict]:
        """Get data needed for Dividend screening."""
        with get_session() as session:
            rows = session.execute(
                text("""
                    SELECT
                        s.symbol,
                        s.gics_industry,
                        cf.date,
                        cf.dividends_paid_cash_total_cash_flow,
                        cf.dividends_common_cash_paid,
                        inc.net_income_after_tax
                    FROM stocks s
                    LEFT JOIN cash_flow cf ON s.symbol = cf.symbol
                    LEFT JOIN income_statement inc
                        ON s.symbol = inc.symbol AND cf.date = inc.date
                    ORDER BY s.symbol, cf.date DESC
                """)
            ).mappings().all()
        return [dict(r) for r in rows]

    def get_latest_price(self, symbol: str) -> dict | None:
        with get_session() as session:
            row = session.execute(
                text("""
                    SELECT * FROM market_data
                    WHERE symbol = :symbol
                    ORDER BY date DESC
                    LIMIT 1
                """),
                {"symbol": symbol.upper()},
            ).mappings().first()
        return dict(row) if row else None
