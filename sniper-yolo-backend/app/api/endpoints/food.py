"""食品相关API端点 - 使用统一响应格式"""
from typing import List, Optional
import logging
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.food import FoodCreate, FoodOut, FoodUpdate
from app.models.user import User
from app.services.food_service import FoodService
from app.core.dependencies import get_current_active_user
from app.utils.response import ApiSuccessResponse, ApiErrorResponse, ApiResponse

# 创建logger实例
logger = logging.getLogger(__name__)

router = APIRouter()

def get_food_service() -> FoodService:
    """获取食品服务实例"""
    return FoodService()


@router.post("/", response_model=ApiSuccessResponse)
async def create_food(
    food: FoodCreate,
    current_user: dict = Depends(get_current_active_user),
    food_service: FoodService = Depends(get_food_service)
) -> ApiSuccessResponse:
    """创建新食品记录"""
    try:
        logger.info(f"用户 {current_user.username} 尝试创建食品记录: {food.title}")
        # 添加详细的请求参数日志
        logger.debug(f"请求参数详情: {food.model_dump()}")
        
        new_food = await food_service.create_food(food, str(current_user.id))
        
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
    page: int = 1,                       # 第几页，从 1 开始
    count: int = 10,                     # 每页条数
    title: Optional[str] = None,         # 标题模糊查询
    content: Optional[str] = None,       # 内容模糊查询
    maker: Optional[str] = None,         # 制作者精确查询
    min_star: Optional[int] = None,      # 最低评分
    max_star: Optional[int] = None,      # 最高评分
    flavor: Optional[str] = None,        # 口味精确查询
    tag: Optional[str] = None,           # 标签包含查询
    food_service: FoodService = Depends(get_food_service)
) -> ApiSuccessResponse:
    """获取食品记录列表（支持条件查询和分页）"""
    try:
        # 内部换算
        skip = (page - 1) * count
        limit = count

        logger.info(f"获取食品记录列表，page={page}, count={count}, title={title}, content={content}, maker={maker}, min_star={min_star}, max_star={max_star}, flavor={flavor}, tag={tag} (skip={skip}, limit={limit})")
        
        # 调用带条件查询的服务方法
        foods = await food_service.search_foods(
            title=title,
            content=content,
            maker=maker,
            min_star=min_star,
            max_star=max_star,
            flavor=flavor,
            tag=tag,
            skip=skip,
            limit=limit
        )
        
        # 获取满足条件的总条数
        total = await food_service.search_foods_count(
            title=title,
            content=content,
            maker=maker,
            min_star=min_star,
            max_star=max_star,
            flavor=flavor,
            tag=tag
        )

        return ApiSuccessResponse.create(
            data={
                "foods": foods,
                "total": total,   # 返回所有满足条件的总条数
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
    food_id: str,
    food_service: FoodService = Depends(get_food_service)
) -> ApiSuccessResponse:
    """根据 ID 获取单个食品"""
    try:
        logger.info(f"获取食品: {food_id}")
        food = await food_service.get_food(food_id)
        if not food:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="食品不存在"
            )

        # 如果已经是 dict，直接返回；否则再转一次
        data = food if isinstance(food, dict) else food.dict()

        return ApiSuccessResponse.create(
            data=data,
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
    food_id: str,
    food: FoodUpdate,
    food_service: FoodService = Depends(get_food_service),
    current_user: User = Depends(get_current_active_user)   # 取当前用户
) -> ApiSuccessResponse:
    """根据 ID 更新单个食品"""
    try:
        # 把 updated_by 传进去
        updated = await food_service.update_food(
            food_id,
            food,
            updated_by=str(current_user.id)
        )
        if not updated:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="食品不存在"
            )
        data = updated if isinstance(updated, dict) else updated.dict()
        return ApiSuccessResponse.create(data=data, msg="更新成功")
    except Exception as e:
        logger.error(f"更新食品失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.delete("/{food_id}", response_model=ApiSuccessResponse)
async def delete_food(
    food_id: str,
    food_service: FoodService = Depends(get_food_service),
    current_user: User = Depends(get_current_active_user)   # 取当前用户
) -> ApiSuccessResponse:
    """根据 ID 删除单个食品"""
    try:
        deleted = await food_service.delete_food(food_id)
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