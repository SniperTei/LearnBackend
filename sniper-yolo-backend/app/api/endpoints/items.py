"""物品相关API端点 - 使用统一响应格式"""
from typing import List
import logging
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.item import ItemCreate, ItemOut, ItemUpdate
from app.services.item_service import ItemService
from app.core.dependencies import get_current_active_user, get_user_service
from app.utils.response import ApiSuccessResponse, ApiErrorResponse, ApiResponse

# 创建logger实例
logger = logging.getLogger(__name__)

router = APIRouter()

def get_item_service() -> ItemService:
    """获取物品服务实例"""
    return ItemService()


@router.post("/", response_model=ApiSuccessResponse)
async def create_item(
    item: ItemCreate,
    current_user: dict = Depends(get_current_active_user),
    item_service: ItemService = Depends(get_item_service)
) -> ApiSuccessResponse:
    """创建新物品"""
    try:
        logger.info(f"用户 {current_user.username} 尝试创建物品: {item.title}")
        new_item = await item_service.create_item(item, current_user.id)
        
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
    skip: int = 0,
    limit: int = 100,
    item_service: ItemService = Depends(get_item_service)
) -> ApiSuccessResponse:
    """获取物品列表"""
    try:
        logger.info(f"获取物品列表，skip={skip}, limit={limit}")
        items = await item_service.get_items(skip=skip, limit=limit)
        
        return ApiSuccessResponse.create(
            data={
                "items": items,
                "total": len(items),
                "skip": skip,
                "limit": limit
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
async def read_item(
    item_id: int,  # 修复参数类型从str改为int
    item_service: ItemService = Depends(get_item_service)
) -> ApiSuccessResponse:
    """获取单个物品详情"""
    try:
        logger.info(f"获取物品详情: {item_id}")
        item = await item_service.get_item(item_id)
        
        if not item:
            raise ValueError("物品不存在")
            
        return ApiSuccessResponse.create(
            data=item,
            msg="获取物品详情成功"
        )
        
    except ValueError as e:
        logger.warning(f"获取物品详情失败: {str(e)}")
        return ApiErrorResponse.create(
            code="A00004",
            status_code=status.HTTP_404_NOT_FOUND,
            msg=str(e)
        )
    except Exception as e:
        logger.error(f"获取物品详情失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.put("/{item_id}", response_model=ApiSuccessResponse)
async def update_item(
    item_id: int,
    item_update: ItemUpdate,
    current_user: dict = Depends(get_current_active_user),
    item_service: ItemService = Depends(get_item_service)
) -> ApiSuccessResponse:
    """更新物品信息"""
    try:
        logger.info(f"用户 {current_user.username} 尝试更新物品: {item_id}")
        item = await item_service.update_item(item_id, item_update, current_user.id)
        if not item:
            return ApiErrorResponse.create(
                code="B00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在"
            )
        return ApiSuccessResponse.create(
            data=item,
            msg="物品信息更新成功"
        )
    except Exception as e:
        logger.error(f"更新物品信息失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00003",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )


@router.delete("/{item_id}", response_model=ApiSuccessResponse)
async def delete_item(
    item_id: int,
    current_user: dict = Depends(get_current_active_user),
    item_service: ItemService = Depends(get_item_service)
) -> ApiSuccessResponse:
    """删除物品"""
    try:
        logger.info(f"用户 {current_user.username} 尝试删除物品: {item_id}")
        success = await item_service.delete_item(item_id, current_user.id)
        if not success:
            return ApiErrorResponse.create(
                code="B00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在或无权限删除"
            )
        return ApiSuccessResponse.create(
            msg="物品删除成功"
        )
    except Exception as e:
        logger.error(f"删除物品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00004",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )