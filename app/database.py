"""
Async MongoDB client using Motor.
Provides a single shared database instance for the whole application.
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    """Open the Motor client connection (called on app startup)."""
    global _client, _db
    logger.info("Connecting to MongoDB Atlas...")
    _client = AsyncIOMotorClient(settings.mongodb_url)
    _db = _client[settings.db_name]
    try:
        # Verify connection
        await _db.command("ping")
        logger.info("MongoDB connection established. DB: %s", settings.db_name)

        # Create indexes for performance
        await _db["raw_data"].create_index("published_at")
        await _db["raw_data"].create_index("category")
        await _db["raw_data"].create_index([("title", "text"), ("content", "text")])
        await _db["processed_data"].create_index("processed_at")
        await _db["processed_data"].create_index("sentiment")
        # Drop existing single-field text index if it exists to allow multi-field index
        try:
            await _db["processed_data"].drop_index("title_text")
        except Exception:
            pass
            
        await _db["processed_data"].create_index([("title", "text"), ("content", "text")])
        logger.info("MongoDB indexes ensured.")
    except Exception as exc:
        logger.warning("Could not ping MongoDB: %s", exc)


async def close_db() -> None:
    """Close Motor client connection (called on app shutdown)."""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed.")


def get_db() -> AsyncIOMotorDatabase:
    """Return the active database instance."""
    if _db is None:
        raise RuntimeError("Database not initialized. Call connect_db() first.")
    return _db
