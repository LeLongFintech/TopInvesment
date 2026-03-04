from collections import Counter

from sqlalchemy import text

from app.repositories.database import get_session
from app.schemas.value import (
    BubblePoint,
    GrahamFilterRequest,
    GrahamFilterResponse,
    GrahamResultItem,
    ScatterPoint,
    SectorSlice,
    StockDetailResponse,
    StockHistoryPoint,
)


class ValueService:
    """Benjamin Graham value screening — queries pre-computed graham_metrics."""

    def _count_eps_positive_years(self, session, symbol: str, target_year: int) -> int:
        """Count consecutive years with EPS > 0, going backwards from target_year."""
        rows = session.execute(
            text("""
                SELECT
                    EXTRACT(YEAR FROM date)::int AS yr,
                    eps_basic_incl_extraordinary_items_common_total AS eps
                FROM income_statement
                WHERE symbol = :symbol
                  AND EXTRACT(YEAR FROM date) <= :target_year
                ORDER BY date DESC
            """),
            {"symbol": symbol, "target_year": target_year},
        ).mappings().all()

        consecutive = 0
        for row in rows:
            if row["eps"] is not None and float(row["eps"]) > 0:
                consecutive += 1
            else:
                break
        return consecutive

    def _build_chart_data(self, results: list[GrahamResultItem]) -> tuple:
        """Aggregate chart data from ALL filtered results."""
        scatter = []
        bubble = []
        sector_counter: Counter = Counter()

        for item in results:
            if item.pe and item.margin_of_safety is not None:
                scatter.append(ScatterPoint(
                    symbol=item.symbol,
                    pe=item.pe,
                    margin_of_safety=item.margin_of_safety,
                ))

            if item.pe and item.pb and item.graham_number:
                bubble.append(BubblePoint(
                    symbol=item.symbol,
                    pe=item.pe,
                    pb=item.pb,
                    graham_number=item.graham_number,
                ))

            industry = item.gics_industry or "Unknown"
            sector_counter[industry] += 1

        total_stocks = len(results) or 1
        sectors = [
            SectorSlice(
                industry=industry,
                count=count,
                percentage=round(count / total_stocks * 100, 1),
            )
            for industry, count in sector_counter.most_common()
        ]

        return scatter, bubble, sectors

    def run_filter(self, request: GrahamFilterRequest) -> GrahamFilterResponse:
        target_year = int(request.date[:4])

        # ── Step 1: Query graham_metrics for the chosen date ───
        base_conditions = ["gm.date = :target_date"]
        params: dict = {"target_date": request.date}

        if request.pe_max is not None:
            base_conditions.append("gm.pe > 0 AND gm.pe <= :pe_max")
            params["pe_max"] = request.pe_max

        if request.pb_max is not None:
            base_conditions.append("gm.pb > 0 AND gm.pb <= :pb_max")
            params["pb_max"] = request.pb_max

        if request.graham_gt_price:
            base_conditions.append("gm.graham_number > gm.close_price")

        if request.margin_of_safety_min is not None:
            base_conditions.append("gm.margin_of_safety >= :mos_min")
            params["mos_min"] = request.margin_of_safety_min

        base_conditions.append("gm.eps > 0")
        base_conditions.append("gm.bvps > 0")

        where_clause = " AND ".join(base_conditions)

        allowed_sort = {"margin_of_safety", "pe", "pb", "graham_number", "eps", "bvps"}
        sort_col = request.sort_by if request.sort_by in allowed_sort else "margin_of_safety"
        sort_dir = "ASC" if request.sort_order == "asc" else "DESC"

        with get_session() as session:
            candidates = session.execute(
                text(f"""
                    SELECT
                        gm.symbol,
                        s.gics_industry,
                        gm.date,
                        gm.close_price,
                        gm.eps,
                        gm.bvps,
                        gm.pe,
                        gm.pb,
                        gm.graham_number,
                        gm.margin_of_safety
                    FROM graham_metrics gm
                    LEFT JOIN stocks s ON gm.symbol = s.symbol
                    WHERE {where_clause}
                    ORDER BY gm.{sort_col} {sort_dir} NULLS LAST
                """),
                params,
            ).mappings().all()

            # ── Step 2: Check EPS consecutive years ────────────
            results = []
            for row in candidates:
                eps_years = self._count_eps_positive_years(
                    session, row["symbol"], target_year
                )
                if eps_years < request.eps_consecutive_years:
                    continue

                results.append(
                    GrahamResultItem(
                        symbol=row["symbol"],
                        gics_industry=row["gics_industry"],
                        date=str(row["date"]),
                        close_price=round(float(row["close_price"]), 2),
                        eps=round(float(row["eps"]), 4),
                        bvps=round(float(row["bvps"]), 4),
                        pe=round(float(row["pe"]), 2) if row["pe"] else None,
                        pb=round(float(row["pb"]), 2) if row["pb"] else None,
                        graham_number=round(float(row["graham_number"]), 2) if row["graham_number"] else None,
                        margin_of_safety=round(float(row["margin_of_safety"]), 4) if row["margin_of_safety"] else None,
                        eps_positive_years=eps_years,
                    )
                )

        # ── Step 3: Build chart data from ALL results ──────────
        chart_scatter, chart_bubble, chart_sectors = self._build_chart_data(results)

        # ── Step 4: Paginate ───────────────────────────────────
        total = len(results)
        offset = (request.page - 1) * request.page_size
        page_items = results[offset:offset + request.page_size]

        return GrahamFilterResponse(
            items=page_items,
            total=total,
            page=request.page,
            page_size=request.page_size,
            filter_date=request.date,
            chart_scatter=chart_scatter,
            chart_bubble=chart_bubble,
            chart_sectors=chart_sectors,
        )

    def get_stock_history(self, symbol: str, years: int = 5) -> StockDetailResponse:
        """Get historical Graham metrics for a specific stock."""
        with get_session() as session:
            # Get industry
            industry_row = session.execute(
                text("SELECT gics_industry FROM stocks WHERE symbol = :symbol"),
                {"symbol": symbol},
            ).mappings().first()

            gics_industry = industry_row["gics_industry"] if industry_row else None

            # Get historical data — sample weekly to avoid too many points
            rows = session.execute(
                text("""
                    SELECT
                        date, close_price, graham_number,
                        pe, pb, margin_of_safety
                    FROM graham_metrics
                    WHERE symbol = :symbol
                      AND date >= CURRENT_DATE - INTERVAL ':years years'
                    ORDER BY date
                """.replace(":years years", f"{years} years")),
                {"symbol": symbol},
            ).mappings().all()

            # Sample: take every 5th row for performance (~weekly)
            sampled = rows[::5] if len(rows) > 500 else rows

            history = [
                StockHistoryPoint(
                    date=str(r["date"]),
                    close_price=round(float(r["close_price"]), 2),
                    graham_number=round(float(r["graham_number"]), 2) if r["graham_number"] else None,
                    pe=round(float(r["pe"]), 2) if r["pe"] else None,
                    pb=round(float(r["pb"]), 2) if r["pb"] else None,
                    margin_of_safety=round(float(r["margin_of_safety"]), 4) if r["margin_of_safety"] else None,
                )
                for r in sampled
            ]

        return StockDetailResponse(
            symbol=symbol,
            gics_industry=gics_industry,
            history=history,
        )
