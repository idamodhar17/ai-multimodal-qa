import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from pathlib import Path

from app.utils.logger import logger

# Load environment variables
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

logger.info("Loading database configuration")

DATABASE_URL = os.getenv("SUPABASE_DB_URL")

if not DATABASE_URL:
    logger.critical("SUPABASE_DB_URL not set in environment")
    raise RuntimeError("SUPABASE_DB_URL not set")

# Create SQLAlchemy engine
logger.info("Creating database engine")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

logger.info("Database engine created successfully")

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

logger.info("Database session factory initialized")
