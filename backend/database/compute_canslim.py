"""
CANSLIM Metrics Pipeline
=========================

Usage:
    cd backend
    python -m database.compute_canslim

Computes 12 raw metrics for the CANSLIM filter, stored in `canslim_metrics` table.

Group A — Annual financial (mapped to daily by year):
  1. delta_eps_quarterly  — YoY EPS growth of latest quarter
  2. delta_sales          — YoY Revenue growth
  3. net_profit_margin    — net_income / revenue × 100
  4. roe                  — net_income / avg_equity
  5. sgr                  — ROE × (1 − payout_ratio)

Group B — Daily technical (from market_data):
  6. rs_score             — Weighted quarterly price performance
  7. mfm                  — Money Flow Multiplier
  8. mfv                  — Money Flow Volume
  9. adl                  — Accumulation/Distribution Line
  10. delta_vol           — Volume surge ratio

Group C — Composite:
  11. raw_eps             — (5yr annual + 2q quarterly EPS growth avg) / 2
  12. raw_ad              — ADL change vs 63 sessions ago
"""

import sys
import time
from pathlib import Path

import numpy as np
import pandas as pd
from sqlalchemy import create_engine, text

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from app.config import get_settings


# ── Helpers ────────────────────────────────────────────────────

def timer(label: str):
    """Simple context-manager timer."""
    class Timer:
        def __enter__(self):
            self.start = time.perf_counter()
            print(f"  ⏳ {label}...", end=" ", flush=True)
            return self
        def __exit__(self, *args):
            elapsed = time.perf_counter() - self.start
            print(f"✅ ({elapsed:.1f}s)")
    return Timer()


def safe_pct_change(current: pd.Series, previous: pd.Series) -> pd.Series:
    """Compute (current - previous) / |previous| × 100.

    Returns NaN when previous is zero, NaN, or missing.
    """
    denom = previous.abs()
    valid = denom.notna() & (denom > 0) & current.notna()
    result = pd.Series(np.nan, index=current.index, dtype=float)
    result.loc[valid] = (
        (current[valid] - previous[valid]) / denom[valid] * 100
    )
    return result


def safe_divide(numerator: pd.Series, denominator: pd.Series) -> pd.Series:
    """Vectorized safe division — returns NaN when denominator is 0 or NaN."""
    valid = denominator.notna() & (denominator.abs() > 0) & numerator.notna()
    result = pd.Series(np.nan, index=numerator.index, dtype=float)
    result.loc[valid] = numerator[valid] / denominator[valid]
    return result


# ── Step 4: Annual Fundamentals ────────────────────────────────

