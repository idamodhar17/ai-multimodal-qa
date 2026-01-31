import os
from pathlib import Path

from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from supabase import create_client
from dotenv import load_dotenv

from app.utils.logger import logger
from app.errors.app_errors import (
    BadRequestError,
    UnauthorizedError,
)

# Load Env
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    logger.critical("Supabase auth env vars not set")
    raise RuntimeError("Supabase auth env vars not set")

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
security = HTTPBearer(auto_error=False)

router = APIRouter(prefix="/auth", tags=["Auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Register User
@router.post("/register")
def register_user(payload: RegisterRequest):
    logger.info(f"Register attempt for {payload.email}")

    response = supabase.auth.sign_up(
        {
            "email": payload.email,
            "password": payload.password,
        }
    )

    if response.user is None:
        raise BadRequestError("Registration failed")

    return {
        "message": "User registered successfully",
        "user": response.user,
    }

# Login
@router.post("/login")
def login_user(payload: LoginRequest):
    logger.info(f"Login attempt for {payload.email}")

    response = supabase.auth.sign_in_with_password(
        {
            "email": payload.email,
            "password": payload.password,
        }
    )

    if response.session is None:
        raise UnauthorizedError("Invalid credentials")

    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user": response.user,
    }

# Get Current User Token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    if credentials is None:
        raise UnauthorizedError("AUTH_HEADER_MISSING")

    token = credentials.credentials

    try:
        response = supabase.auth.get_user(token)
    except Exception:
        raise UnauthorizedError("TOKEN_EXPIRED")

    if response.user is None:
        raise UnauthorizedError("TOKEN_INVALID")

    return response.user
