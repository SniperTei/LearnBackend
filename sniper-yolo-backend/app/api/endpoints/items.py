"""物品相关API端点 - 使用统一响应格式"""
from typing import List, Optional  # 添加了Optional导入
import logging
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.item import ItemCreate, ItemOut, ItemUpdate
from app.models.user import User
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
    page: int = 1,                       # 第几页，从 1 开始
    page_size: int = 10,                 # 每页条数
    title: Optional[str] = None,         # 标题模糊查询
    description: Optional[str] = None,   # 描述模糊查询
    owner_id: Optional[str] = None,      # 所有者ID精确查询
    min_price: Optional[float] = None,   # 最低价格
    max_price: Optional[float] = None,   # 最高价格
    item_service: ItemService = Depends(get_item_service)
) -> ApiSuccessResponse:
    """获取物品列表（支持条件查询和分页）"""
    try:
        # 内部换算分页参数
        skip = (page - 1) * page_size
        limit = page_size

        logger.info(f"获取物品列表，page={page}, page_size={page_size} (skip={skip}, limit={limit}), "
                   f"title={title}, description={description}, owner_id={owner_id}, "
                   f"min_price={min_price}, max_price={max_price}")
                    
        # 使用搜索方法获取符合条件的物品
        items = await item_service.search_items(
            title=title,
            description=description,
            owner_id=owner_id,
            min_price=min_price,
            max_price=max_price,
            skip=skip,
            limit=limit
        )
        
        # 获取符合条件的物品总数
        total = await item_service.search_items_count(
            title=title,
            description=description,
            owner_id=owner_id,
            min_price=min_price,
            max_price=max_price
        )

        return ApiSuccessResponse.create(
            data={
                "items": items,
                "total": total,   # 返回所有满足条件的总条数
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
    item_id: str,
    item_service: ItemService = Depends(get_item_service)
) -> ApiSuccessResponse:
    """根据 ID 获取单个物品"""
    try:
        logger.info(f"获取物品: {item_id}")
        item = await item_service.get_item(item_id)
        if not item:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在"
            )

        # 如果已经是 dict，直接返回；否则再转一次
        data = item if isinstance(item, dict) else item.dict()

        return ApiSuccessResponse.create(
            data=data,
            msg="获取物品成功"
        )
    except Exception as e:
        logger.error(f"获取物品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


# 1. 更新物品
@router.put("/{item_id}", response_model=ApiSuccessResponse)
async def update_item(
    item_id: str,
    item: ItemCreate,
    item_service: ItemService = Depends(get_item_service),
    current_user: User = Depends(get_current_active_user)   # 取当前用户
) -> ApiSuccessResponse:
    """根据 ID 更新单个物品"""
    try:
        # 把 owner_id 传进去
        updated = await item_service.update_item(
            item_id,
            item,
            owner_id=str(current_user.id)
        )
        if not updated:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="物品不存在或无权限"
            )
        data = updated if isinstance(updated, dict) else updated.dict()
        return ApiSuccessResponse.create(data=data, msg="更新成功")
    except Exception as e:
        logger.error(f"更新物品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


# 2. 删除物品
@router.delete("/{item_id}", response_model=ApiSuccessResponse)
async def delete_item(
    item_id: str,
    item_service: ItemService = Depends(get_item_service),
    current_user: User = Depends(get_current_active_user)   # 取当前用户
) -> ApiSuccessResponse:
    """根据 ID 删除单个物品"""
    try:
        deleted = await item_service.delete_item(
            item_id,
            owner_id=str(current_user.id)   # 补上缺失的 owner_id
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