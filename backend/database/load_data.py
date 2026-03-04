"""
Data Pipeline: Load cleaned Excel data → PostgreSQL
====================================================

Usage:
    cd backend
    python -m database.load_data

This script:
1. Reads 6 Excel files from Data/cleaned_data/
2. Normalises column names to snake_case
3. Extracts unique stocks → INSERT into `stocks` table
4. Loads balance_sheet, cash_flow, income_statement, eps_quarterly tables
5. Unpivots price + volume (wide→long) → INSERT into `market_data`
6. Creates indexes for fast querying
"""

import re
import sys
import time
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text

# ── Resolve paths ──────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent  # backend/../..
DATA_DIR = PROJECT_ROOT / "Data" / "cleaned_data"

# Add backend to sys.path so we can import app.config
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from app.config import get_settings


# ── Helpers ────────────────────────────────────────────────────
def to_snake_case(name: str) -> str:
    """Convert column name to PostgreSQL-friendly snake_case."""
    name = name.strip()
    name = re.sub(r"[/\\()&,\-–]", " ", name)
    name = re.sub(r"[^a-zA-Z0-9\s_]", "", name)
    name = re.sub(r"\s+", "_", name)
    name = name.strip("_").lower()
    # Collapse repeated underscores
    name = re.sub(r"_+", "_", name)
    return name


