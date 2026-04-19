"""
FastAPI application entry point.

Registers:
- Startup / shutdown lifecycle events (DB connect/close)
- All API routers
- Global exception handlers
- CORS middleware
- Static file serving for the frontend dashboard
"""
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.database import connect_db, close_db
from app.services.scheduler import start_scheduler, stop_scheduler
from app.utils.logger import get_logger
from app.routers import ingest, trends, insights, search, analytics

logger = get_logger(__name__)


# ── Lifespan context (replaces deprecated @app.on_event) ─────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("=== AI Market Intelligence API starting up ===")
    await connect_db()
    start_scheduler()
    yield
    logger.info("=== AI Market Intelligence API shutting down ===")
    stop_scheduler()
    await close_db()


# ── App factory ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="AI Market Intelligence & Trend Analytics API",
    description=(
        "Production-grade backend that ingests real-world news data, "
        "performs sentiment & trend analysis, and exposes actionable insights "
        "through a clean REST API."
    ),
    version="1.0.0",
    contact={
        "name": "AI Market Intelligence",
        "url": "https://github.com/your-username/ai-market-intelligence",
    },
    license_info={"name": "MIT"},
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://news-web-one-red.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global exception handler ──────────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s %s: %s", request.method, request.url, exc)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "path": str(request.url),
        },
    )


# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(ingest.router)
app.include_router(trends.router)
app.include_router(insights.router)
app.include_router(search.router)
app.include_router(analytics.router)


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"], summary="Health check")
async def health() -> dict:
    """Returns API health status."""
    return {
        "status": "ok",
        "environment": settings.environment,
        "version": "1.0.0",
    }


# ── Root ──────────────────────────────────────────────────────────────────────

@app.get("/admin/db-stats", tags=["System"])
async def db_stats() -> dict:
    from app.database import get_db
    db = get_db()
    stats = await db.command("dbStats")
    data_size = stats.get("dataSize", 0)
    size_mb = round(data_size / (1024 * 1024), 2)
    limit_mb = 350
    usage_percent = round((size_mb / limit_mb) * 100, 2)
    total_articles = await db["raw_data"].count_documents({})
    
    return {
        "size_mb": size_mb,
        "total_articles": total_articles,
        "limit_mb": limit_mb,
        "usage_percent": usage_percent
    }



@app.get("/", tags=["System"])
async def root() -> dict:
    return {
        "message": "AI Market Intelligence API",
        "docs": "/docs",
        "health": "/health",
    }
