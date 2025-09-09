"""Logging middleware using Starlette's middleware system."""
import time
import logging
import json
import asyncio
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging HTTP requests and responses without consuming the body stream."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request basic info
        logger.info(
            f"Request: {request.method} {request.url.path} "
            f"from {request.client.host}"
        )
        
        # Log request params
        # if request.method == "GET":
        #     params = dict(request.query_params)
        #     logger.info(f"Request params: {params}")
        # elif request.method in ["POST", "PUT", "PATCH"]:
        #     # 使用缓存的方式读取请求体而不消耗流
        #     # 注意：这种方法只适用于开发环境的日志记录，生产环境可能需要更复杂的处理
        #     try:
        #         # 使用asyncio.shield来确保不会干扰原始请求处理
        #         body_bytes = await asyncio.shield(request.body())
        #         if body_bytes:
        #             try:
        #                 body = json.loads(body_bytes.decode())
        #                 logger.info(f"Request body: {body}")
        #             except json.JSONDecodeError:
        #                 logger.warning("Request body is not valid JSON")
        #     except Exception as e:
        #         logger.warning(f"Failed to log request body: {str(e)}")
        
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