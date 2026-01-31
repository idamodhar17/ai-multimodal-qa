from fastapi import Request
from fastapi.responses import JSONResponse
from app.errors.app_errors import AppError
from app.utils.logger import logger


async def app_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, AppError):
        logger.warning(
            f"{exc.status_code} - {exc.message} - {request.method} {request.url}"
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message},
        )

    logger.error(
        f"Unhandled error - {request.method} {request.url}",
        exc_info=True,
    )

    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )
