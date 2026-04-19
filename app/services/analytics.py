"""
Analytics service — MongoDB aggregation pipelines for:
  - Trend detection (top keywords over N days)
  - Sentiment breakdown
  - Time-series daily counts
  - Category distribution
"""
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.utils.logger import get_logger
from app.models.processed import (
    AnalyticsSummary,
    DailyCount,
    KeywordTrend,
    SentimentBreakdown,
    TrendsResponse,
)

logger = get_logger(__name__)


async def get_trending_keywords(
    db: AsyncIOMotorDatabase,
    days: int = 7,
    limit: int = 20,
) -> TrendsResponse:
    """
    Aggregate the most frequent keywords from processed articles
    published in the last `days` days.
    """
    since = datetime.now(timezone.utc) - timedelta(days=days)

    pipeline = [
        {"$match": {"published_at": {"$gte": since}}},
        {"$unwind": "$keywords"},
        {
            "$group": {
                "_id": "$keywords",
                "count": {"$sum": 1},
                "avg_trend_score": {"$avg": "$trend_score"},
            }
        },
        {"$sort": {"count": -1, "avg_trend_score": -1}},
        {"$limit": limit},
        {
            "$project": {
                "_id": 0,
                "keyword": "$_id",
                "count": 1,
                "trend_score": {"$round": ["$avg_trend_score", 2]},
            }
        },
    ]

    results = await db["processed_data"].aggregate(pipeline).to_list(length=limit)
    keywords = [KeywordTrend(**r) for r in results]
    logger.info("Trend query returned %d keywords (days=%d).", len(keywords), days)
    return TrendsResponse(days=days, keywords=keywords)


async def get_analytics_summary(db: AsyncIOMotorDatabase) -> AnalyticsSummary:
    """Return a comprehensive analytics summary of the stored data."""

    # Total counts
    total_raw = await db["raw_data"].count_documents({})
    total_processed = await db["processed_data"].count_documents({})

    # Sentiment breakdown
    sentiment_pipeline = [
        {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}}
    ]
    sentiment_docs = await db["processed_data"].aggregate(sentiment_pipeline).to_list(10)
    sentiment_map = {d["_id"]: d["count"] for d in sentiment_docs}
    breakdown = SentimentBreakdown(
        positive=sentiment_map.get("positive", 0),
        negative=sentiment_map.get("negative", 0),
        neutral=sentiment_map.get("neutral", 0),
        total=total_processed,
    )

    # Average sentiment score
    avg_pipeline = [
        {"$group": {"_id": None, "avg": {"$avg": "$sentiment_score"}}}
    ]
    avg_docs = await db["processed_data"].aggregate(avg_pipeline).to_list(1)
    avg_sentiment = round(avg_docs[0]["avg"] if avg_docs else 0.0, 4)

    # Top categories
    cat_pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
        {"$project": {"_id": 0, "category": "$_id", "count": 1}},
    ]
    top_categories = await db["processed_data"].aggregate(cat_pipeline).to_list(10)

    # Daily ingestion (last 14 days from raw_articles)
    since_14 = datetime.now(timezone.utc) - timedelta(days=14)
    daily_pipeline = [
        {"$match": {"fetched_at": {"$gte": since_14}}},
        {
            "$group": {
                "_id": {
                    "$dateToString": {"format": "%Y-%m-%d", "date": "$fetched_at"}
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
        {"$project": {"_id": 0, "date": "$_id", "count": 1}},
    ]
    daily_docs = await db["raw_data"].aggregate(daily_pipeline).to_list(14)
    daily_ingestion = [DailyCount(**d) for d in daily_docs]

    logger.info("Analytics summary computed. raw=%d processed=%d", total_raw, total_processed)

    return AnalyticsSummary(
        total_raw_articles=total_raw,
        total_processed_articles=total_processed,
        sentiment_breakdown=breakdown,
        top_categories=top_categories,
        daily_ingestion=daily_ingestion,
        avg_sentiment_score=avg_sentiment,
    )