def compute_annual_fundamentals(engine) -> pd.DataFrame:
    """Extract and compute annual financial metrics per (symbol, year).

    Returns DataFrame with: symbol, year, report_date,
    delta_sales, net_profit_margin, roe, sgr, avg_eps_growth_5y.
    """
    # ── Extract source data ────────────────────────────────────
    income_df = pd.read_sql("""
        SELECT
            symbol, date,
            revenue_from_business_activities_total AS revenue,
            net_income_after_tax AS net_income,
            eps_basic_excl_extraordinary_items_common_total AS eps_annual
        FROM income_statement
        ORDER BY symbol, date
    """, engine)
    income_df["year"] = pd.to_datetime(income_df["date"]).dt.year
    income_df = income_df.rename(columns={"date": "report_date"})

    equity_df = pd.read_sql("""
        SELECT symbol, date, common_equity_total AS equity
        FROM balance_sheet
        ORDER BY symbol, date
    """, engine)
    equity_df["year"] = pd.to_datetime(equity_df["date"]).dt.year
    equity_df = equity_df[["symbol", "year", "equity"]]

    div_df = pd.read_sql("""
        SELECT symbol, date, dividends_common_cash_paid AS dividends
        FROM cash_flow
        ORDER BY symbol, date
    """, engine)
    div_df["year"] = pd.to_datetime(div_df["date"]).dt.year
    div_df = div_df[["symbol", "year", "dividends"]]

    # ── Merge into single annual table ─────────────────────────
    annual = income_df.merge(equity_df, on=["symbol", "year"], how="left")
    annual = annual.merge(div_df, on=["symbol", "year"], how="left")

    # ── Self-join for previous year ────────────────────────────
    prev = annual[["symbol", "year", "revenue", "equity", "eps_annual"]].copy()
    prev.columns = ["symbol", "year", "revenue_prev", "equity_prev", "eps_annual_prev"]
    prev["year"] = prev["year"] + 1  # year N data becomes "previous" for year N+1

    annual = annual.merge(prev, on=["symbol", "year"], how="left")

    # ── Compute metrics ────────────────────────────────────────
    annual["delta_sales"] = safe_pct_change(annual["revenue"], annual["revenue_prev"])

    annual["net_profit_margin"] = safe_divide(annual["net_income"], annual["revenue"]) * 100

    avg_equity = pd.Series(np.where(
        annual["equity"].notna() & annual["equity_prev"].notna(),
        (annual["equity"] + annual["equity_prev"]) / 2,
        np.nan,
    ), index=annual.index, dtype=float)
    annual["roe"] = safe_divide(annual["net_income"], avg_equity)

    payout = pd.Series(np.where(
        annual["dividends"].notna() & annual["net_income"].notna() & (annual["net_income"] > 0),
        annual["dividends"].abs() / annual["net_income"],
        0.0,  # no dividends → payout = 0 → SGR = ROE
    ), index=annual.index, dtype=float)
    annual["sgr"] = pd.Series(np.where(
        annual["roe"].notna(),
        annual["roe"] * (1 - payout),
        np.nan,
    ), index=annual.index, dtype=float)

    # Annual EPS growth + 5-year rolling avg (for raw_eps)
    annual["eps_annual_growth"] = safe_pct_change(annual["eps_annual"], annual["eps_annual_prev"])
    annual = annual.sort_values(["symbol", "year"])
    annual["avg_eps_growth_5y"] = annual.groupby("symbol")["eps_annual_growth"].transform(
        lambda x: x.rolling(5, min_periods=1).mean()
    )

    result_cols = [
        "symbol", "year", "report_date",
        "delta_sales", "net_profit_margin", "roe", "sgr",
        "avg_eps_growth_5y",
    ]
    return annual[result_cols]


# ── Step 5: Quarterly EPS Delta ────────────────────────────────

def compute_quarterly_eps(engine) -> pd.DataFrame:
    """Compute Delta EPS per quarter (YoY) and 2-quarter rolling avg.

    Returns DataFrame with: symbol, date (quarter_date),
    delta_eps_quarterly, avg_eps_growth_2q.
    """
    eps_q = pd.read_sql("""
        SELECT symbol, date, eps
        FROM eps_quarterly
        WHERE eps IS NOT NULL
        ORDER BY symbol, date
    """, engine)
    eps_q["date"] = pd.to_datetime(eps_q["date"])
    eps_q["year"] = eps_q["date"].dt.year
    eps_q["quarter"] = eps_q["date"].dt.quarter

    # Self-join: same quarter, previous year
    prev_q = eps_q[["symbol", "year", "quarter", "eps"]].copy()
    prev_q.columns = ["symbol", "year", "quarter", "eps_prev_q"]
    prev_q["year"] = prev_q["year"] + 1

    eps_q = eps_q.merge(prev_q, on=["symbol", "year", "quarter"], how="left")
    eps_q["delta_eps_quarterly"] = safe_pct_change(eps_q["eps"], eps_q["eps_prev_q"])

    # 2-quarter rolling avg
    eps_q = eps_q.sort_values(["symbol", "date"])
    eps_q["avg_eps_growth_2q"] = eps_q.groupby("symbol")["delta_eps_quarterly"].transform(
        lambda x: x.rolling(2, min_periods=1).mean()
    )

    return eps_q[["symbol", "date", "delta_eps_quarterly", "avg_eps_growth_2q"]]


# ── Step 7: RS Score ───────────────────────────────────────────

