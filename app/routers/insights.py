"""
GET /insights — Paginated processed article insights with optional filters.
"""
import math
from typing import Literal, Optional

from fastapi import APIRouter, Query, HTTPException

from app.database import get_db
from app.utils.logger import get_logger
from app.models.processed import InsightsResponse, ProcessedArticleOut

router = APIRouter(prefix="/insights", tags=["Insights"])
logger = get_logger(__name__)

SentimentFilter = Literal["positive", "negative", "neutral"]


def _serialize_doc(doc: dict) -> dict:
    """Convert MongoDB ObjectId _id to string."""
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("", response_model=InsightsResponse)
async def insights(
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=100, description="Items per page"),
    sentiment: Optional[SentimentFilter] = Query(
        default=None, description="Filter by sentiment label"
    ),
    category: Optional[str] = Query(default=None, description="Filter by news category"),
    sort_by: Literal["processed_at", "trend_score", "score"] = Query(
        default="processed_at", description="Field to sort by"
    ),
    order: Literal["asc", "desc"] = Query(default="desc", description="Sort order"),
) -> InsightsResponse:
    """
    Return paginated processed article insights.

    Supports filtering by **sentiment** and **category**, and sorting by
    `processed_at`, `trend_score`, or `score`.
    """
    logger.info(
        "GET /insights page=%d limit=%d sentiment=%s category=%s sort=%s order=%s",
        page, limit, sentiment, category, sort_by, order,
    )
    db = get_db()

    query: dict = {}
    if sentiment:
        query["sentiment"] = sentiment
    if category:
        query["category"] = category.lower()

    sort_direction = -1 if order == "desc" else 1
    skip = (page - 1) * limit

    total = await db["processed_data"].count_documents(query)
    pages = math.ceil(total / limit) if total else 1

    if skip >= total and total > 0:
        raise HTTPException(
            status_code=404,
            detail=f"Page {page} out of range. Total pages: {pages}",
        )

    cursor = (
        db["processed_data"]
        .find(query)
        .sort(sort_by, sort_direction)
        .skip(skip)
        .limit(limit)
    )
    raw_docs = await cursor.to_list(length=limit)
    docs = [ProcessedArticleOut(**_serialize_doc(d)) for d in raw_docs]

    return InsightsResponse(data=docs, page=page, limit=limit, total=total, pages=pages)
