"""饮品相关API端点 - 使用统一响应格式和PostgreSQL"""
from typing import List, Optional
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.drink import DrinkCreate, DrinkOut, DrinkUpdate
from app.models.user import User
from app.services.drink_service import DrinkService
from app.core.dependencies import get_current_active_user, get_db
from app.utils.response import ApiSuccessResponse, ApiErrorResponse, ApiResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=ApiSuccessResponse)
async def create_drink(
    drink: DrinkCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """创建新饮品记录"""
    try:
        logger.info(f"用户 {current_user.username} 尝试创建饮品记录: {drink.title}")
        logger.debug(f"请求参数详情: {drink.model_dump()}")

        drink_service = DrinkService()
        new_drink = await drink_service.create_drink(drink, int(current_user.id), db)

        logger.info(f"饮品记录创建成功: {new_drink['title']}")

        return ApiSuccessResponse.create(
            data=new_drink,
            msg="饮品创建成功",
            status_code=status.HTTP_201_CREATED
        )

    except ValueError as e:
        logger.warning(f"饮品创建验证失败: {str(e)}")
        return ApiErrorResponse.create(
            code="A00003",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        logger.error(f"饮品创建服务器错误: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="A00099",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/", response_model=ApiSuccessResponse)
async def read_drinks(
    page: int = 1,
    count: int = 10,
    title: Optional[str] = None,
    content: Optional[str] = None,
    brand: Optional[str] = None,
    min_star: Optional[float] = None,
    max_star: Optional[float] = None,
    flavor: Optional[str] = None,
    drink_type: Optional[str] = None,
    sweetness: Optional[str] = None,
    ice: Optional[str] = None,
    tag: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """获取饮品记录列表（支持条件查询和分页）"""
    try:
        skip = (page - 1) * count
        limit = count

        logger.info(f"获取饮品记录列表，page={page}, count={count}, title={title}, content={content}, brand={brand}, min_star={min_star}, max_star={max_star}, flavor={flavor}, drink_type={drink_type}, sweetness={sweetness}, ice={ice}, tag={tag} (skip={skip}, limit={limit})")

        drink_service = DrinkService()
        drinks = await drink_service.search_drinks(
            title=title,
            content=content,
            brand=brand,
            min_star=int(min_star) if min_star is not None else None,
            max_star=int(max_star) if max_star is not None else None,
            flavor=flavor,
            drink_type=drink_type,
            sweetness=sweetness,
            ice=ice,
            tag=tag,
            db=db,
            skip=skip,
            limit=limit
        )

        total = await drink_service.search_drinks_count(
            title=title,
            content=content,
            brand=brand,
            min_star=int(min_star) if min_star is not None else None,
            max_star=int(max_star) if max_star is not None else None,
            flavor=flavor,
            drink_type=drink_type,
            sweetness=sweetness,
            ice=ice,
            tag=tag,
            db=db
        )

        return ApiSuccessResponse.create(
            data={
                "drinks": drinks,
                "total": total,
                "page": page,
                "count": count
            },
            msg="获取饮品列表成功"
        )

    except Exception as e:
        logger.error(f"获取饮品列表失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/{drink_id}", response_model=ApiSuccessResponse)
async def get_drink(
    drink_id: int,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 获取单个饮品"""
    try:
        logger.info(f"获取饮品: {drink_id}")
        drink_service = DrinkService()
        drink = await drink_service.get_drink(drink_id, db)
        if not drink:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饮品不存在"
            )

        return ApiSuccessResponse.create(
            data=drink,
            msg="获取饮品成功"
        )
    except Exception as e:
        logger.error(f"获取饮品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.put("/{drink_id}", response_model=ApiSuccessResponse)
async def update_drink(
    drink_id: int,
    drink: DrinkUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 更新单个饮品"""
    try:
        drink_service = DrinkService()
        updated = await drink_service.update_drink(
            drink_id,
            drink,
            int(current_user.id),
            db
        )
        if not updated:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饮品不存在"
            )
        return ApiSuccessResponse.create(data=updated, msg="更新成功")
    except Exception as e:
        logger.error(f"更新饮品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.delete("/{drink_id}", response_model=ApiSuccessResponse)
async def delete_drink(
    drink_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 删除单个饮品"""
    try:
        drink_service = DrinkService()
        deleted = await drink_service.delete_drink(drink_id, db)
        if not deleted:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饮品不存在"
            )
        return ApiSuccessResponse.create(data=None, msg="删除成功")
    except Exception as e:
        logger.error(f"删除饮品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )
