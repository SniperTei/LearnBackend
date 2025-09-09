"""物品相关API端点 - 使用统一响应格式"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.item import ItemCreate, ItemOut, ItemUpdate
from app.services.item_service import ItemService
from app.core.dependencies import get_current_active_user
from app.utils.response import success_response, error_response

router = APIRouter()


@router.post("/", response_model=dict)
async def create_item(
    item: ItemCreate,
    current_user: dict = Depends(get_current_active_user),
    item_service: ItemService = Depends()
) -> dict:
    """创建新物品"""
    try:
        new_item = await item_service.create_item(item, current_user.id)
        return success_response(data=new_item, msg="物品创建成功")
    except Exception as e:
        return error_response(
            code="B00001",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )


@router.get("/", response_model=dict)
async def read_items(
    skip: int = 0,
    limit: int = 100,
    item_service: ItemService = Depends()
) -> dict:
    """获取物品列表"""
    items = await item_service.get_items(skip=skip, limit=limit)
    return success_response(
        data={
            "items": items,
            "total": len(items),
            "skip": skip,
            "limit": limit
        },
        msg="获取物品列表成功"
    )


@router.get("/{item_id}", response_model=dict)
async def read_item(
    item_id: int,
    item_service: ItemService = Depends()
) -> dict:
    """根据ID获取物品信息"""
    item = await item_service.get_item(item_id)
    if not item:
        return error_response(
            code="B00002",
            status_code=status.HTTP_404_NOT_FOUND,
            msg="物品不存在"
        )
    return success_response(data=item, msg="获取物品信息成功")


@router.put("/{item_id}", response_model=dict)
async def update_item(
    item_id: int,
    item_update: ItemUpdate,
    current_user: dict = Depends(get_current_active_user),
    item_service: ItemService = Depends()
) -> dict:
    """更新物品信息"""
    try:
        item = await item_service.update_item(item_id, item_update, current_user.id)
        if not item:
            return error_response(
                code="B00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在"
            )
        return success_response(data=item, msg="物品信息更新成功")
    except Exception as e:
        return error_response(
            code="B00003",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )


@router.delete("/{item_id}", response_model=dict)
async def delete_item(
    item_id: int,
    current_user: dict = Depends(get_current_active_user),
    item_service: ItemService = Depends()
) -> dict:
    """删除物品"""
    try:
        success = await item_service.delete_item(item_id, current_user.id)
        if not success:
            return error_response(
                code="B00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在或无权限删除"
            )
        return success_response(msg="物品删除成功")
    except Exception as e:
        return error_response(
            code="B00004",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )