from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from fastapi import FastAPI, Request
from typing import Dict, Any

def setup_rate_limiter(app: FastAPI) -> Limiter:
    """Configure rate limiting for the application.
    
    Args:
        app: FastAPI application instance
        
    Returns:
        Limiter: Configured rate limiter instance
    """
    # Create rate limiter
    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"]
    )
    
    # Add rate limiting middleware
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)
    
    return limiter

def get_rate_limit_config() -> Dict[str, Any]:
    """Get rate limit configuration.
    
    Returns:
        Dict[str, Any]: Rate limit configuration
    """
    return {
        "default": ["200 per day", "50 per hour"],
        "query": ["100 per day", "20 per hour"],
        "history": ["500 per day", "100 per hour"]
    } 