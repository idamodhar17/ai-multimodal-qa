import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

from app.utils.logger import logger

# Load Env
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    logger.critical("Supabase service role env vars not set")
    raise RuntimeError("Supabase environment variables not set")

# Create Supabase client
supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)

logger.info("Supabase service client initialized")
