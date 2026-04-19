"""
GET /trends — Return top trending keywords for a given time window.
"""
from fastapi import APIRouter, Query

from app.database import get_db
from app.utils.logger import get_logger
from app.models.processed import TrendsResponse
from app.services.analytics import get_trending_keywords

router = APIRouter(prefix="/trends", tags=["Trends"])
logger = get_logger(__name__)


@router.get("", response_model=TrendsResponse)
async def trends(
    days: int = Query(default=7, ge=1, le=90, description="Look-back window in days"),
    limit: int = Query(default=20, ge=1, le=100, description="Max number of keywords to return"),
) -> TrendsResponse:
    """
    Return the top trending keywords found in processed articles
    published within the last `days` days.

    - **days**: look-back window (1–90)
    - **limit**: number of keywords to return (1–100)
    """
    logger.info("GET /trends?days=%d&limit=%d", days, limit)
    db = get_db()
    return await get_trending_keywords(db, days=days, limit=limit)
