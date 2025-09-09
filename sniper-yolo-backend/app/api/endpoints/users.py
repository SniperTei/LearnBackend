"""用户相关API端点 - 使用统一响应格式和真实数据库"""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.services.user_service import UserService
from app.core.dependencies import get_current_active_user, get_user_service
from app.utils.response import success_response, error_response

router = APIRouter()

@router.post("/", response_model=dict)
async def create_user(
    user_create: UserCreate,
    user_service: UserService = Depends(get_user_service)
) -> Dict[str, Any]:
    """创建新用户 - 先验证后插入"""
    try:
        user = await user_service.create_user(user_create)
        
        # 使用更新后的 success_response 支持201状态码
        return success_response(
            data={
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat(),
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            },
            msg="用户创建成功",
            status_code=status.HTTP_201_CREATED
        )
        
    except ValueError as e:
        return error_response(
            code="A00001",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        return error_response(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"服务器内部错误: {str(e)}"
        )

@router.get("/me", response_model=dict)
async def read_current_user(
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """获取当前用户信息"""
    return success_response(
        data={
            "id": str(current_user.id),
            "email": current_user.email,
            "username": current_user.username,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat(),
            "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
        },
        msg="获取用户信息成功"
    )

@router.get("/", response_model=dict)
async def read_users(
    skip: int = 0,
    limit: int = 100,
    user_service: UserService = Depends(get_user_service)
) -> Dict[str, Any]:
    """获取用户列表"""
    users = await user_service.get_users(skip=skip, limit=limit)
    
    # 转换用户数据格式
    users_data = []
    for user in users:
        users_data.append({
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat(),
            "updated_at": user.updated_at.isoformat() if user.updated_at else None
        })
    
    return success_response(
        data={
            "users": users_data,
            "total": len(users_data),
            "skip": skip,
            "limit": limit
        },
        msg="获取用户列表成功"
    )

@router.get("/{user_id}", response_model=dict)
async def read_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
) -> Dict[str, Any]:
    """根据ID获取用户信息"""
    user = await user_service.get_user(user_id)
    if not user:
        return error_response(
            code="A00002",
            status_code=status.HTTP_404_NOT_FOUND,
            msg="用户不存在"
        )
    
    return success_response(
        data={
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat(),
            "updated_at": user.updated_at.isoformat() if user.updated_at else None
        },
        msg="获取用户信息成功"
    )

@router.put("/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    user_service: UserService = Depends(get_user_service)
) -> Dict[str, Any]:
    """更新用户信息"""
    try:
        user = await user_service.update_user(user_id, user_update)
        if not user:
            return error_response(
                code="A00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="用户不存在"
            )
        
        return success_response(
            data={
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat(),
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            },
            msg="用户信息更新成功"
        )
    except ValueError as e:
        return error_response(
            code="A00001",
            status_code=status.HTTP_400_BAD_REQUEST,
            msg=str(e)
        )
    except Exception as e:
        return error_response(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg="更新用户信息失败"
        )

@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
) -> Dict[str, Any]:
    """删除用户"""
    try:
        success = await user_service.delete_user(user_id)
        if not success:
            return error_response(
                code="A00002",
                status_code=status.HTTP_404_NOT_FOUND,
                msg="用户不存在"
            )
        
        return success_response(
            data=None,
            msg="用户删除成功"
        )
    except Exception as e:
        return error_response(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg="删除用户失败"
        )