"""饭店相关API端点 - 使用统一响应格式和PostgreSQL"""
from typing import List, Optional
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.enjoy import EnjoyCreate, EnjoyOut, EnjoyUpdate
from app.models.user import User
from app.services.enjoy_service import EnjoyService
from app.core.dependencies import get_current_active_user, get_db
from app.utils.response import ApiSuccessResponse, ApiErrorResponse, ApiResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=ApiSuccessResponse)
async def create_enjoy(
    enjoy: EnjoyCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """创建新饭店记录"""
    try:
        logger.info(f"用户 {current_user.username} 尝试创建饭店记录: {enjoy.title}")
        logger.debug(f"请求参数详情: {enjoy.model_dump()}")

        enjoy_service = EnjoyService()
        new_enjoy = await enjoy_service.create_enjoy(enjoy, int(current_user.id), db)

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
    page: int = 1,
    count: int = 10,
    title: Optional[str] = None,
    location: Optional[str] = None,
    maker: Optional[str] = None,
    min_star: Optional[float] = None,
    max_star: Optional[float] = None,
    flavor: Optional[str] = None,
    tag: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """获取饭店记录列表（支持条件查询和分页）"""
    try:
        skip = (page - 1) * count
        limit = count

        logger.info(f"获取饭店记录列表，page={page}, count={count}, title={title}, location={location}, maker={maker}, min_star={min_star}, max_star={max_star}, flavor={flavor}, tag={tag} (skip={skip}, limit={limit})")

        enjoy_service = EnjoyService()
        enjoys = await enjoy_service.search_enjoys(
            title=title,
            location=location,
            maker=maker,
            min_star=min_star,
            max_star=max_star,
            flavor=flavor,
            tag=tag,
            db=db,
            skip=skip,
            limit=limit
        )

        total = await enjoy_service.search_enjoys_count(
            title=title,
            location=location,
            maker=maker,
            min_star=min_star,
            max_star=max_star,
            flavor=flavor,
            tag=tag,
            db=db
        )

        return ApiSuccessResponse.create(
            data={
                "enjoys": enjoys,
                "total": total,
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
    enjoy_id: int,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 获取单个饭店"""
    try:
        logger.info(f"获取饭店: {enjoy_id}")
        enjoy_service = EnjoyService()
        enjoy = await enjoy_service.get_enjoy(enjoy_id, db)
        if not enjoy:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饭店不存在"
            )

        return ApiSuccessResponse.create(
            data=enjoy,
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
    enjoy_id: int,
    enjoy: EnjoyUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 更新单个饭店"""
    try:
        enjoy_service = EnjoyService()
        updated = await enjoy_service.update_enjoy(
            enjoy_id,
            enjoy,
            int(current_user.id),
            db
        )
        if not updated:
            return ApiErrorResponse.create(
                code="B00404",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="饭店不存在"
            )
        return ApiSuccessResponse.create(data=updated, msg="更新成功")
    except Exception as e:
        logger.error(f"更新饭店失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.delete("/{enjoy_id}", response_model=ApiSuccessResponse)
async def delete_enjoy(
    enjoy_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据 ID 删除单个饭店"""
    try:
        enjoy_service = EnjoyService()
        deleted = await enjoy_service.delete_enjoy(enjoy_id, db)
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
