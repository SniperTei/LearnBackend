"""食品相关API端点 - 使用统一响应格式和PostgreSQL"""
from typing import List, Optional
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.food import FoodCreate, FoodOut, FoodUpdate
from app.models.user import User
from app.services.food_service import FoodService
from app.core.dependencies import get_current_active_user, get_db
from app.utils.response import ApiSuccessResponse, ApiErrorResponse, ApiResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=ApiSuccessResponse)
async def create_food(
    food: FoodCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """创建新食品记录"""
    try:
        logger.info(f"用户 {current_user.username} 尝试创建食品记录: {food.title}")
        logger.debug(f"请求参数详情: {food.model_dump()}")

        food_service = FoodService()
        new_food = await food_service.create_food(food, int(current_user.id), db)

        logger.info(f"食品记录创建成功: {new_food['title']}")

        return ApiSuccessResponse.create(
            data=new_food,
            msg="食品创建成功",
            status_code=status.HTTP_201_CREATED
        )

    except ValueError as e:
        logger.warning(f"食品创建验证失败: {str(e)}")
        return ApiErrorResponse.create(
            code="A00003",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        logger.error(f"食品创建服务器错误: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="A00099",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/", response_model=ApiSuccessResponse)
async def read_foods(
    page: int = 1,
    count: int = 10,
    title: Optional[str] = None,
    content: Optional[str] = None,
    maker: Optional[str] = None,
    min_star: Optional[float] = None,
    max_star: Optional[float] = None,
    flavor: Optional[str] = None,
    tag: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """获取食品记录列表（支持条件查询和分页）"""
    try:
        skip = (page - 1) * count
        limit = count

        logger.info(f"获取食品记录列表，page={page}, count={count}, title={title}, content={content}, maker={maker}, min_star={min_star}, max_star={max_star}, flavor={flavor}, tag={tag} (skip={skip}, limit={limit})")

        food_service = FoodService()
        foods = await food_service.search_foods(
            title=title,
            content=content,
            maker=maker,
            min_star=int(min_star) if min_star is not None else None,
            max_star=int(max_star) if max_star is not None else None,
            flavor=flavor,
            tag=tag,
            db=db,
            skip=skip,
            limit=limit
        )

        total = await food_service.search_foods_count(
            title=title,
            content=content,
            maker=maker,
            min_star=int(min_star) if min_star is not None else None,
            max_star=int(max_star) if max_star is not None else None,
            flavor=flavor,
            tag=tag,
            db=db
        )

        return ApiSuccessResponse.create(
            data={
                "foods": foods,
                "total": total,
                "page": page,
                "count": count
            },
            msg="获取食品列表成功"
        )

    except Exception as e:
        logger.error(f"获取食品列表失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/{food_id}", response_model=ApiSuccessResponse)
async def get_food(
    food_id: int,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 获取单个食品"""
    try:
        logger.info(f"获取食品: {food_id}")
        food_service = FoodService()
        food = await food_service.get_food(food_id, db)
        if not food:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="食品不存在"
            )

        return ApiSuccessResponse.create(
            data=food,
            msg="获取食品成功"
        )
    except Exception as e:
        logger.error(f"获取食品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.put("/{food_id}", response_model=ApiSuccessResponse)
async def update_food(
    food_id: int,
    food: FoodUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 更新单个食品"""
    try:
        food_service = FoodService()
        updated = await food_service.update_food(
            food_id,
            food,
            int(current_user.id),
            db
        )
        if not updated:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="食品不存在"
            )
        return ApiSuccessResponse.create(data=updated, msg="更新成功")
    except Exception as e:
        logger.error(f"更新食品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.delete("/{food_id}", response_model=ApiSuccessResponse)
async def delete_food(
    food_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 删除单个食品"""
    try:
        food_service = FoodService()
        deleted = await food_service.delete_food(food_id, db)
        if not deleted:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="食品不存在"
            )
        return ApiSuccessResponse.create(data=None, msg="删除成功")
    except Exception as e:
        logger.error(f"删除食品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )
