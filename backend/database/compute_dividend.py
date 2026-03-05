"""
Dividend Metrics Pipeline
==========================

Usage:
    cd backend
    python -m database.compute_dividend

Computes 3 key metrics for the Dividend filter:
1. DPS (Dividend Per Share) — |dividends_paid| / shares
2. Dividend Yield           — DPS / avg_close_price (annual average)
3. Dividend Coverage Ratio  — net_income / |dividends_paid|

Results are stored in the `dividend_metrics` table for fast querying.

Note:
    Years with 0 dividends are KEPT (Approach 2).
    → DPS = 0, Dividend Yield = 0, Coverage Ratio = NULL.
"""

import sys
import time
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from app.config import get_settings


def timer(label: str):
    class Timer:
        def __enter__(self):
            self.start = time.perf_counter()
            print(f"  ⏳ {label}...", end=" ", flush=True)
            return self
        def __exit__(self, *args):
            elapsed = time.perf_counter() - self.start
            print(f"✅ ({elapsed:.1f}s)")
    return Timer()


def run_pipeline():
    settings = get_settings()
    engine = create_engine(settings.database_url)

    print("=" * 60)
    print("💰 Dividend Metrics Pipeline")
    print("=" * 60)
    print()

    # ── Step 1: Extract dividends from cash_flow ───────────────
    with timer("Extracting dividends from cash_flow"):
        div_df = pd.read_sql(
            """
            SELECT
                symbol,
                date,
                dividends_common_cash_paid
            FROM cash_flow
            WHERE dividends_common_cash_paid IS NOT NULL
            ORDER BY symbol, date
            """,
            engine,
        )
    print(f"    → {len(div_df):,} rows")

    # ── Step 2: Extract shares + net_income from income_statement
    with timer("Extracting shares + net_income from income_statement"):
        income_df = pd.read_sql(
            """
            SELECT
                symbol,
                date,
                shares_used_to_calculate_basic_eps_total AS shares,
                net_income_after_tax AS net_income
            FROM income_statement
            WHERE shares_used_to_calculate_basic_eps_total IS NOT NULL
              AND shares_used_to_calculate_basic_eps_total > 0
            ORDER BY symbol, date
            """,
            engine,
        )
    print(f"    → {len(income_df):,} rows")

    # ── Step 3: Compute avg_close_price per year per symbol ────
    with timer("Computing avg close price per year from market_data"):
        avg_price_df = pd.read_sql(
            """
            SELECT
                symbol,
                EXTRACT(YEAR FROM date)::int AS year,
                AVG(close_price) AS avg_close_price
            FROM market_data
            WHERE close_price IS NOT NULL
              AND close_price > 0
            GROUP BY symbol, EXTRACT(YEAR FROM date)
            ORDER BY symbol, year
            """,
            engine,
        )
    print(f"    → {len(avg_price_df):,} rows")

    # ── Step 4: Merge datasets by symbol + year ────────────────
    with timer("Merging dividends + income by symbol + date"):
        fundamentals = div_df.merge(
            income_df,
            on=["symbol", "date"],
            how="inner",
        )
    print(f"    → {len(fundamentals):,} rows")

    with timer("Extracting year and merging with avg price"):
        fundamentals["year"] = pd.to_datetime(fundamentals["date"]).dt.year
        fundamentals = fundamentals.rename(columns={"date": "report_date"})

        merged = fundamentals.merge(
            avg_price_df,
            on=["symbol", "year"],
            how="inner",
        )
    print(f"    → {len(merged):,} matched rows")

    # ── Step 5: Compute dividend metrics ───────────────────────
    with timer("Computing DPS, Dividend Yield, Coverage Ratio"):
        merged["dividends_paid"] = merged["dividends_common_cash_paid"].abs()

        # DPS = |dividends_paid| / shares
        merged["dps"] = merged["dividends_paid"] / merged["shares"]

        # Dividend Yield = DPS / avg_close_price
        merged["dividend_yield"] = merged.apply(
            lambda row: row["dps"] / row["avg_close_price"]
            if row["avg_close_price"] > 0
            else None,
            axis=1,
        )

        # Dividend Coverage Ratio = net_income / |dividends_paid|
        # NULL when dividends_paid = 0 (division by zero)
        merged["dividend_coverage_ratio"] = merged.apply(
            lambda row: float(row["net_income"]) / float(row["dividends_paid"])
            if row["dividends_paid"] > 0
            else None,
            axis=1,
        )

    # ── Step 6: Prepare final DataFrame ────────────────────────
    with timer("Preparing dividend_metrics table"):
        dividend_metrics = merged[[
            "symbol", "year", "report_date",
            "dividends_paid", "shares", "net_income",
            "avg_close_price", "dps",
            "dividend_yield", "dividend_coverage_ratio",
        ]].copy()

        dividend_metrics = dividend_metrics.sort_values(
            ["symbol", "year"]
        ).reset_index(drop=True)

    print(f"    → {len(dividend_metrics):,} total rows")
    print()

    # ── Step 7a: Insert into PostgreSQL ────────────────────────
    with timer(f"Inserting dividend_metrics ({len(dividend_metrics):,} rows)"):
        chunk_size = 50_000
        for i in range(0, len(dividend_metrics), chunk_size):
            chunk = dividend_metrics.iloc[i:i + chunk_size]
            mode = "replace" if i == 0 else "append"
            chunk.to_sql("dividend_metrics", engine, if_exists=mode, index=False)
            pct = min(100, int((i + chunk_size) / len(dividend_metrics) * 100))
            print(f"\r    Chunk {i // chunk_size + 1}: {pct}%", end="", flush=True)
        print()

    # ── Step 7b: Create indexes ────────────────────────────────
    with timer("Creating indexes"):
        with engine.begin() as conn:
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_dm_symbol_year "
                "ON dividend_metrics (symbol, year)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_dm_symbol "
                "ON dividend_metrics (symbol)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_dm_year "
                "ON dividend_metrics (year)"
            ))

    print()
    print("=" * 60)
    print("✅ Dividend metrics computed successfully!")
    print("=" * 60)

    # ── Summary ────────────────────────────────────────────────
    with engine.connect() as conn:
        count = conn.execute(text("SELECT COUNT(*) FROM dividend_metrics")).scalar()
        symbols = conn.execute(text("SELECT COUNT(DISTINCT symbol) FROM dividend_metrics")).scalar()
        min_year = conn.execute(text("SELECT MIN(year) FROM dividend_metrics")).scalar()
        max_year = conn.execute(text("SELECT MAX(year) FROM dividend_metrics")).scalar()
        zero_div = conn.execute(text("SELECT COUNT(*) FROM dividend_metrics WHERE dividends_paid = 0")).scalar()

    print(f"  Total rows      : {count:>12,}")
    print(f"  Unique stocks   : {symbols:>12,}")
    print(f"  Year range      : {min_year} → {max_year}")
    print(f"  Zero-dividend   : {zero_div:>12,} rows")


if __name__ == "__main__":
    run_pipeline()
