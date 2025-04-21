from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import Callable

def setup_cors(app: FastAPI, allowed_origins: list[str]) -> None:
    """Configure CORS middleware with specified allowed origins."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )

def setup_rate_limiter(app: FastAPI) -> Limiter:
    """Configure rate limiting middleware."""
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    return limiter

async def request_validation_middleware(request: Request, call_next: Callable) -> JSONResponse:
    """Middleware for request validation and error handling."""
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        ) 