def compute_rs_score(df: pd.DataFrame) -> pd.DataFrame:
    """Compute RS Score using rolling quarter price shifts (63/126/189/252 sessions).

    P_Qn = (P_{n-1} - P_n) / P_n × 100
    RS = P_Q1×0.4 + P_Q2×0.2 + P_Q3×0.2 + P_Q4×0.2
    """
    close = df["close_price"]
    grouped = df.groupby("symbol")["close_price"]

    p1 = grouped.shift(63)
    p2 = grouped.shift(126)
    p3 = grouped.shift(189)
    p4 = grouped.shift(252)

    p_q1 = safe_pct_change(close, p1)
    p_q2 = safe_pct_change(p1, p2)
    p_q3 = safe_pct_change(p2, p3)
    p_q4 = safe_pct_change(p3, p4)

    df["rs_score"] = p_q1 * 0.4 + p_q2 * 0.2 + p_q3 * 0.2 + p_q4 * 0.2
    return df


# ── Step 8: ADL & Volume ──────────────────────────────────────

def compute_adl_and_volume(df: pd.DataFrame) -> pd.DataFrame:
    """Compute MFM, MFV, ADL (cumulative), and Delta_Vol (50-session surge)."""
    high = df["high_price"]
    low = df["low_price"]
    close = df["close_price"]
    volume = df["volume"].fillna(0)

    # MFM = (2×close − high − low) / (high − low)
    hl_diff = high - low
    df["mfm"] = pd.Series(np.where(
        hl_diff.notna() & (hl_diff != 0),
        (2 * close - high - low) / hl_diff,
        0.0,
    ), index=df.index, dtype=float)

    # MFV = MFM × volume
    df["mfv"] = df["mfm"] * volume

    # ADL = cumsum(MFV) per symbol
    df["adl"] = df.groupby("symbol")["mfv"].cumsum()

    # Delta Vol = (volume − avg_vol_50) / avg_vol_50
    avg_vol_50 = df.groupby("symbol")["volume"].transform(
        lambda x: x.rolling(50, min_periods=1).mean()
    )
    df["delta_vol"] = safe_divide(volume - avg_vol_50, avg_vol_50)

    return df


# ── Main Pipeline ─────────────────────────────────────────────

