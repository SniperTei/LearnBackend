"""Logging middleware using Starlette's middleware system."""
import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging HTTP requests and responses."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(
            f"Request: {request.method} {request.url.path} "
            f"from {request.client.host}"
        )
        # Log request params
        if request.method in ["POST", "PUT", "PATCH"]:
            body = await request.json()
            logger.info(f"Request body: {body}")
        elif request.method == "GET":
            params = dict(request.query_params)
            logger.info(f"Request params: {params}")
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            f"Response: {response.status_code} "
            f"for {request.method} {request.url.path} "
            f"in {process_time:.4f}s"
        )
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response