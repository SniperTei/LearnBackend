"""Pydantic models for user requests and responses."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    is_active: bool = True


class UserCreate(UserBase):
    """Request model for user creation."""
    password: str = Field(..., min_length=8, max_length=100)


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
        orm_mode = True


class UserLogin(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Response model for authentication token."""
    access_token: str
    token_type: str = "bearer"