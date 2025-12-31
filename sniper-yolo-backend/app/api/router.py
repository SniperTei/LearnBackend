"""Router summary using Starlette's Router."""
from fastapi import APIRouter

from app.api.endpoints import users, items, food, upload, enjoy # 导入enjoy模块

api_router = APIRouter(redirect_slashes=False)

# Include routers
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"]
)

api_router.include_router(
    items.router,
    prefix="/items",
    tags=["items"]
)

# 添加food路由
api_router.include_router(
    food.router,
    prefix="/foods",
    tags=["foods"]
)

# 添加上传路由
api_router.include_router(
    upload.router,
    prefix="/upload", 
    tags=["upload"]
)

# 添加enjoy路由
api_router.include_router(
    enjoy.router,
    prefix="/enjoys",
    tags=["enjoys"]
)

# 添加drink路由
# api_router.include_router(
#     drink.router,
#     prefix="/drinks",
#     tags=["drinks"]
# )