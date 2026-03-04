"""
Benjamin Graham Metrics Pipeline
=================================

Usage:
    cd backend
    python -m database.compute_graham

Computes 6 key metrics for the Benjamin Graham value filter:
1. EPS  — from income_statement
2. BVPS — shareholders_equity / shares_outstanding (balance_sheet)
3. P/E  — close_price / EPS
4. P/B  — close_price / BVPS
5. Graham Number (V) — sqrt(22.5 × EPS × BVPS)
6. Margin of Safety — (V - close_price) / V

Results are stored in the `graham_metrics` table for fast querying.
"""

import math
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
    print("📊 Benjamin Graham Metrics Pipeline")
    print("=" * 60)
    print()

    # ── Step 1: Extract EPS from income_statement ──────────────
    with timer("Extracting EPS from income_statement"):
        eps_df = pd.read_sql(
            """
            SELECT
                symbol,
                date,
                eps_basic_incl_extraordinary_items_common_total AS eps
            FROM income_statement
            WHERE eps_basic_incl_extraordinary_items_common_total IS NOT NULL
              AND eps_basic_incl_extraordinary_items_common_total != 0
            ORDER BY symbol, date
            """,
            engine,
        )
    print(f"    → {len(eps_df):,} rows")

    # ── Step 2: Compute BVPS from balance_sheet ────────────────
    with timer("Computing BVPS from balance_sheet"):
        bvps_df = pd.read_sql(
            """
            SELECT
                symbol,
                date,
                shareholders_equity_attributable_to_parent_shhold_total AS equity,
                common_shares_outstanding_total AS shares
            FROM balance_sheet
            WHERE common_shares_outstanding_total IS NOT NULL
              AND common_shares_outstanding_total > 0
            ORDER BY symbol, date
            """,
            engine,
        )
        bvps_df["bvps"] = bvps_df["equity"] / bvps_df["shares"]
        bvps_df = bvps_df[["symbol", "date", "bvps"]]
    print(f"    → {len(bvps_df):,} rows")

    # ── Step 3: Merge EPS + BVPS (by symbol + year) ────────────
    with timer("Merging EPS + BVPS"):
        fundamentals = eps_df.merge(bvps_df, on=["symbol", "date"], how="inner")
    print(f"    → {len(fundamentals):,} rows")

    # ── Step 4: Get close_price from market_data ───────────────
    with timer("Loading close_price from market_data"):
        price_df = pd.read_sql(
            """
            SELECT
                symbol,
                date,
                close_price
            FROM market_data
            WHERE close_price IS NOT NULL
              AND close_price > 0
            ORDER BY symbol, date
            """,
            engine,
        )
    print(f"    → {len(price_df):,} rows")

    # ── Step 5: Match price to fundamentals by year ────────────
    #   For each price row, find the fundamental data from the
    #   same year (annual financial report).
    with timer("Matching price dates to annual fundamentals"):
        # Extract year from both DataFrames
        price_df["year"] = pd.to_datetime(price_df["date"]).dt.year
        fundamentals["year"] = pd.to_datetime(fundamentals["date"]).dt.year

        # Rename fundamental date to avoid collision
        fundamentals = fundamentals.rename(columns={"date": "report_date"})

        # Merge: each daily price row gets the EPS/BVPS of that year
        merged = price_df.merge(
            fundamentals[["symbol", "year", "eps", "bvps", "report_date"]],
            on=["symbol", "year"],
            how="inner",
        )
    print(f"    → {len(merged):,} matched rows")

    # ── Step 6: Compute Graham metrics ─────────────────────────
    with timer("Computing P/E, P/B, Graham Number, Margin of Safety"):
        merged["pe"] = merged["close_price"] / merged["eps"]
        merged["pb"] = merged["close_price"] / merged["bvps"]

        # Graham Number: V = sqrt(22.5 × EPS × BVPS)
        # Only valid when both EPS > 0 and BVPS > 0
        merged["graham_number"] = merged.apply(
            lambda row: math.sqrt(22.5 * row["eps"] * row["bvps"])
            if row["eps"] > 0 and row["bvps"] > 0
            else None,
            axis=1,
        )

        # Margin of Safety: (V - Price) / V
        merged["margin_of_safety"] = merged.apply(
            lambda row: (row["graham_number"] - row["close_price"]) / row["graham_number"]
            if row["graham_number"] and row["graham_number"] > 0
            else None,
            axis=1,
        )

    # ── Step 7: Prepare final DataFrame ────────────────────────
    with timer("Preparing graham_metrics table"):
        graham_metrics = merged[[
            "symbol", "date", "close_price",
            "eps", "bvps", "pe", "pb",
            "graham_number", "margin_of_safety",
            "report_date",
        ]].copy()

        graham_metrics = graham_metrics.sort_values(
            ["symbol", "date"]
        ).reset_index(drop=True)

    print(f"    → {len(graham_metrics):,} total rows")
    print()

    # ── Step 8: Insert into PostgreSQL ─────────────────────────
    with timer(f"Inserting graham_metrics ({len(graham_metrics):,} rows)"):
        chunk_size = 50_000
        for i in range(0, len(graham_metrics), chunk_size):
            chunk = graham_metrics.iloc[i:i + chunk_size]
            mode = "replace" if i == 0 else "append"
            chunk.to_sql("graham_metrics", engine, if_exists=mode, index=False)
            pct = min(100, int((i + chunk_size) / len(graham_metrics) * 100))
            print(f"\r    Chunk {i // chunk_size + 1}: {pct}%", end="", flush=True)
        print()

    # ── Step 9: Create indexes ─────────────────────────────────
    with timer("Creating indexes"):
        with engine.begin() as conn:
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_gm_symbol_date "
                "ON graham_metrics (symbol, date)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_gm_symbol "
                "ON graham_metrics (symbol)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_gm_date "
                "ON graham_metrics (date)"
            ))

    print()
    print("=" * 60)
    print("✅ Benjamin Graham metrics computed successfully!")
    print("=" * 60)

    # ── Summary ────────────────────────────────────────────────
    with engine.connect() as conn:
        count = conn.execute(text("SELECT COUNT(*) FROM graham_metrics")).scalar()
        symbols = conn.execute(text("SELECT COUNT(DISTINCT symbol) FROM graham_metrics")).scalar()
        min_date = conn.execute(text("SELECT MIN(date) FROM graham_metrics")).scalar()
        max_date = conn.execute(text("SELECT MAX(date) FROM graham_metrics")).scalar()

    print(f"  Total rows    : {count:>12,}")
    print(f"  Unique stocks : {symbols:>12,}")
    print(f"  Date range    : {min_date} → {max_date}")


if __name__ == "__main__":
    run_pipeline()
