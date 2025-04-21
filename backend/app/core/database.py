from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import get_settings
from .logging_config import setup_logging

logger = setup_logging()
settings = get_settings()

logger.info(f"Creating database engine with URL: {settings.DATABASE_URL}")
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Get database session with proper cleanup."""
    db = SessionLocal()
    try:
        logger.debug("Database session created")
        yield db
    except Exception as e:
        logger.error(f"Database error: {str(e)}", exc_info=True)
        raise
    finally:
        logger.debug("Closing database session")
        db.close()