def clean_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalise all column names to snake_case."""
    df.columns = [to_snake_case(c) for c in df.columns]
    return df


def drop_unnamed(df: pd.DataFrame) -> pd.DataFrame:
    """Drop 'unnamed_0' or similar index columns leftover from Excel."""
    cols_to_drop = [c for c in df.columns if c.startswith("unnamed")]
    return df.drop(columns=cols_to_drop, errors="ignore")


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


# ── Main pipeline ──────────────────────────────────────────────
def run_pipeline():
    settings = get_settings()
    engine = create_engine(settings.database_url)

    print("=" * 60)
    print("📦 TopInvestment Data Pipeline")
    print("=" * 60)
    print(f"Database : {settings.database_url.split('@')[-1]}")
    print(f"Data dir : {DATA_DIR}")
    print()

    # ── Step 1: Load Excel files ───────────────────────────────
    print("📂 Step 1: Reading Excel files...")

    with timer("balance_sheet.xlsx"):
        bs = clean_columns(drop_unnamed(pd.read_excel(DATA_DIR / "balance_sheet.xlsx")))

    with timer("cash_flow.xlsx"):
        cf = clean_columns(drop_unnamed(pd.read_excel(DATA_DIR / "cash_flow.xlsx")))

    with timer("income_statement.xlsx"):
        inc = clean_columns(drop_unnamed(pd.read_excel(DATA_DIR / "income_statement.xlsx")))

    with timer("eps(quarter).xlsx"):
        eps = clean_columns(drop_unnamed(pd.read_excel(DATA_DIR / "eps(quarter).xlsx")))

    with timer("price(close).xlsx"):
        price_raw = drop_unnamed(pd.read_excel(DATA_DIR / "price(close).xlsx"))

    with timer("volume.xlsx"):
        volume_raw = drop_unnamed(pd.read_excel(DATA_DIR / "volume.xlsx"))

    print()

    # ── Step 2: Extract unique stocks ──────────────────────────
    print("🏢 Step 2: Extracting unique stocks...")

    # Long-format files have 'tickers' column
    bs = bs.rename(columns={"tickers": "symbol"})
    cf = cf.rename(columns={"tickers": "symbol"})
    inc = inc.rename(columns={"tickers": "symbol"})
    eps = eps.rename(columns={"tickers": "symbol"})

    # Build stocks master table from balance_sheet (has IPO date + industry)
    stocks_df = (
        bs[["symbol", "ipo_date", "gics_industry_name"]]
        .rename(columns={"gics_industry_name": "gics_industry"})
        .drop_duplicates(subset=["symbol"])
        .sort_values("symbol")
        .reset_index(drop=True)
    )

    with timer(f"Inserting {len(stocks_df)} stocks"):
        stocks_df.to_sql("stocks", engine, if_exists="replace", index=False)

    print()

    # ── Step 3: Load long-format financial tables ──────────────
    print("📊 Step 3: Loading financial statements...")

    # Drop IPO Date + GICS columns (already in stocks table)
    meta_cols = ["ipo_date", "gics_industry_name"]
    bs_clean = bs.drop(columns=[c for c in meta_cols if c in bs.columns], errors="ignore")
    cf_clean = cf.drop(columns=[c for c in meta_cols if c in cf.columns], errors="ignore")
    inc_clean = inc.drop(columns=[c for c in meta_cols if c in inc.columns], errors="ignore")

    with timer(f"balance_sheet ({len(bs_clean)} rows)"):
        bs_clean.to_sql("balance_sheet", engine, if_exists="replace", index=False)

    with timer(f"cash_flow ({len(cf_clean)} rows)"):
        cf_clean.to_sql("cash_flow", engine, if_exists="replace", index=False)

    with timer(f"income_statement ({len(inc_clean)} rows)"):
        inc_clean.to_sql("income_statement", engine, if_exists="replace", index=False)

    with timer(f"eps_quarterly ({len(eps)} rows)"):
        eps.to_sql("eps_quarterly", engine, if_exists="replace", index=False)

    print()

    # ── Step 4: Unpivot price + volume → market_data ───────────
    print("📈 Step 4: Unpivoting price + volume → market_data...")

    with timer("Melting price data"):
        # Only rename Date column — keep ticker symbols as-is
        price_raw = price_raw.rename(columns={"Date": "date"})
        if "date" not in price_raw.columns:
            date_col = [c for c in price_raw.columns if "date" in c.lower()][0]
            price_raw = price_raw.rename(columns={date_col: "date"})

        price_long = price_raw.melt(
            id_vars=["date"],
            var_name="symbol",
            value_name="close_price",
        )
        price_long = price_long.dropna(subset=["close_price"])

    with timer("Melting volume data"):
        # Only rename Date column — keep ticker symbols as-is
        volume_raw = volume_raw.rename(columns={"Date": "date"})
        if "date" not in volume_raw.columns:
            date_col = [c for c in volume_raw.columns if "date" in c.lower()][0]
            volume_raw = volume_raw.rename(columns={date_col: "date"})

        volume_long = volume_raw.melt(
            id_vars=["date"],
            var_name="symbol",
            value_name="volume",
        )
        volume_long = volume_long.dropna(subset=["volume"])

    with timer("Merging price + volume"):
        market_data = price_long.merge(
            volume_long,
            on=["date", "symbol"],
            how="outer",
        )

    print(f"  📏 market_data rows: {len(market_data):,}")

    with timer(f"Inserting market_data ({len(market_data):,} rows)"):
        # Insert in chunks to avoid memory issues
        chunk_size = 50_000
        for i in range(0, len(market_data), chunk_size):
            chunk = market_data.iloc[i:i + chunk_size]
            mode = "replace" if i == 0 else "append"
            chunk.to_sql("market_data", engine, if_exists=mode, index=False)
            pct = min(100, int((i + chunk_size) / len(market_data) * 100))
            print(f"\r    Chunk {i // chunk_size + 1}: {pct}%", end="", flush=True)
        print()

    print()

    # ── Step 5: Create indexes ─────────────────────────────────
    print("🔑 Step 5: Creating indexes...")

    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks (symbol)",
        "CREATE INDEX IF NOT EXISTS idx_bs_symbol_date ON balance_sheet (symbol, date)",
        "CREATE INDEX IF NOT EXISTS idx_cf_symbol_date ON cash_flow (symbol, date)",
        "CREATE INDEX IF NOT EXISTS idx_inc_symbol_date ON income_statement (symbol, date)",
        "CREATE INDEX IF NOT EXISTS idx_eps_symbol_date ON eps_quarterly (symbol, date)",
        "CREATE INDEX IF NOT EXISTS idx_md_symbol_date ON market_data (symbol, date)",
        "CREATE INDEX IF NOT EXISTS idx_md_symbol ON market_data (symbol)",
        "CREATE INDEX IF NOT EXISTS idx_md_date ON market_data (date)",
    ]

    with engine.begin() as conn:
        for idx_sql in indexes:
            idx_name = idx_sql.split("idx_")[1].split(" ON")[0]
            with timer(f"Index idx_{idx_name}"):
                conn.execute(text(idx_sql))

    print()
    print("=" * 60)
    print("✅ Pipeline completed successfully!")
    print("=" * 60)

    # ── Summary ────────────────────────────────────────────────
    with engine.connect() as conn:
        for table in ["stocks", "balance_sheet", "cash_flow", "income_statement", "eps_quarterly", "market_data"]:
            count = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            print(f"  {table:25s} → {count:>12,} rows")


if __name__ == "__main__":
    run_pipeline()
