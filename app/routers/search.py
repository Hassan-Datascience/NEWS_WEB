"""
GET /search — Full-text keyword search across processed articles.
"""
import math
from fastapi import APIRouter, Query, HTTPException

from app.database import get_db
from app.utils.logger import get_logger
from app.models.processed import ProcessedArticleOut, SearchResponse

router = APIRouter(prefix="/search", tags=["Search"])
logger = get_logger(__name__)


def _serialize_doc(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("", response_model=SearchResponse)
async def search(
    q: str = Query(..., min_length=1, max_length=200, description="Search keyword or phrase"),
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=100, description="Items per page"),
) -> SearchResponse:
    """
    Search processed articles by keyword or phrase.

    Performs a MongoDB text search on `title` and `content` fields.
    Results are sorted by relevance score.

    - **q**: search term (required)
    - **page** / **limit**: pagination controls
    """
    logger.info("GET /search?q=%s page=%d limit=%d", q, page, limit)
    db = get_db()
    skip = (page - 1) * limit

    # 1. Try MongoDB $text search first
    try:
        text_query = {"$text": {"$search": q}}
        total = await db["processed_data"].count_documents(text_query)
        
        if total > 0:
            cursor = (
                db["processed_data"]
                .find(text_query, {"score": {"$meta": "textScore"}})
                .sort([("score", {"$meta": "textScore"})])
                .skip(skip)
                .limit(limit)
            )
            raw_docs = await cursor.to_list(length=limit)
            docs = [ProcessedArticleOut(**_serialize_doc(d)) for d in raw_docs]
            logger.info("Text search '%s' returned %d results.", q, total)
            return SearchResponse(query=q, data=docs, page=page, limit=limit, total=total, pages=math.ceil(total / limit))
    except Exception as e:
        logger.warning("Text search failed, falling back to regex: %s", e)

    # 2. Fallback to Regex search if text search is 0 or fails
    logger.info("Performing regex fallback search for '%s'", q)
    regex_query = {
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
            {"summary": {"$regex": q, "$options": "i"}}
        ]
    }
    
    total = await db["processed_data"].count_documents(regex_query)
    pages = math.ceil(total / limit) if total else 1
    
    cursor = (
        db["processed_data"]
        .find(regex_query)
        .sort([("processed_at", -1)])
        .skip(skip)
        .limit(limit)
    )
    raw_docs = await cursor.to_list(length=limit)
    docs = [ProcessedArticleOut(**_serialize_doc(d)) for d in raw_docs]
    
    return SearchResponse(query=q, data=docs, page=page, limit=limit, total=total, pages=pages)
