"""用户相关API端点 - 使用统一响应格式和PostgreSQL"""
import logging
from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserLogin
from app.services.user_service import UserService
from app.core.dependencies import get_current_active_user, get_db
from app.core.security import create_access_token
from app.utils.response import ApiSuccessResponse, ApiErrorResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=ApiSuccessResponse)
async def create_user(
    user_create: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """创建新用户 - 先验证后插入"""
    try:
        logger.info(f"尝试创建用户: {user_create.email}")
        user_service = UserService()
        user = await user_service.create_user(user_create, db)

        # 添加成功日志
        logger.info(f"用户创建成功: {user.username} ({user.email})")

        # 生成访问令牌
        access_token = create_access_token(subject=str(user.id))
        token_data = {"access_token": access_token, "token_type": "bearer"}

        return ApiSuccessResponse.create(
            data=token_data,
            msg="用户注册成功",
            status_code=status.HTTP_201_CREATED
        )

    except ValueError as e:
        # 添加验证错误日志
        logger.warning(f"用户创建验证失败: {str(e)}")
        return ApiErrorResponse.create(
            code="A00001",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        # 添加服务器错误日志
        logger.error(f"用户创建服务器错误: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )


@router.get("/me", response_model=ApiSuccessResponse)
async def read_current_user(
    current_user: User = Depends(get_current_active_user)
) -> ApiSuccessResponse:
    """获取当前用户信息"""
    return ApiSuccessResponse.create(
        data={
            "id": str(current_user.id),
            "email": current_user.email,
            "username": current_user.username,
            "mobile": current_user.mobile,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
            "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
        },
        msg="获取用户信息成功"
    )


@router.get("/", response_model=ApiSuccessResponse)
async def read_users(
    page: int = 1,
    page_size: int = 10,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """获取用户列表"""
    try:
        skip = (page - 1) * page_size
        limit = page_size
        logger.info(f"获取用户列表，page={page}, page_size={page_size} (skip={skip}, limit={limit})")
        user_service = UserService()
        users = await user_service.get_users(db, skip=skip, limit=limit)

        # 转换用户数据格式
        users_data = []
        for user in users:
            users_data.append({
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "mobile": user.mobile,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            })

        total = await user_service.get_users_count(db)

        return ApiSuccessResponse.create(
            data={
                "users": users_data,
                "total": total,
                "page": page,
                "page_size": page_size
            },
            msg="获取用户列表成功"
        )
    except Exception as e:
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"获取用户列表失败: {str(e)}"
        )


@router.get("/{user_id}", response_model=ApiSuccessResponse)
async def read_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """根据ID获取用户信息"""
    try:
        user_service = UserService()
        user = await user_service.get_user(user_id, db)
        if not user:
            return ApiErrorResponse.create(
                code="A00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="用户不存在"
            )

        return ApiSuccessResponse.create(
            data={
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "mobile": user.mobile,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            },
            msg="获取用户信息成功"
        )
    except Exception as e:
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"获取用户信息失败: {str(e)}"
        )


@router.put("/{user_id}", response_model=ApiSuccessResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """更新用户信息"""
    try:
        user_service = UserService()
        user = await user_service.update_user(user_id, user_update, db)
        if not user:
            return ApiErrorResponse.create(
                code="A00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="用户不存在"
            )

        return ApiSuccessResponse.create(
            data={
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "mobile": user.mobile,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            },
            msg="用户信息更新成功"
        )
    except ValueError as e:
        return ApiErrorResponse.create(
            code="A00001",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg="更新用户信息失败"
        )


@router.delete("/{user_id}", response_model=ApiSuccessResponse)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """删除用户"""
    try:
        user_service = UserService()
        success = await user_service.delete_user(user_id, db)
        if not success:
            return ApiErrorResponse.create(
                code="A00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="用户不存在"
            )

        return ApiSuccessResponse.create(
            data=None,
            msg="用户删除成功"
        )
    except Exception as e:
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg="删除用户失败"
        )


@router.post("/login", response_model=ApiSuccessResponse)
async def login_for_access_token(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
) -> ApiSuccessResponse:
    """用户登录并获取访问令牌"""
    try:
        user_service = UserService()
        user = await user_service.authenticate_user(login_data.identifier, login_data.password, db)
        if not user:
            return ApiErrorResponse.create(
                code="C00401",
                status_code=status.HTTP_401_UNAUTHORIZED,
                msg="用户名/邮箱/手机号或密码错误"
            )
        access_token = create_access_token(subject=str(user.id))
        token_data = {"access_token": access_token, "token_type": "bearer"}
        return ApiSuccessResponse.create(
            data=token_data,
            msg="登录成功",
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return ApiErrorResponse.create(
            code="C00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"登录过程中发生错误: {str(e)}"
        )
