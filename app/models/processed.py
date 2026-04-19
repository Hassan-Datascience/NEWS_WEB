"""
Pydantic models for processed articles stored in MongoDB processed_articles collection.
"""
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


SentimentLabel = Literal["positive", "negative", "neutral"]


class ProcessedArticle(BaseModel):
    """Schema for a fully processed article document."""

    raw_id: str                          # Reference to raw_articles._id
    title: str
    source: str
    category: str
    published_at: datetime
    sentiment: SentimentLabel
    sentiment_score: float = Field(ge=-1.0, le=1.0)  # TextBlob polarity
    keywords: list[str]
    score: float = Field(ge=0.0, le=1.0)   # Overall quality score
    trend_score: int = Field(ge=0)          # Keyword frequency weight
    processed_at: datetime = Field(default_factory=datetime.utcnow)
    url: Optional[str] = None


class ProcessedArticleOut(ProcessedArticle):
    """API-safe output model (id as string)."""

    id: str = Field(alias="_id")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Analytics response models
# ---------------------------------------------------------------------------


class KeywordTrend(BaseModel):
    keyword: str
    count: int
    trend_score: float


class TrendsResponse(BaseModel):
    days: int
    keywords: list[KeywordTrend]
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class SentimentBreakdown(BaseModel):
    positive: int
    negative: int
    neutral: int
    total: int


class DailyCount(BaseModel):
    date: str
    count: int


class AnalyticsSummary(BaseModel):
    total_raw_articles: int
    total_processed_articles: int
    sentiment_breakdown: SentimentBreakdown
    top_categories: list[dict]
    daily_ingestion: list[DailyCount]
    avg_sentiment_score: float
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class InsightsResponse(BaseModel):
    data: list[ProcessedArticleOut]
    page: int
    limit: int
    total: int
    pages: int


class SearchResponse(BaseModel):
    query: str
    data: list[ProcessedArticleOut]
    page: int
    limit: int
    total: int
    pages: int
