"""Pydantic models for enjoy requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class EnjoyBase(BaseModel):
    """Base enjoy schema."""
    title: str = Field(..., min_length=1, max_length=100, description="饭店名称")
    content: Optional[str] = Field(None, max_length=1000, description="饭店介绍/就餐体验/评价")
    cover: Optional[str] = Field(None, max_length=255, description="饭店封面图/招牌菜图片URL")
    images: List[str] = Field(default_factory=list, description="菜品图/店内环境图URL集合")
    tags: List[str] = Field(default_factory=list, description="标签")
    star: Optional[float] = Field(None, ge=1, le=5, description="1-5星评分，支持小数")
    maker: str = Field(..., min_length=1, max_length=50, description="推荐来源/推荐人")
    flavor: Optional[str] = Field(None, max_length=50, description="主打口味")
    location: str = Field(..., min_length=1, max_length=200, description="饭店详细地址")
    price_per_person: Optional[float] = Field(None, ge=0, description="人均消费(元)")
    recommend_dishes: List[str] = Field(default_factory=list, description="推荐菜品/招牌菜")


class EnjoyCreate(EnjoyBase):
    """Request model for enjoy creation."""
    pass


class EnjoyUpdate(BaseModel):
    """Request model for enjoy updates."""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, max_length=1000)
    cover: Optional[str] = Field(None, max_length=255)
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    star: Optional[float] = Field(None, ge=1, le=5)
    maker: Optional[str] = Field(None, min_length=1, max_length=50)
    flavor: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, min_length=1, max_length=200)
    price_per_person: Optional[float] = Field(None, ge=0)
    recommend_dishes: Optional[List[str]] = None


class EnjoyOut(EnjoyBase):
    """Response model for enjoy data."""
    id: str
    create_time: datetime
    update_time: datetime
    created_by: str
    updated_by: str

    class Config:
        from_attributes = True