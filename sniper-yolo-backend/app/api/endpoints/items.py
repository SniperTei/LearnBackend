"""物品相关API端点 - 使用统一响应格式和PostgreSQL"""
from typing import List, Optional
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.item import ItemCreate, ItemOut, ItemUpdate
from app.models.user import User
from app.services.item_service import ItemService
from app.core.dependencies import get_current_active_user, get_db
from app.utils.response import ApiSuccessResponse, ApiErrorResponse, ApiResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=ApiSuccessResponse)
async def create_item(
    item: ItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """创建新物品"""
    try:
        logger.info(f"用户 {current_user.username} 尝试创建物品: {item.title}")
        item_service = ItemService()
        new_item = await item_service.create_item(item, int(current_user.id), db)

        logger.info(f"物品创建成功: {new_item['title']}")

        return ApiSuccessResponse.create(
            data=new_item,
            msg="物品创建成功",
            status_code=status.HTTP_201_CREATED
        )

    except ValueError as e:
        logger.warning(f"物品创建验证失败: {str(e)}")
        return ApiErrorResponse.create(
            code="A00003",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        logger.error(f"物品创建服务器错误: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/", response_model=ApiSuccessResponse)
async def read_items(
    page: int = 1,
    page_size: int = 10,
    title: Optional[str] = None,
    description: Optional[str] = None,
    owner_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """获取物品列表（支持条件查询和分页）"""
    try:
        skip = (page - 1) * page_size
        limit = page_size

        logger.info(f"获取物品列表，page={page}, page_size={page_size} (skip={skip}, limit={limit}), "
                   f"title={title}, description={description}, owner_id={owner_id}, "
                   f"min_price={min_price}, max_price={max_price}")

        item_service = ItemService()
        items = await item_service.search_items(
            title=title,
            description=description,
            owner_id=owner_id,
            min_price=min_price,
            max_price=max_price,
            db=db,
            skip=skip,
            limit=limit
        )

        total = await item_service.search_items_count(
            title=title,
            description=description,
            owner_id=owner_id,
            min_price=min_price,
            max_price=max_price,
            db=db
        )

        return ApiSuccessResponse.create(
            data={
                "items": items,
                "total": total,
                "page": page,
                "page_size": page_size
            },
            msg="获取物品列表成功"
        )

    except Exception as e:
        logger.error(f"获取物品列表失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/{item_id}", response_model=ApiSuccessResponse)
async def get_item(
    item_id: int,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 获取单个物品"""
    try:
        logger.info(f"获取物品: {item_id}")
        item_service = ItemService()
        item = await item_service.get_item(item_id, db)
        if not item:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在"
            )

        return ApiSuccessResponse.create(
            data=item,
            msg="获取物品成功"
        )
    except Exception as e:
        logger.error(f"获取物品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.put("/{item_id}", response_model=ApiSuccessResponse)
async def update_item(
    item_id: int,
    item: ItemUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 更新单个物品"""
    try:
        item_service = ItemService()
        updated = await item_service.update_item(
            item_id,
            item,
            int(current_user.id),
            db
        )
        if not updated:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在或无权限"
            )
        return ApiSuccessResponse.create(data=updated, msg="更新成功")
    except Exception as e:
        logger.error(f"更新物品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.delete("/{item_id}", response_model=ApiSuccessResponse)
async def delete_item(
    item_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 删除单个物品"""
    try:
        item_service = ItemService()
        deleted = await item_service.delete_item(
            item_id,
            int(current_user.id),
            db
        )
        if not deleted:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在或无权限"
            )
        return ApiSuccessResponse.create(data=None, msg="删除成功")
    except Exception as e:
        logger.error(f"删除物品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )
