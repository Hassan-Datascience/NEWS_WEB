"""
Data processor — transforms raw articles into enriched processed documents.

Extracts:
  - Keywords (frequency-based, stop-word filtered)
  - Sentiment (TextBlob polarity -> positive / negative / neutral label)
  - Trend score (keyword frequency weight across the batch)
  - Quality score (composite of content length + sentiment confidence)
"""
from collections import Counter
from datetime import datetime, timezone

from app.utils.logger import get_logger
from app.models.processed import ProcessedArticle
from app.models.raw import RawArticle
from app.utils.keywords import extract_keywords, tokenize
from app.utils.sentiment import analyze_sentiment

logger = get_logger(__name__)


def _quality_score(content: str, sentiment_score: float) -> float:
    """
    Composite quality score [0, 1]:
      - 60% from content richness (token count / 200, capped at 1)
      - 40% from sentiment confidence (|polarity|)
    """
    tokens = tokenize(content)
    richness = min(len(tokens) / 200, 1.0)
    confidence = abs(sentiment_score)
    score = round(0.6 * richness + 0.4 * confidence, 4)
    return score


def _compute_trend_score(keywords: list[str], global_freq: Counter) -> int:
    """Sum of global keyword frequencies for this article's keywords."""
    return sum(global_freq.get(kw, 0) for kw in keywords)


# ── Public API ───────────────────────────────────────────────────────────────

def process_articles(
    raw_articles: list[tuple[str, RawArticle]],
) -> list[ProcessedArticle]:
    """
    Process a batch of (raw_id, RawArticle) tuples.

    Returns a list of ProcessedArticle instances ready for DB insertion.
    """
    if not raw_articles:
        return []

    # Build global keyword frequency across all articles in the batch
    all_tokens: list[str] = []
    for _, article in raw_articles:
        all_tokens.extend(tokenize(article.title + " " + article.content))
    global_freq = Counter(all_tokens)

    processed: list[ProcessedArticle] = []
    for raw_id, article in raw_articles:
        combined_text = f"{article.title}. {article.content}"
        keywords = extract_keywords(combined_text, top_n=10)
        sentiment_label, sentiment_score = analyze_sentiment(combined_text)
        score = _quality_score(article.content, sentiment_score)
        trend_score = _compute_trend_score(keywords, global_freq)

        try:
            p = ProcessedArticle(
                raw_id=raw_id,
                title=article.title,
                source=article.source,
                category=article.category,
                published_at=article.published_at,
                sentiment=sentiment_label,
                sentiment_score=sentiment_score,
                keywords=keywords,
                score=score,
                trend_score=trend_score,
                url=article.url,
                processed_at=datetime.now(timezone.utc),
            )
            processed.append(p)
        except Exception as exc:
            logger.warning("Failed to create ProcessedArticle for '%s': %s", article.title, exc)

    logger.info(
        "Processed %d / %d articles successfully.", len(processed), len(raw_articles)
    )
    return processed
