"""
Database cleanup service to keep MongoDB usage under limits.
"""
from app.database import get_db
from app.utils.logger import get_logger

logger = get_logger(__name__)

async def cleanup_database_if_needed():
    """
    Checks database size and removes oldest articles in batches
    if size exceeds 350MB, until size drops below 300MB.
    """
    db = get_db()
    limit_bytes = 367001600  # 350MB
    target_bytes = 314572800 # 300MB
    
    try:
        stats = await db.command("dbStats")
        data_size = stats.get("dataSize", 0)
        
        if data_size > limit_bytes:
            logger.info("Database size %.2f MB exceeds limit of 350 MB. Starting cleanup.", data_size / (1024 * 1024))
            total_deleted = 0
            
            while data_size > target_bytes:
                # Find 50 oldest raw articles based on published_at
                cursor = db["raw_data"].find({}, {"_id": 1}).sort("published_at", 1).limit(50)
                oldest = await cursor.to_list(length=50)
                
                if not oldest:
                    break
                    
                ids_to_delete = [doc["_id"] for doc in oldest]
                
                # Delete from raw_data
                await db["raw_data"].delete_many({"_id": {"$in": ids_to_delete}})
                
                # Delete from processed_data
                str_ids = [str(obj_id) for obj_id in ids_to_delete]
                await db["processed_data"].delete_many({"raw_id": {"$in": str_ids}})
                
                total_deleted += len(ids_to_delete)
                
                # Re-check size
                stats = await db.command("dbStats")
                data_size = stats.get("dataSize", 0)
                
            logger.info("Cleanup finished. Deleted %d articles. New DB size: %.2f MB.", total_deleted, data_size / (1024 * 1024))
    except Exception as e:
        logger.error("Error during database cleanup: %s", e)
