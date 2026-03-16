from collections import Counter

from sqlalchemy import text

from app.repositories.database import get_session
from app.schemas.value import (
    AnnualEpsDividend,
    BubblePoint,
    GrahamChartDetailResponse,
    GrahamFilterRequest,
    GrahamFilterResponse,
    GrahamResultItem,
    IndustryPeItem,
    ScatterPoint,
    SectorSlice,
    ShieldItem,
    StockDetailResponse,
    StockHistoryPoint,
    TreemapItem,
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

        # Treemap: symbol, industry, close_price (size), pe (color)
        treemap = [
            TreemapItem(
                symbol=item.symbol,
                industry=item.gics_industry or "Unknown",
                close_price=item.close_price,
                pe=item.pe,
            )
            for item in results
            if item.pe and item.pe > 0
        ]

        # Shield: top 15 by current_ratio (descending), with CR + D/E
        shield_candidates = [
            item for item in results
            if item.current_ratio is not None and item.de_ratio is not None
        ]
        shield_candidates.sort(key=lambda x: x.current_ratio or 0, reverse=True)
        shield = [
            ShieldItem(
                symbol=item.symbol,
                current_ratio=round(item.current_ratio, 2),
                de_ratio=round(item.de_ratio, 2),
            )
            for item in shield_candidates[:15]
        ]

        return scatter, bubble, sectors, treemap, shield

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

        if request.de_max is not None:
            base_conditions.append("gm.de_ratio IS NOT NULL AND gm.de_ratio <= :de_max")
            params["de_max"] = request.de_max

        if request.cr_min is not None:
            base_conditions.append("gm.current_ratio IS NOT NULL AND gm.current_ratio >= :cr_min")
            params["cr_min"] = request.cr_min

        if request.div_yield_min is not None:
            base_conditions.append("gm.dividend_yield IS NOT NULL AND gm.dividend_yield >= :div_yield_min")
            params["div_yield_min"] = request.div_yield_min

        base_conditions.append("gm.eps > 0")
        base_conditions.append("gm.bvps > 0")

        where_clause = " AND ".join(base_conditions)

        allowed_sort = {
            "margin_of_safety", "pe", "pb", "graham_number", "eps", "bvps",
            "de_ratio", "current_ratio", "dividend_yield", "payout_ratio",
        }
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
                        gm.margin_of_safety,
                        gm.de_ratio,
                        gm.current_ratio,
                        gm.dividend_yield,
                        gm.payout_ratio
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
                        de_ratio=round(float(row["de_ratio"]), 4) if row["de_ratio"] is not None else None,
                        current_ratio=round(float(row["current_ratio"]), 4) if row["current_ratio"] is not None else None,
                        dividend_yield=round(float(row["dividend_yield"]), 4) if row["dividend_yield"] is not None else None,
                        payout_ratio=round(float(row["payout_ratio"]), 4) if row["payout_ratio"] is not None else None,
                    )
                )

        # ── Step 3: Build chart data from ALL results ──────────
        chart_scatter, chart_bubble, chart_sectors, chart_treemap, chart_shield = self._build_chart_data(results)

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
            chart_treemap=chart_treemap,
            chart_shield=chart_shield,
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
                        pe, pb, margin_of_safety,
                        de_ratio, current_ratio
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
                    de_ratio=round(float(r["de_ratio"]), 4) if r["de_ratio"] is not None else None,
                    current_ratio=round(float(r["current_ratio"]), 4) if r["current_ratio"] is not None else None,
                )
                for r in sampled
            ]

        return StockDetailResponse(
            symbol=symbol,
            gics_industry=gics_industry,
            history=history,
        )

    def get_chart_detail(self, symbol: str, date: str) -> GrahamChartDetailResponse:
        """Data for 5 new Graham charts: radar, bullet, waterfall, EPS history, PE histogram."""
        with get_session() as session:
            # ── Industry ──────────────────────────────────────
            ind_row = session.execute(
                text("SELECT gics_industry FROM stocks WHERE symbol = :s"),
                {"s": symbol},
            ).mappings().first()
            gics_industry = ind_row["gics_industry"] if ind_row else None

            # ── Current metrics (for radar/bullet/waterfall) ──
            cur = session.execute(
                text("""
                    SELECT pe, pb, current_ratio, de_ratio, dividend_yield,
                           graham_number, close_price, margin_of_safety
                    FROM graham_metrics
                    WHERE symbol = :s AND date = :d
                """),
                {"s": symbol, "d": date},
            ).mappings().first()

            pe = pb = cr = de = dy = gn = cp = mos = None
            if cur:
                pe = round(float(cur["pe"]), 2) if cur["pe"] else None
                pb = round(float(cur["pb"]), 2) if cur["pb"] else None
                cr = round(float(cur["current_ratio"]), 2) if cur["current_ratio"] is not None else None
                de = round(float(cur["de_ratio"]), 2) if cur["de_ratio"] is not None else None
                dy = round(float(cur["dividend_yield"]), 4) if cur["dividend_yield"] is not None else None
                gn = round(float(cur["graham_number"]), 2) if cur["graham_number"] else None
                cp = round(float(cur["close_price"]), 2) if cur["close_price"] else None
                mos = round(float(cur["margin_of_safety"]), 4) if cur["margin_of_safety"] is not None else None

            # ── EPS Growth (for radar) ────────────────────────
            eps_rows = session.execute(
                text("""
                    SELECT eps_basic_excl_extraordinary_items_common_total AS eps_val,
                           EXTRACT(YEAR FROM date)::int AS yr
                    FROM income_statement
                    WHERE symbol = :s
                    ORDER BY date
                """),
                {"s": symbol},
            ).mappings().all()

            eps_growth = None
            if len(eps_rows) >= 2:
                last_eps = float(eps_rows[-1]["eps_val"]) if eps_rows[-1]["eps_val"] else None
                prev_eps = float(eps_rows[-2]["eps_val"]) if eps_rows[-2]["eps_val"] else None
                if last_eps and prev_eps and prev_eps != 0:
                    eps_growth = round((last_eps - prev_eps) / abs(prev_eps) * 100, 2)

            # ── Chart 4: Annual EPS + Dividend (10yr) ─────────
            annual_eps = session.execute(
                text("""
                    SELECT EXTRACT(YEAR FROM date)::int AS yr,
                           eps_basic_excl_extraordinary_items_common_total AS eps_val
                    FROM income_statement
                    WHERE symbol = :s
                    ORDER BY date
                """),
                {"s": symbol},
            ).mappings().all()

            annual_div = session.execute(
                text("""
                    SELECT EXTRACT(YEAR FROM date)::int AS yr,
                           dividends_common_cash_paid AS div_paid
                    FROM cash_flow
                    WHERE symbol = :s
                    ORDER BY date
                """),
                {"s": symbol},
            ).mappings().all()

            div_by_year = {int(r["yr"]): float(r["div_paid"]) if r["div_paid"] else None for r in annual_div}

            annual_eps_div = [
                AnnualEpsDividend(
                    year=int(r["yr"]),
                    eps=round(float(r["eps_val"]), 4) if r["eps_val"] is not None else None,
                    dividend_per_share=round(abs(div_by_year.get(int(r["yr"]), 0) or 0), 4) if int(r["yr"]) in div_by_year else None,
                )
                for r in annual_eps
            ]

            # ── Chart 5: Industry P/E distribution ────────────
            industry_pe: list[IndustryPeItem] = []
            if gics_industry:
                peers = session.execute(
                    text("""
                        SELECT gm.symbol, gm.pe
                        FROM graham_metrics gm
                        JOIN stocks s ON gm.symbol = s.symbol
                        WHERE s.gics_industry = :ind
                          AND gm.date = :d
                          AND gm.pe > 0 AND gm.pe < 100
                    """),
                    {"ind": gics_industry, "d": date},
                ).mappings().all()
                industry_pe = [
                    IndustryPeItem(symbol=r["symbol"], pe=round(float(r["pe"]), 2))
                    for r in peers
                ]

        return GrahamChartDetailResponse(
            symbol=symbol,
            gics_industry=gics_industry,
            pe=pe, pb=pb, current_ratio=cr, de_ratio=de,
            dividend_yield=dy, eps_growth=eps_growth,
            graham_number=gn, close_price=cp, margin_of_safety=mos,
            annual_eps_div=annual_eps_div,
            industry_pe=industry_pe,
        )

