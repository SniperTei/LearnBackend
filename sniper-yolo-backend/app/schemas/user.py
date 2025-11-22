"""Pydantic models for user requests and responses."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema."""
    email: Optional[EmailStr] = None  # 邮箱变为可选
    mobile: Optional[str] = None  # 添加手机号字段
    username: str = Field(..., min_length=3, max_length=50)
    is_active: bool = True


class UserCreate(UserBase):
    """Request model for user creation."""
    password: str = Field(..., min_length=8, max_length=100)
    email: Optional[EmailStr] = None  # 邮箱变为可选
    mobile: Optional[str] = None  # 添加手机号字段


class UserUpdate(BaseModel):
    """Request model for user updates."""
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    password: Optional[str] = Field(None, min_length=8, max_length=100)
    is_active: Optional[bool] = None


class UserOut(UserBase):
    """Response model for user data."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # 从 orm_mode = True 修改


# 登录请求模型
class UserLogin(BaseModel):
    """Request model for user login."""
    identifier: str  # 可以是邮箱或手机号
    password: str

# 令牌响应模型
class Token(BaseModel):
    """Response model for authentication token."""
    access_token: str
    token_type: str = "bearer"