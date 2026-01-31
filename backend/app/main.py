import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path

from app.db.database import engine
from app.db.base import Base
from app.db import models

from app.middleware.error_handler import app_exception_handler
from app.middleware.api_key import api_key_middleware
from app.errors.app_errors import AppError

# Load env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="DocuChat AI Multimodal Q&A API")

DB_SYNC = os.getenv("DB_SYNC", "false").lower() == "true"

# CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key protection
app.middleware("http")(api_key_middleware)

@app.on_event("startup")
def on_startup():
    if DB_SYNC:
        Base.metadata.create_all(bind=engine)

# Error handling
app.add_exception_handler(AppError, app_exception_handler)
app.add_exception_handler(Exception, app_exception_handler)

@app.get("/health")
def health():
    return {"status": "ok"}

from app.routers import auth, upload, process, chat

app.include_router(auth.router)
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(process.router)
app.include_router(chat.router)
