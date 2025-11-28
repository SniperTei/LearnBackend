"""Pydantic models for food requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class FoodBase(BaseModel):
    """Base food schema."""
    title: str = Field(..., min_length=1, max_length=100, description="记录标题（菜品名+制作者）")
    content: Optional[str] = Field(None, max_length=1000, description="品尝感受")
    cover: Optional[str] = Field(None, max_length=255, description="菜品封面图")
    images: List[str] = Field(default_factory=list, description="菜品多图")
    tags: List[str] = Field(default_factory=list, description="标签")
    star: Optional[int] = Field(None, ge=1, le=5, description="1-5星评分")
    maker: str = Field(..., min_length=1, max_length=50, description="制作者")
    flavor: Optional[str] = Field(None, max_length=50, description="菜品口味")


class FoodCreate(FoodBase):
    """Request model for food creation."""
    pass


class FoodUpdate(BaseModel):
    """Request model for food updates."""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, max_length=1000)
    cover: Optional[str] = Field(None, max_length=255)
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    star: Optional[int] = Field(None, ge=1, le=5)
    maker: Optional[str] = Field(None, min_length=1, max_length=50)
    flavor: Optional[str] = Field(None, max_length=50)


class FoodOut(FoodBase):
    """Response model for food data."""
    id: str
    create_time: datetime
    update_time: datetime
    created_by: str
    updated_by: str

    class Config:
        from_attributes = True