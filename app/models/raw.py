"""
Pydantic models for raw articles stored in MongoDB raw_articles collection.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class RawArticle(BaseModel):
    """Schema matching the MongoDB raw_articles document structure."""

    title: str
    source: str
    published_at: datetime
    content: str
    category: str
    url: Optional[str] = None
    url_to_image: Optional[str] = None
    author: Optional[str] = None
    fetched_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("title", "source", "content", "category")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field must not be empty.")
        return v.strip()

    @field_validator("content")
    @classmethod
    def truncate_content(cls, v: str) -> str:
        """Limit content to 5000 characters to keep documents lean."""
        return v[:5000]


class RawArticleInDB(RawArticle):
    """Raw article as stored in MongoDB (includes the _id as string)."""

    id: str = Field(alias="_id")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Response / API models
# ---------------------------------------------------------------------------


class IngestResponse(BaseModel):
    """Response returned immediately from POST /ingest."""

    message: str
    task_id: str
    categories: list[str]
    status: str = "queued"


class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    pages: int
