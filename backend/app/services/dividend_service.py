from sqlalchemy import text

from app.repositories.database import get_session
from app.schemas.dividend import (
    DividendFilterRequest,
    DividendFilterResponse,
    DividendResultItem,
)

REFERENCE_YEAR = 2025


class DividendService:
    """Dividend screening — 4-step filter using pre-computed dividend_metrics.

    Step 1: Check consecutive dividend payment (N years from 2025)
    Step 2: AVG(dividend_yield) over N years >= threshold
    Step 3: AVG(coverage_ratio) over N years >= threshold
    Step 4: Rank by AVG coverage_ratio DESC
    """

    def _count_consecutive_dividend_years(
        self, session, symbol: str
    ) -> int:
        """Count consecutive years with dividends paid, backwards from REFERENCE_YEAR."""
        rows = session.execute(
            text("""
                SELECT year, dividend_coverage_ratio
                FROM dividend_metrics
                WHERE symbol = :symbol
                  AND year <= :ref_year
                ORDER BY year DESC
            """),
            {"symbol": symbol, "ref_year": REFERENCE_YEAR},
        ).mappings().all()

        consecutive = 0
        for row in rows:
            if row["dividend_coverage_ratio"] is not None:
                consecutive += 1
            else:
                break
        return consecutive

    def run_filter(self, request: DividendFilterRequest) -> DividendFilterResponse:
        start_year = REFERENCE_YEAR - request.consecutive_years + 1

        with get_session() as session:
            # ── Steps 1-3: Aggregate + filter in one query ─────
            candidates = session.execute(
                text("""
                    SELECT
                        dm.symbol,
                        s.gics_industry,
                        AVG(dm.dividend_yield)          AS avg_dividend_yield,
                        AVG(dm.dividend_coverage_ratio) AS avg_coverage_ratio,
                        COUNT(*)                        AS years_with_data
                    FROM dividend_metrics dm
                    LEFT JOIN stocks s ON dm.symbol = s.symbol
                    WHERE dm.year BETWEEN :start_year AND :ref_year
                      AND dm.dividend_coverage_ratio IS NOT NULL
                    GROUP BY dm.symbol, s.gics_industry
                    HAVING COUNT(*) = :n_years
                """),
                {
                    "start_year": start_year,
                    "ref_year": REFERENCE_YEAR,
                    "n_years": request.consecutive_years,
                },
            ).mappings().all()

            # ── Apply thresholds on averages ───────────────────
            filtered = []
            for row in candidates:
                avg_dy = float(row["avg_dividend_yield"])
                avg_dcr = float(row["avg_coverage_ratio"])

                if avg_dy < request.dividend_yield_min:
                    continue
                if avg_dcr < request.coverage_ratio_min:
                    continue

                # Count actual consecutive years (may exceed N)
                streak = self._count_consecutive_dividend_years(
                    session, row["symbol"]
                )

                # Get latest DPS and price for display
                latest = session.execute(
                    text("""
                        SELECT dps, avg_close_price
                        FROM dividend_metrics
                        WHERE symbol = :symbol AND year = :ref_year
                    """),
                    {"symbol": row["symbol"], "ref_year": REFERENCE_YEAR},
                ).mappings().first()

                latest_dps = round(float(latest["dps"]), 4) if latest else 0.0
                avg_price = round(float(latest["avg_close_price"]), 2) if latest else 0.0

                filtered.append(
                    DividendResultItem(
                        rank=0,  # assigned after sorting
                        symbol=row["symbol"],
                        gics_industry=row["gics_industry"],
                        avg_close_price=avg_price,
                        avg_dividend_yield=round(avg_dy, 4),
                        avg_coverage_ratio=round(avg_dcr, 4),
                        latest_dps=latest_dps,
                        consecutive_dividend_years=streak,
                    )
                )

        # ── Step 4: Sort + Rank ────────────────────────────────
        allowed_sort = {"avg_coverage_ratio", "avg_dividend_yield", "latest_dps"}
        sort_key = request.sort_by if request.sort_by in allowed_sort else "avg_coverage_ratio"
        reverse = request.sort_order != "asc"

        filtered.sort(
            key=lambda item: getattr(item, sort_key) or 0,
            reverse=reverse,
        )

        for idx, item in enumerate(filtered, start=1):
            item.rank = idx

        # ── Paginate ───────────────────────────────────────────
        total = len(filtered)
        offset = (request.page - 1) * request.page_size
        page_items = filtered[offset:offset + request.page_size]

        return DividendFilterResponse(
            items=page_items,
            total=total,
            page=request.page,
            page_size=request.page_size,
            reference_year=REFERENCE_YEAR,
            years_analyzed=request.consecutive_years,
        )
