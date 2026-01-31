from app.db.database import SessionLocal
from app.utils.logger import logger

def get_db():
    logger.debug("Opening new DB session")
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error("Error during DB session usage", exc_info=True)
        raise
    finally:
        db.close()
        logger.debug("DB session closed")
