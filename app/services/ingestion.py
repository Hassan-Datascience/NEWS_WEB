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

_FALLBACK_CONTENT = "[Content not available]"


def _parse_date(date_str: str | None) -> datetime:
    """Parse ISO 8601 date string from NewsAPI; fallback to now."""
    if not date_str:
        return datetime.now(timezone.utc)
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
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


async def fetch_news(
    categories: list[str] | None = None,
    query: str = "AI technology business",
    page_size: int = 30,
) -> list[RawArticle]:
    """
    Fetch articles from NewsAPI for the given categories.

    Uses /top-headlines for category-based fetching and /everything as fallback
    with a broad query to maximise data variety.
    """
    cats = categories or settings.default_categories
    articles: list[RawArticle] = []

    async with httpx.AsyncClient(timeout=20.0) as client:
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
                logger.info(
                    "Fetched %d valid articles for category '%s'.",
                    len(fetched),
                    category,
                )
                articles.extend(fetched)

            except httpx.HTTPStatusError as exc:
                logger.error(
                    "NewsAPI HTTP error for category '%s': %s", category, exc.response.text
                )
            except httpx.RequestError as exc:
                logger.error("Network error fetching category '%s': %s", category, exc)

        # Also fetch from /everything with a broad tech/market query
        logger.info("Fetching broad market/tech articles from /everything...")
        try:
            resp = await client.get(
                NEWSAPI_EVERYTHING,
                params={
                    "apiKey": settings.news_api_key,
                    "q": query,
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": page_size,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            extra = [
                article
                for raw in data.get("articles", [])
                if (article := _normalize_article(raw, "general")) is not None
            ]
            logger.info("Fetched %d broad market articles.", len(extra))
            articles.extend(extra)
        except (httpx.HTTPStatusError, httpx.RequestError) as exc:
            logger.error("Error fetching broad articles: %s", exc)

    logger.info("Total articles fetched: %d", len(articles))
    return articles
