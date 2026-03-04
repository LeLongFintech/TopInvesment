from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.middleware.logging_middleware import LoggingMiddleware
from app.routes import canslim, dividend, stocks, value


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Startup and shutdown events."""
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
