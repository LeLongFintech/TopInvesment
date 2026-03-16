"""
CANSLIM Stock Detail Service
=============================
Provides historical data for a single stock to power 7 analysis charts.
"""

import pandas as pd
from sqlalchemy import text

from app.repositories.database import get_session
from app.schemas.canslim_detail import (
    AnnualGrowthPoint,
    CanslimStockDetailResponse,
    DailyPoint,
    QuarterlyEpsPoint,
)


class CanslimDetailService:

    def get_stock_detail(self, symbol: str, years: int = 1) -> CanslimStockDetailResponse:
        with get_session() as session:
            # ── Industry lookup ─────────────────────────────────
            ind_row = session.execute(
                text("SELECT gics_industry FROM stocks WHERE symbol = :s"),
                {"s": symbol},
            ).mappings().first()
            gics_industry = ind_row["gics_industry"] if ind_row else None

            # ── Chart 1: Quarterly EPS + Revenue growth ─────────
            quarterly_eps = self._quarterly_eps(session, symbol)

            # ── Chart 2: Annual growth ──────────────────────────
            annual_growth = self._annual_growth(session, symbol)

            # ── Chart 3: Current ROE ────────────────────────────
            current_roe = self._current_roe(session, symbol)

            # ── Charts 4-6: Daily time series ───────────────────
            daily = self._daily_series(session, symbol, years)

        return CanslimStockDetailResponse(
            symbol=symbol,
            gics_industry=gics_industry,
            quarterly_eps=quarterly_eps,
            annual_growth=annual_growth,
            current_roe=current_roe,
            daily=daily,
        )

    # ── Private helpers ─────────────────────────────────────────

    def _quarterly_eps(self, session, symbol: str) -> list[QuarterlyEpsPoint]:
        """Query eps_quarterly for the stock, compute revenue_growth from income_statement."""
        rows = session.execute(
            text("""
                SELECT date, eps
                FROM eps_quarterly
                WHERE symbol = :s
                ORDER BY date
            """),
            {"s": symbol},
        ).mappings().all()

        if not rows:
            return []

        # Revenue from income_statement (annual) for YoY growth
        rev_rows = session.execute(
            text("""
                SELECT date, revenue_from_business_activities_total AS revenue
                FROM income_statement
                WHERE symbol = :s
                ORDER BY date
            """),
            {"s": symbol},
        ).mappings().all()

        rev_by_year: dict[int, float] = {}
        for r in rev_rows:
            yr = pd.Timestamp(r["date"]).year
            if r["revenue"] is not None:
                rev_by_year[yr] = float(r["revenue"])

        result = []
        for r in rows:
            dt = pd.Timestamp(r["date"])
            q_label = f"{dt.year}-Q{(dt.month - 1) // 3 + 1}"
            yr = dt.year
            rev_growth = None
            if yr in rev_by_year and (yr - 1) in rev_by_year and rev_by_year[yr - 1] != 0:
                rev_growth = round(
                    (rev_by_year[yr] - rev_by_year[yr - 1]) / abs(rev_by_year[yr - 1]) * 100, 2
                )
            result.append(QuarterlyEpsPoint(
                quarter=q_label,
                eps=round(float(r["eps"]), 4) if r["eps"] is not None else None,
                revenue_growth=rev_growth,
            ))
        return result

    def _annual_growth(self, session, symbol: str) -> list[AnnualGrowthPoint]:
        """Annual EPS growth, revenue, net_income, ROE."""
        rows = session.execute(
            text("""
                SELECT
                    i.date,
                    i.revenue_from_business_activities_total AS revenue,
                    i.net_income_after_tax AS net_income,
                    i.eps_basic_excl_extraordinary_items_common_total AS eps_annual,
                    b.common_equity_total AS equity
                FROM income_statement i
                LEFT JOIN balance_sheet b ON i.symbol = b.symbol AND i.date = b.date
                WHERE i.symbol = :s
                ORDER BY i.date
            """),
            {"s": symbol},
        ).mappings().all()

        if not rows:
            return []

        data = []
        prev_eps = None
        for r in rows:
            yr = pd.Timestamp(r["date"]).year
            eps = float(r["eps_annual"]) if r["eps_annual"] is not None else None
            eps_growth = None
            if eps is not None and prev_eps is not None and prev_eps != 0:
                eps_growth = round((eps - prev_eps) / abs(prev_eps) * 100, 2)
            prev_eps = eps

            roe = None
            if r["net_income"] is not None and r["equity"] is not None and float(r["equity"]) != 0:
                roe = round(float(r["net_income"]) / float(r["equity"]), 4)

            data.append(AnnualGrowthPoint(
                year=yr,
                eps_growth=eps_growth,
                revenue=round(float(r["revenue"]), 2) if r["revenue"] is not None else None,
                net_income=round(float(r["net_income"]), 2) if r["net_income"] is not None else None,
                roe=roe,
            ))
        return data

    def _current_roe(self, session, symbol: str) -> float | None:
        """Latest ROE from canslim_metrics."""
        row = session.execute(
            text("""
                SELECT roe FROM canslim_metrics
                WHERE symbol = :s AND roe IS NOT NULL
                ORDER BY date DESC LIMIT 1
            """),
            {"s": symbol},
        ).mappings().first()
        return round(float(row["roe"]), 4) if row else None

    def _daily_series(self, session, symbol: str, years: int) -> list[DailyPoint]:
        """Daily price/volume/RS for the last N years."""
        rows = session.execute(
            text("""
                SELECT
                    md.date,
                    md.close_price,
                    md.high_price,
                    md.low_price,
                    md.volume,
                    cm.rs_score
                FROM market_data md
                LEFT JOIN canslim_metrics cm
                    ON md.symbol = cm.symbol AND md.date = cm.date
                WHERE md.symbol = :s
                  AND md.date >= (CURRENT_DATE - INTERVAL ':y years')
                ORDER BY md.date
            """.replace(":y", str(int(years)))),
            {"s": symbol},
        ).mappings().all()

        return [
            DailyPoint(
                date=str(r["date"]),
                close_price=round(float(r["close_price"]), 2) if r["close_price"] is not None else 0,
                high_price=round(float(r["high_price"]), 2) if r["high_price"] is not None else None,
                low_price=round(float(r["low_price"]), 2) if r["low_price"] is not None else None,
                volume=float(r["volume"]) if r["volume"] is not None else None,
                rs_score=round(float(r["rs_score"]), 4) if r["rs_score"] is not None else None,
            )
            for r in rows
        ]
