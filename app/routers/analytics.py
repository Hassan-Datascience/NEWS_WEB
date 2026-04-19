"""
GET /analytics/summary — Aggregated platform statistics.
"""
from fastapi import APIRouter

from app.database import get_db
from app.utils.logger import get_logger
from app.models.processed import AnalyticsSummary
from app.services.analytics import get_analytics_summary

router = APIRouter(prefix="/analytics", tags=["Analytics"])
logger = get_logger(__name__)


@router.get("/summary", response_model=AnalyticsSummary)
async def analytics_summary() -> AnalyticsSummary:
    """
    Return a comprehensive analytics summary including:

    - **total_raw_articles**: total articles stored in raw collection
    - **total_processed_articles**: total articles in processed collection
    - **sentiment_breakdown**: positive / negative / neutral counts
    - **top_categories**: most frequent news categories
    - **daily_ingestion**: per-day article counts (last 14 days)
    - **avg_sentiment_score**: mean polarity score across all articles
    """
    logger.info("GET /analytics/summary")
    db = get_db()
    return await get_analytics_summary(db)
