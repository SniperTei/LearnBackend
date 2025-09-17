"""Router summary using Starlette's Router."""
from fastapi import APIRouter

from app.api.endpoints import users, items, food  # 导入food路由

api_router = APIRouter()

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