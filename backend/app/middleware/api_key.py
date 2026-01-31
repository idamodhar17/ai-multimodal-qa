import os
from fastapi import Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("X_API_KEY")


async def api_key_middleware(request: Request, call_next):

    if not API_KEY:
        return JSONResponse(
            status_code=500,
            content={"error": "Server API key not configured"},
        )

    client_key = request.headers.get("x-api-key")

    if client_key != API_KEY:
        return JSONResponse(
            status_code=401,
            content={"error": "Invalid or missing API key"},
        )

    return await call_next(request)
