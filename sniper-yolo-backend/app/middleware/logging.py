import time
import json
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import StreamingResponse
import logging

logger = logging.getLogger(__name__)

def _pretty_headers(headers: dict) -> str:
    """脱敏 + 对齐打印"""
    lines = []
    for k, v in headers.items():
        if k.lower() == "authorization":
            v = v[:20] + "…" if len(v) > 20 else v
        lines.append(f"  {k:<20}: {v}")
    return "\n".join(lines)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()

        # 1. 请求头
        headers = {k.decode("utf-8"): v.decode("utf-8") for k, v in request.headers.raw}
        logger.info("→ Headers:\n%s", _pretty_headers(headers))

        # 2. 请求体
        body_bytes = await request.body()
        logger.info("→ Body: %s", body_bytes.decode() or "-")

        # 3. 重新注入 body
        async def receive():
            return {"type": "http.request", "body": body_bytes, "more_body": False}
        request._receive = receive

        # 4. 业务处理
        response = await call_next(request)

        # 5. 响应体
        resp_body = b""
        async for chunk in response.body_iterator:
            resp_body += chunk
        logger.info("← Status : %s", response.status_code)
        logger.info("← Body   : %s", resp_body.decode() or "-")

        # 6. 重新封装
        return StreamingResponse(
            iter([resp_body]),
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.media_type,
        )