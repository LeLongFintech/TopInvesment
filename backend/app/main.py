from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import get_settings
from app.middleware.logging_middleware import LoggingMiddleware
from app.repositories.database import get_engine
from app.routes import canslim, dividend, stocks, value

logger = logging.getLogger("topinvestment")


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Verify database connection on startup."""
    engine = get_engine()
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("✅ Database connection verified")
    except Exception as exc:
        logger.error("❌ Database connection failed: %s", exc)
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    application = FastAPI(
        title="TopInvestment API",
        description="Stock screening API — CANSLIM, Value Investing & Dividend filters",
        version="1.0.0",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.add_middleware(LoggingMiddleware)

    application.include_router(canslim.router, prefix="/api/v1")
    application.include_router(value.router, prefix="/api/v1")
    application.include_router(dividend.router, prefix="/api/v1")
    application.include_router(stocks.router, prefix="/api/v1")

    return application


app = create_app()


@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "TopInvestment API"}
