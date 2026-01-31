import os
from fastapi import FastAPI
from dotenv import load_dotenv
from pathlib import Path

from app.db.database import engine
from app.db.base import Base
from app.db import models

from app.middleware.error_handler import app_exception_handler
from app.errors.app_errors import AppError

# Load environment variables
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

# App init
app = FastAPI(title="DocuChat AI Multimodal Q&A API")

# Database sync
DB_SYNC = os.getenv("DB_SYNC", "false").lower() == "true"

@app.on_event("startup")
def on_startup():
    if DB_SYNC:
        Base.metadata.create_all(bind=engine)

# Global error handling
app.add_exception_handler(AppError, app_exception_handler)
app.add_exception_handler(Exception, app_exception_handler)

# Health check
@app.get("/health")
def health():
    return {"status": "ok"}

# Routers
from app.routers import auth, upload, process, chat

app.include_router(auth.router)
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(process.router)
app.include_router(chat.router)
