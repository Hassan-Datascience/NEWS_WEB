"""
NewsAPI client — fetches top headlines and everything articles.
Handles pagination, error handling, and response normalization.
"""
from datetime import datetime, timezone
from typing import Any

import httpx

from app.config import settings
from app.utils.logger import get_logger
from app.models.raw import RawArticle

logger = get_logger(__name__)

NEWSAPI_EVERYTHING = f"{settings.news_api_base_url}/everything"
NEWSAPI_TOP = f"{settings.news_api_base_url}/top-headlines"
GNEWS_TOP = "https://gnews.io/api/v4/top-headlines"
CURRENTS_LATEST = "https://api.currentsapi.services/v1/latest-news"

_FALLBACK_CONTENT = "[Content not available]"


def _parse_date(date_str: str | None) -> datetime:
    """Parse ISO 8601 date string from NewsAPI; fallback to now."""
    if not date_str:
        return datetime.now(timezone.utc)
    try:
        # Normalize Currents API format "YYYY-MM-DD HH:MM:SS +0000" to "YYYY-MM-DD HH:MM:SS+00:00"
        ds = date_str.replace("Z", "+00:00").replace(" +0000", "+00:00")
        dt = datetime.fromisoformat(ds)
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt
    except ValueError:
        try:
            # Fallback for manual format string parsing if needed
            dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S %z")
            return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt
        except ValueError:
            logger.warning("Could not parse date: %s", date_str)
            return datetime.now(timezone.utc)


def _normalize_article(raw: dict[str, Any], category: str) -> RawArticle | None:
    """Convert a raw NewsAPI article dict to a RawArticle model."""
    title = (raw.get("title") or "").strip()
    content = (raw.get("content") or raw.get("description") or _FALLBACK_CONTENT).strip()
    source_name = (raw.get("source") or {}).get("name") or "Unknown"

    # Skip removed/invalid articles
    if not title or title == "[Removed]":
        return None
    if content == _FALLBACK_CONTENT and not raw.get("description"):
        return None

    try:
        return RawArticle(
            title=title,
            source=source_name,
            published_at=_parse_date(raw.get("publishedAt")),
            content=content[:5000],
            category=category,
            url=raw.get("url"),
            url_to_image=raw.get("urlToImage"),
            author=raw.get("author"),
        )
    except Exception as exc:
        logger.debug("Skipping article due to validation error: %s | %s", title, exc)
        return None


def _normalize_gnews_article(raw: dict[str, Any], category: str) -> RawArticle | None:
    """Convert a raw GNews article dict to a RawArticle model."""
    title = (raw.get("title") or "").strip()
    content = (raw.get("content") or raw.get("description") or _FALLBACK_CONTENT).strip()
    source_name = (raw.get("source") or {}).get("name") or "Unknown"

    if not title:
        return None

    try:
        return RawArticle(
            title=title,
            source=source_name,
            published_at=_parse_date(raw.get("publishedAt")),
            content=content[:5000],
            category=category,
            url=raw.get("url"),
            url_to_image=raw.get("image"),
            author=None,
        )
    except Exception as exc:
        logger.debug("Skipping GNews article due to error: %s | %s", title, exc)
        return None


def _normalize_currents_article(raw: dict[str, Any], category: str) -> RawArticle | None:
    """Convert a raw Currents article dict to a RawArticle model."""
    title = (raw.get("title") or "").strip()
    content = (raw.get("description") or _FALLBACK_CONTENT).strip()
    source_name = raw.get("author") or "Unknown"

    if not title:
        return None

    try:
        return RawArticle(
            title=title,
            source=source_name,
            published_at=_parse_date(raw.get("published")),
            content=content[:5000],
            category=category,
            url=raw.get("url"),
            url_to_image=raw.get("image"),
            author=raw.get("author"),
        )
    except Exception as exc:
        logger.debug("Skipping Currents article due to error: %s | %s", title, exc)
        return None


async def fetch_news(
    categories: list[str] | None = None,
    query: str = "AI technology business",
    page_size: int = 30,
) -> list[RawArticle]:
    """
    Fetch articles from NewsAPI, GNews, and Currents.
    Merge and deduplicate results by title.
    """
    cats = categories or settings.default_categories
    articles: list[RawArticle] = []

    async with httpx.AsyncClient(timeout=20.0) as client:
        # 1. NewsAPI Fetching
        for category in cats:
            logger.info("Fetching '%s' news from NewsAPI...", category)
            try:
                resp = await client.get(
                    NEWSAPI_TOP,
                    params={
                        "apiKey": settings.news_api_key,
                        "category": category,
                        "language": "en",
                        "pageSize": page_size,
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                fetched = [
                    article
                    for raw in data.get("articles", [])
                    if (article := _normalize_article(raw, category)) is not None
                ]
                articles.extend(fetched)
            except Exception as exc:
                logger.error("NewsAPI error for category '%s': %s", category, exc)

        # 2. GNews Fetching (limited categories, fetching general/tech)
        logger.info("Fetching from GNews...")
        try:
            resp = await client.get(
                GNEWS_TOP,
                params={
                    "apikey": settings.gnews_api_key,
                    "category": "technology",
                    "lang": "en",
                    "max": 10,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            fetched = [
                article
                for raw in data.get("articles", [])
                if (article := _normalize_gnews_article(raw, "technology")) is not None
            ]
            articles.extend(fetched)
        except Exception as exc:
            logger.error("GNews error: %s", exc)

        # 3. Currents Fetching
        logger.info("Fetching from Currents API...")
        try:
            resp = await client.get(
                CURRENTS_LATEST,
                params={
                    "apiKey": settings.currents_api_key,
                    "language": "en",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            fetched = [
                article
                for raw in data.get("news", [])
                if (article := _normalize_currents_article(raw, "general")) is not None
            ]
            articles.extend(fetched)
        except Exception as exc:
            logger.error("Currents API error: %s", exc)

    # 4. Deduplicate by title
    unique_articles = {}
    for article in articles:
        # Simple normalization for comparison
        clean_title = article.title.lower().strip()
        if clean_title not in unique_articles:
            unique_articles[clean_title] = article
    
    final_results = list(unique_articles.values())
    logger.info("Total articles after deduplication: %d", len(final_results))
    return final_results
