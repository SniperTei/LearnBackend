"""饭店相关API端点 - 使用统一响应格式"""
from typing import List, Optional
import logging
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.enjoy import EnjoyCreate, EnjoyOut, EnjoyUpdate
from app.models.user import User
from app.services.enjoy_service import EnjoyService
from app.core.dependencies import get_current_active_user
from app.utils.response import ApiSuccessResponse, ApiErrorResponse, ApiResponse

# 创建logger实例
logger = logging.getLogger(__name__)

router = APIRouter()

def get_enjoy_service() -> EnjoyService:
    """获取饭店服务实例"""
    return EnjoyService()


@router.post("/", response_model=ApiSuccessResponse)
async def create_enjoy(
    enjoy: EnjoyCreate,
    current_user: dict = Depends(get_current_active_user),
    enjoy_service: EnjoyService = Depends(get_enjoy_service)
) -> ApiSuccessResponse:
    """创建新饭店记录"""
    try:
        logger.info(f"用户 {current_user.username} 尝试创建饭店记录: {enjoy.title}")
        # 添加详细的请求参数日志
        logger.debug(f"请求参数详情: {enjoy.model_dump()}")
        
        new_enjoy = await enjoy_service.create_enjoy(enjoy, str(current_user.id))
        
        logger.info(f"饭店记录创建成功: {new_enjoy['title']}")
        
        return ApiSuccessResponse.create(
            data=new_enjoy,
            msg="饭店创建成功",
            status_code=status.HTTP_201_CREATED
        )
        
    except ValueError as e:
        logger.warning(f"饭店创建验证失败: {str(e)}")
        return ApiErrorResponse.create(
            code="A00003",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        logger.error(f"饭店创建服务器错误: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="A00099",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/", response_model=ApiSuccessResponse)
async def read_enjoys(
    page: int = 1,                       # 第几页，从 1 开始
    count: int = 10,                     # 每页条数
    title: Optional[str] = None,         # 标题模糊查询
    location: Optional[str] = None,      # 地址模糊查询
    maker: Optional[str] = None,         # 推荐来源精确查询
    min_star: Optional[float] = None,    # 最低评分，支持小数
    max_star: Optional[float] = None,    # 最高评分，支持小数
    flavor: Optional[str] = None,        # 口味精确查询
    tag: Optional[str] = None,           # 标签包含查询
    enjoy_service: EnjoyService = Depends(get_enjoy_service)
) -> ApiSuccessResponse:
    """获取饭店记录列表（支持条件查询和分页）"""
    try:
        # 内部换算
        skip = (page - 1) * count
        limit = count

        logger.info(f"获取饭店记录列表，page={page}, count={count}, title={title}, location={location}, maker={maker}, min_star={min_star}, max_star={max_star}, flavor={flavor}, tag={tag} (skip={skip}, limit={limit})")
        
        # 调用带条件查询的服务方法
        enjoys = await enjoy_service.search_enjoys(
            title=title,
            location=location,
            maker=maker,
            min_star=min_star,
            max_star=max_star,
            flavor=flavor,
            tag=tag,
            skip=skip,
            limit=limit
        )
        
        # 获取满足条件的总条数
        total = await enjoy_service.search_enjoys_count(
            title=title,
            location=location,
            maker=maker,
            min_star=min_star,
            max_star=max_star,
            flavor=flavor,
            tag=tag
        )

        return ApiSuccessResponse.create(
            data={
                "enjoys": enjoys,
                "total": total,   # 返回所有满足条件的总条数
                "page": page,
                "count": count
            },
            msg="获取饭店列表成功"
        )

    except Exception as e:
        logger.error(f"获取饭店列表失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/{enjoy_id}", response_model=ApiSuccessResponse)
async def get_enjoy(
    enjoy_id: str,
    enjoy_service: EnjoyService = Depends(get_enjoy_service)
) -> ApiSuccessResponse:
    """根据 ID 获取单个饭店"""
    try:
        logger.info(f"获取饭店: {enjoy_id}")
        enjoy = await enjoy_service.get_enjoy(enjoy_id)
        if not enjoy:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饭店不存在"
            )

        # 如果已经是 dict，直接返回；否则再转一次
        data = enjoy if isinstance(enjoy, dict) else enjoy.dict()

        return ApiSuccessResponse.create(
            data=data,
            msg="获取饭店成功"
        )
    except Exception as e:
        logger.error(f"获取饭店失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.put("/{enjoy_id}", response_model=ApiSuccessResponse)
async def update_enjoy(
    enjoy_id: str,
    enjoy: EnjoyUpdate,
    enjoy_service: EnjoyService = Depends(get_enjoy_service),
    current_user: User = Depends(get_current_active_user)   # 取当前用户
) -> ApiSuccessResponse:
    """根据 ID 更新单个饭店"""
    try:
        # 把 updated_by 传进去
        updated = await enjoy_service.update_enjoy(
            enjoy_id,
            enjoy,
            updated_by=str(current_user.id)
        )
        if not updated:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饭店不存在"
            )
        data = updated if isinstance(updated, dict) else updated.dict()
        return ApiSuccessResponse.create(data=data, msg="更新成功")
    except Exception as e:
        logger.error(f"更新饭店失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.delete("/{enjoy_id}", response_model=ApiSuccessResponse)
async def delete_enjoy(
    enjoy_id: str,
    enjoy_service: EnjoyService = Depends(get_enjoy_service),
    current_user: User = Depends(get_current_active_user)   # 取当前用户
) -> ApiSuccessResponse:
    """根据 ID 删除单个饭店"""
    try:
        deleted = await enjoy_service.delete_enjoy(enjoy_id)
        if not deleted:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饭店不存在"
            )
        return ApiSuccessResponse.create(data=None, msg="删除成功")
    except Exception as e:
        logger.error(f"删除饭店失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )