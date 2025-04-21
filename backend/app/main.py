from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.database import Base, engine
from app.core.middleware import setup_cors, request_validation_middleware
from app.core.logging_config import setup_logging
from app.core.rate_limiting import setup_rate_limiter, get_rate_limit_config
from app.api.v1.endpoints import travel

# Configure logging
logger = setup_logging()
settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Travel Query API",
    description="API for getting travel-related information using AI",
    version="1.0.0"
)

# Get rate limit configuration
rate_limit_config = get_rate_limit_config()

# Setup middleware
limiter = setup_rate_limiter(app)
setup_cors(app, settings.allowed_origins_list)
app.middleware("http")(request_validation_middleware)

# Include routers
app.include_router(travel.router, prefix="/api/v1", tags=["travel"])

@app.get("/")
@limiter.limit(rate_limit_config["default"])
async def root(request: Request):
    """Root endpoint that returns API information."""
    logger.info("Root endpoint accessed")
    return {
        "message": "Welcome to the Travel Query API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for the application."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting application...")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    ) 