"""Router summary using Starlette's Router."""
from fastapi import APIRouter

from app.api.endpoints import users, items

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