def run_pipeline():
    settings = get_settings()
    engine = create_engine(settings.database_url)

    print("=" * 60)
    print("📈 CANSLIM Metrics Pipeline")
    print("=" * 60)
    print()

    # ── Steps 1–3: Load source data ────────────────────────────
    print("📂 Loading source data...")

    with timer("Loading market_data"):
        market_df = pd.read_sql("""
            SELECT symbol, date, close_price, high_price, low_price, volume
            FROM market_data
            WHERE close_price IS NOT NULL AND close_price > 0
            ORDER BY symbol, date
        """, engine)
        market_df["date"] = pd.to_datetime(market_df["date"])
        market_df["year"] = market_df["date"].dt.year
    print(f"    → {len(market_df):,} rows")

    # ── Step 4: Annual fundamentals ────────────────────────────
    print()
    print("🔧 Computing annual fundamentals...")

    with timer("Annual metrics (delta_sales, margin, ROE, SGR, EPS growth)"):
        annual = compute_annual_fundamentals(engine)
    print(f"    → {len(annual):,} rows")

    # ── Step 5: Quarterly EPS ──────────────────────────────────
    with timer("Quarterly EPS delta + 2q rolling avg"):
        eps_q = compute_quarterly_eps(engine)
    print(f"    → {len(eps_q):,} rows")

    # ── Step 6: Match fundamentals → daily ─────────────────────
    print()
    print("🔗 Matching fundamentals to daily market data...")

    with timer("Merging annual → daily by year"):
        merged = market_df.merge(annual, on=["symbol", "year"], how="left")
    print(f"    → {len(merged):,} rows")

    with timer("Merging quarterly EPS → daily (merge_asof)"):
        # merge_asof requires both sides sorted by the "on" key
        merged = merged.sort_values("date").reset_index(drop=True)
        eps_q_sorted = eps_q.sort_values("date").reset_index(drop=True)

        merged = pd.merge_asof(
            merged,
            eps_q_sorted.rename(columns={"date": "quarter_date"}),
            left_on="date",
            right_on="quarter_date",
            by="symbol",
            direction="backward",
        )
        # Restore symbol+date sort for subsequent groupby operations
        merged = merged.sort_values(["symbol", "date"]).reset_index(drop=True)
    print(f"    → {len(merged):,} rows")

    # ── Step 7: RS Score ───────────────────────────────────────
    print()
    print("📊 Computing daily technical indicators...")

    with timer("RS Score (63/126/189/252 session shifts)"):
        merged = merged.sort_values(["symbol", "date"]).reset_index(drop=True)
        merged = compute_rs_score(merged)

    # ── Step 8: MFM → MFV → ADL + Delta Vol ───────────────────
    with timer("MFM → MFV → ADL + Delta Vol"):
        merged = compute_adl_and_volume(merged)

    # ── Step 9: Composite metrics ──────────────────────────────
    print()
    print("🧮 Computing composite metrics...")

    with timer("Raw EPS = (5yr annual + 2q quarterly avg) / 2"):
        merged["raw_eps"] = pd.Series(np.where(
            merged["avg_eps_growth_5y"].notna() & merged["avg_eps_growth_2q"].notna(),
            (merged["avg_eps_growth_5y"] + merged["avg_eps_growth_2q"]) / 2,
            np.nan,
        ), index=merged.index, dtype=float)

    with timer("Raw AD = (ADL − ADL[-63]) / |ADL[-63]|"):
        adl_lag_63 = merged.groupby("symbol")["adl"].shift(63)
        merged["raw_ad"] = safe_divide(merged["adl"] - adl_lag_63, adl_lag_63.abs())

    # ── Step 10: Store results ─────────────────────────────────
    print()
    print("💾 Storing results...")

    final_columns = [
        "symbol", "date", "close_price", "report_date",
        # Group A: Annual financial
        "delta_eps_quarterly", "delta_sales", "net_profit_margin",
        "roe", "sgr",
        # Group B: Daily technical
        "rs_score", "mfm", "mfv", "adl", "delta_vol",
        # Group C: Composite
        "raw_eps", "raw_ad",
    ]

    with timer("Preparing canslim_metrics"):
        canslim_metrics = merged[final_columns].copy()
        canslim_metrics = canslim_metrics.sort_values(
            ["symbol", "date"]
        ).reset_index(drop=True)
    print(f"    → {len(canslim_metrics):,} total rows")
    print()

    # ── Insert into PostgreSQL ─────────────────────────────────
    with timer(f"Inserting canslim_metrics ({len(canslim_metrics):,} rows)"):
        chunk_size = 50_000
        for i in range(0, len(canslim_metrics), chunk_size):
            chunk = canslim_metrics.iloc[i:i + chunk_size]
            mode = "replace" if i == 0 else "append"
            chunk.to_sql("canslim_metrics", engine, if_exists=mode, index=False)
            pct = min(100, int((i + chunk_size) / len(canslim_metrics) * 100))
            print(f"\r    Chunk {i // chunk_size + 1}: {pct}%", end="", flush=True)
        print()

    # ── Create indexes ─────────────────────────────────────────
    with timer("Creating indexes"):
        with engine.begin() as conn:
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_cm_symbol_date "
                "ON canslim_metrics (symbol, date)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_cm_symbol "
                "ON canslim_metrics (symbol)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_cm_date "
                "ON canslim_metrics (date)"
            ))

    print()
    print("=" * 60)
    print("✅ CANSLIM metrics computed successfully!")
    print("=" * 60)

    # ── Summary ────────────────────────────────────────────────
    with engine.connect() as conn:
        count = conn.execute(text("SELECT COUNT(*) FROM canslim_metrics")).scalar()
        symbols = conn.execute(text("SELECT COUNT(DISTINCT symbol) FROM canslim_metrics")).scalar()
        min_date = conn.execute(text("SELECT MIN(date) FROM canslim_metrics")).scalar()
        max_date = conn.execute(text("SELECT MAX(date) FROM canslim_metrics")).scalar()

    print(f"  Total rows    : {count:>12,}")
    print(f"  Unique stocks : {symbols:>12,}")
    print(f"  Date range    : {min_date} → {max_date}")


if __name__ == "__main__":
    run_pipeline()
