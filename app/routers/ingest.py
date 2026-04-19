"""
POST /ingest — Trigger news ingestion pipeline.

Uses FastAPI BackgroundTasks (Advanced Feature #1) so the HTTP response
is returned immediately while data fetching + processing runs asynchronously.
"""
import uuid
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, BackgroundTasks, Query
from fastapi.responses import JSONResponse

from app.database import get_db
from app.utils.logger import get_logger
from app.models.raw import IngestResponse
from app.services.ingestion import fetch_news
from app.services.processing import process_articles

router = APIRouter(prefix="/ingest", tags=["Ingestion"])
logger = get_logger(__name__)


async def _run_ingestion_pipeline(task_id: str, categories: list[str]) -> None:
    """
    Background task: fetch → store raw → process → store processed.
    Deduplication checks exact URL or 80% title similarity. Merges better content.
    """
    logger.info("[task=%s] Starting ingestion for categories: %s", task_id, categories)
    db = get_db()

    try:
        # 1. Fetch from NewsAPI
        raw_articles = await fetch_news(categories=categories)
        if not raw_articles:
            logger.warning("[task=%s] No articles fetched.", task_id)
            return

        # 2. Store raw articles (skip duplicates or merge)
        raw_ids: list[tuple[str, object]] = []  # (str_id, RawArticle)
        inserted_count = 0
        merged_count = 0
        skipped_count = 0

        # Fetch existing docs for deduplication
        cursor = db["raw_data"].find({}, {"_id": 1, "title": 1, "url": 1, "content": 1})
        existing_docs = await cursor.to_list(length=None)

        for article in raw_articles:
            is_duplicate = False
            matched_doc = None
            
            # Check duplicate by URL
            if article.url:
                for doc in existing_docs:
                    if doc.get("url") == article.url:
                        is_duplicate = True
                        matched_doc = doc
                        break
            
            # Check duplicate by similar title (80% words match)
            if not is_duplicate and article.title:
                new_words = set(article.title.lower().split())
                if new_words:
                    for doc in existing_docs:
                        existing_title = doc.get("title") or ""
                        existing_words = set(existing_title.lower().split())
                        if not existing_words:
                            continue
                            
                        overlap = len(new_words.intersection(existing_words))
                        if overlap / len(new_words) >= 0.8:
                            is_duplicate = True
                            matched_doc = doc
                            break

            if is_duplicate and matched_doc:
                existing_content = matched_doc.get("content") or ""
                new_content = article.content or ""
                
                needs_update = False
                update_fields = {}
                
                if not existing_content and new_content:
                    needs_update = True
                    update_fields["content"] = new_content
                elif len(new_content) > len(existing_content):
                    needs_update = True
                    update_fields["content"] = new_content
                    
                if needs_update:
                    await db["raw_data"].update_one(
                        {"_id": matched_doc["_id"]}, 
                        {"$set": update_fields}
                    )
                    matched_doc["content"] = new_content
                    logger.info("Duplicate merged: %s", article.title)
                    merged_count += 1
                else:
                    logger.info("Duplicate skipped: %s", article.title)
                    skipped_count += 1
                continue

            doc = article.model_dump()
            result = await db["raw_data"].insert_one(doc)
            
            # Add to existing docs cache to deduplicate within the same batch
            doc["_id"] = result.inserted_id
            existing_docs.append(doc)
            
            raw_id = str(result.inserted_id)
            raw_ids.append((raw_id, article))
            inserted_count += 1

        logger.info(
            "[task=%s] Inserted %d new, merged %d, skipped %d duplicates.",
            task_id,
            inserted_count,
            merged_count,
            skipped_count,
        )

        if not raw_ids:
            logger.info("[task=%s] No new articles to process.", task_id)
            return

        # 3. Process articles
        processed = process_articles(raw_ids)

        # 4. Store processed articles
        if processed:
            processed_docs = [p.model_dump() for p in processed]
            result = await db["processed_data"].insert_many(processed_docs)
            logger.info(
                "[task=%s] Inserted %d processed articles.",
                task_id,
                len(result.inserted_ids),
            )

        logger.info("[task=%s] Ingestion pipeline completed successfully.", task_id)

    except Exception as exc:
        logger.exception("[task=%s] Ingestion pipeline failed: %s", task_id, exc)


@router.post("", response_model=IngestResponse, status_code=202)
async def trigger_ingestion(
    background_tasks: BackgroundTasks,
    categories: list[str] = Query(
        default=["business", "technology", "science"],
        description="News categories to ingest (e.g. business, technology, science, health)",
    ),
) -> IngestResponse:
    """
    Trigger a news ingestion pipeline in the background.

    Returns immediately with a task ID. The actual fetching and processing
    happens asynchronously via FastAPI BackgroundTasks.
    """
    task_id = str(uuid.uuid4())
    logger.info("Ingestion requested. task_id=%s categories=%s", task_id, categories)

    background_tasks.add_task(_run_ingestion_pipeline, task_id, categories)

    return IngestResponse(
        message="Ingestion pipeline started in the background.",
        task_id=task_id,
        categories=categories,
        status="queued",
    )
