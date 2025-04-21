import time
from functools import wraps
from fastapi import HTTPException, Request
from typing import Callable, Dict, Any
from .logging_config import setup_logging

logger = setup_logging()

class RateLimiter:
    def __init__(self, max_requests: int, time_window: int):
        """Initialize rate limiter with max requests and time window.
        
        Args:
            max_requests: Maximum number of requests allowed
            time_window: Time window in seconds
        """
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests: Dict[str, list] = {}
        logger.info(f"Rate limiter initialized with {max_requests} requests per {time_window} seconds")

    def _get_client_id(self, request: Request) -> str:
        """Get client identifier from request.
        
        Args:
            request: FastAPI request object
            
        Returns:
            str: Client identifier
        """
        return request.client.host if request.client else "unknown"

    def _cleanup_old_requests(self, client_id: str) -> None:
        """Remove old requests outside the time window.
        
        Args:
            client_id: Client identifier
        """
        current_time = time.time()
        self.requests[client_id] = [
            req_time for req_time in self.requests.get(client_id, [])
            if current_time - req_time < self.time_window
        ]

    def __call__(self, func: Callable) -> Callable:
        """Decorator to apply rate limiting to a function.
        
        Args:
            func: Function to decorate
            
        Returns:
            Callable: Decorated function
        """
        @wraps(func)
        async def wrapper(request: Request, *args: Any, **kwargs: Any) -> Any:
            client_id = self._get_client_id(request)
            logger.debug(f"Processing request from client: {client_id}")
            
            self._cleanup_old_requests(client_id)
            
            if client_id not in self.requests:
                self.requests[client_id] = []
            
            if len(self.requests[client_id]) >= self.max_requests:
                logger.warning(f"Rate limit exceeded for client: {client_id}")
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later."
                )
            
            self.requests[client_id].append(time.time())
            logger.debug(f"Request allowed for client: {client_id}. Current count: {len(self.requests[client_id])}")
            
            return await func(request, *args, **kwargs)
        
        return wrapper 