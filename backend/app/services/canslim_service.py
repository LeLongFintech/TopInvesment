import pandas as pd
from sqlalchemy import text

from app.repositories.database import get_session
from app.schemas.canslim import (
    CanslimFilterRequest,
    CanslimFilterResponse,
    CanslimResultItem,
)


def _percentile_rating(series: pd.Series) -> pd.Series:
    """Rank a Series by percentile, scaled to 1–99.

    Highest value receives 99, lowest receives 1.
    Uses 'average' method for ties.
    """
    pct = series.rank(pct=True, method="average")
    return (pct * 98 + 1).round().astype(int)


class CanslimService:
    """CANSLIM screening engine — 2-layer filter with percentile ranking.

    Layer 1: Hard filter (delta_eps, delta_sales, roe thresholds).
    Layer 2: Percentile ranking → rs/eps/smr/ad ratings → CR composite.
    """

    def run_filter(self, request: CanslimFilterRequest) -> CanslimFilterResponse:
        with get_session() as session:
            # ── Query canslim_metrics cho ngày được chọn ───────
            rows = session.execute(
                text("""
                    SELECT
                        cm.symbol,
                        s.gics_industry,
                        cm.date,
                        cm.close_price,
                        cm.delta_eps_quarterly,
                        cm.delta_sales,
                        cm.net_profit_margin,
                        cm.roe,
                        cm.sgr,
                        cm.rs_score,
                        cm.raw_eps,
                        cm.raw_ad,
                        cm.delta_vol
                    FROM canslim_metrics cm
                    LEFT JOIN stocks s ON cm.symbol = s.symbol
                    WHERE cm.date = :target_date
                """),
                {"target_date": request.date},
            ).mappings().all()

        if not rows:
            return CanslimFilterResponse(
                filter_date=request.date,
                page=request.page,
                page_size=request.page_size,
            )

        df = pd.DataFrame([dict(r) for r in rows])

        # ── Lớp 1: Hard filter ────────────────────────────────
        mask = (
            df["delta_eps_quarterly"].notna()
            & (df["delta_eps_quarterly"] >= request.delta_eps_min)
            & df["delta_sales"].notna()
            & (df["delta_sales"] >= request.delta_sales_min)
            & df["roe"].notna()
            & (df["roe"] >= request.roe_min)
        )
        df = df[mask].reset_index(drop=True)
        layer1_count = len(df)

        if df.empty:
            return CanslimFilterResponse(
                filter_date=request.date,
                layer1_count=0,
                page=request.page,
                page_size=request.page_size,
            )

        # ── Lớp 2a: RS Rating + filter ────────────────────────
        df["rs_rating"] = _percentile_rating(df["rs_score"])
        df = df[df["rs_rating"] >= request.rs_rating_min].reset_index(drop=True)
        layer2_count = len(df)

        if df.empty:
            return CanslimFilterResponse(
                filter_date=request.date,
                layer1_count=layer1_count,
                layer2_count=0,
                page=request.page,
                page_size=request.page_size,
            )

        # ── Lớp 2b: EPS Rating ────────────────────────────────
        df["eps_rating"] = _percentile_rating(df["raw_eps"])

        # ── Lớp 2c: SMR Rating (composite of 3 sub-ranks) ─────
        rank_sales = _percentile_rating(df["delta_sales"])
        rank_margin = _percentile_rating(df["net_profit_margin"])
        rank_roe = _percentile_rating(df["roe"])
        raw_smr = (rank_sales + rank_margin + rank_roe) / 3
        df["smr_rating"] = _percentile_rating(raw_smr)

        # ── Lớp 2d: A/D Rating ────────────────────────────────
        df["ad_rating"] = _percentile_rating(df["raw_ad"])

        # ── CR Composite Score ─────────────────────────────────
        df["cr_score"] = (
            df["rs_rating"] * 0.35
            + df["eps_rating"] * 0.35
            + df["smr_rating"] * 0.20
            + df["ad_rating"] * 0.10
        ).round(2)

        # ── Sort ───────────────────────────────────────────────
        allowed_sort = {
            "cr_score", "rs_rating", "eps_rating",
            "smr_rating", "ad_rating",
        }
        sort_col = request.sort_by if request.sort_by in allowed_sort else "cr_score"
        ascending = request.sort_order == "asc"
        df = df.sort_values(sort_col, ascending=ascending).reset_index(drop=True)

        # ── Build result items ─────────────────────────────────
        total = len(df)
        offset = (request.page - 1) * request.page_size
        page_df = df.iloc[offset:offset + request.page_size]

        items = [
            CanslimResultItem(
                symbol=row["symbol"],
                gics_industry=row.get("gics_industry"),
                date=str(row["date"]),
                close_price=round(float(row["close_price"]), 2),
                delta_eps_quarterly=_round_opt(row["delta_eps_quarterly"], 2),
                delta_sales=_round_opt(row["delta_sales"], 2),
                net_profit_margin=_round_opt(row["net_profit_margin"], 2),
                roe=_round_opt(row["roe"], 4),
                sgr=_round_opt(row["sgr"], 4),
                rs_score=_round_opt(row["rs_score"], 2),
                raw_eps=_round_opt(row["raw_eps"], 2),
                raw_ad=_round_opt(row["raw_ad"], 4),
                delta_vol=_round_opt(row["delta_vol"], 4),
                rs_rating=int(row["rs_rating"]),
                eps_rating=int(row["eps_rating"]),
                smr_rating=int(row["smr_rating"]),
                ad_rating=int(row["ad_rating"]),
                cr_score=float(row["cr_score"]),
            )
            for _, row in page_df.iterrows()
        ]

        return CanslimFilterResponse(
            items=items,
            total=total,
            page=request.page,
            page_size=request.page_size,
            filter_date=request.date,
            layer1_count=layer1_count,
            layer2_count=layer2_count,
        )


def _round_opt(value, decimals: int):
    """Round a value if not None/NaN, else return None."""
    if value is None or pd.isna(value):
        return None
    return round(float(value), decimals)
