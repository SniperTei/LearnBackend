"""FastAPI实例创建 - 使用统一响应格式"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

from app.core.config import settings
from app.api.router import api_router
from app.core.security import SecurityHeadersMiddleware
from app.middleware.logging import LoggingMiddleware
from app.middleware.cors import setup_cors
from app.utils.response import ApiSuccessResponse, ApiErrorResponse
from app.core.database import Database

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# 创建FastAPI应用
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    redirect_slashes=False,
)

# 添加中间件
app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
setup_cors(app)

# 包含API路由
app.include_router(api_router, prefix=settings.API_V1_STR)


# 全局异常处理器
# 导入 JSONResponse
from fastapi.responses import JSONResponse

# 修改 HTTP 异常处理器
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """HTTP异常处理"""
    error_mapping = {
        400: "C00400",
        401: "C00401",
        403: "C00403",
        404: "C00404",
        422: "C00422",
        500: "B00500",
    }
    code = error_mapping.get(exc.status_code, "Z09999")
    logger.error(f"HTTP异常: {code} - {exc.detail}")
    
    error_response = ApiErrorResponse.create(
        code=code,
        status_code=exc.status_code,
        msg=exc.detail or "请求处理失败"
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )

# 同样修改其他异常处理器
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """验证异常处理"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": error.get("loc", [""])[-1],
            "message": error.get("msg", ""),
            "type": error.get("type", "")
        })
    
    error_response = ApiErrorResponse.create(
        code="A00007",
        status_code=422,
        msg="请求参数验证失败"
    )
    
    return JSONResponse(
        status_code=422,
        content=error_response.model_dump()
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理"""
    logger.error(f"未处理的异常: {str(exc)}", exc_info=True)
    
    error_response = ApiErrorResponse.create(
        code="A00099",
        status_code=500,
        msg="服务器内部错误"
    )
    
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump()
    )

@app.on_event("startup")
async def startup_event():
    # 连接数据库
    """应用启动时连接MongoDB"""
    await Database.connect()
    if await Database.ping():
        logger.info("MongoDB连接正常")
    else:
        logger.error("MongoDB连接异常")
    """应用启动事件"""
    logger.info("Starting Sniper YOLO Backend...")
    logger.info(f"Environment: {settings.DEBUG and 'Development' or 'Production'}")
    logger.info(f"Server running on http://{settings.HOST}:{settings.PORT}")


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭事件"""
    await Database.close()
    logger.info("MongoDB连接已关闭")
    logger.info("Shutting down Sniper YOLO Backend...")


@app.get("/")
async def root():
    """根端点"""
    return ApiSuccessResponse.create(
        data={
            "message": "Welcome to Sniper YOLO Backend",
            "version": settings.VERSION,
            "docs": f"{settings.API_V1_STR}/docs"
        },
        msg="服务运行正常"
    )


@app.get("/health")
async def health_check():
    """健康检查端点"""
    return ApiSuccessResponse.create(
        data={
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION
        },
        msg="服务健康"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )