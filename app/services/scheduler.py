"""
Background scheduler using APScheduler to periodically fetch new articles.
Runs every 10 minutes by default.
"""
import uuid
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.utils.logger import get_logger
from app.routers.ingest import _run_ingestion_pipeline
from app.services.db_cleanup import cleanup_database_if_needed

logger = get_logger(__name__)
scheduler = AsyncIOScheduler()

async def scheduled_ingestion():
    """Task to trigger the ingestion pipeline automatically."""
    task_id = f"auto-{str(uuid.uuid4())[:8]}"
    categories = ["business", "technology", "science", "general"]
    logger.info("[scheduler] Starting scheduled ingestion task: %s", task_id)
    await _run_ingestion_pipeline(task_id, categories)
    
    # Run DB cleanup after ingestion
    logger.info("[scheduler] Running database cleanup check...")
    await cleanup_database_if_needed()

def start_scheduler():
    """Initialize and start the background scheduler."""
    if not scheduler.running:
        # Add job to run every 10 minutes
        scheduler.add_job(scheduled_ingestion, 'interval', minutes=10, id='news_ingestion')
        scheduler.start()
        logger.info("[scheduler] Background news ingestion scheduler started (Interval: 10m)")

def stop_scheduler():
    """Shutdown the background scheduler."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("[scheduler] Background news ingestion scheduler stopped.")
