from collections.abc import Callable

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .logging_config import setup_logging

logger = setup_logging()


def setup_cors(app: FastAPI, allowed_origins: list[str]) -> None:
    """Configure CORS middleware with specified allowed origins."""
    logger.info(f"Setting up CORS with allowed origins: {allowed_origins}")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )


async def request_validation_middleware(request: Request, call_next: Callable):
    """Middleware for request validation and logging."""
    try:
        logger.debug(f"Received request: {request.method} {request.url}")
        response = await call_next(request)
        logger.debug(
            f"Request completed: {request.method} {request.url} - Status: {response.status_code}"
        )
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500, content={"detail": "Internal server error"}
        )
