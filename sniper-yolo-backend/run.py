"""Entry point for running the application."""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
        timeout_keep_alive=60,  # 保持连接的超时时间（秒）
        timeout_graceful_shutdown=10  # 优雅关闭的超时时间（秒）
    )
