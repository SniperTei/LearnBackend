"""Pydantic models for drink requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class DrinkBase(BaseModel):
    """Base drink schema."""
    title: str = Field(..., min_length=1, max_length=100, description="记录标题（饮品名+品牌）")
    content: Optional[str] = Field(None, max_length=1000, description="品尝感受")
    cover: Optional[str] = Field(None, max_length=255, description="饮品封面图")
    images: List[str] = Field(default_factory=list, description="饮品多图")
    tags: List[str] = Field(default_factory=list, description="标签")
    star: Optional[int] = Field(None, ge=1, le=5, description="1-5星评分")
    brand: str = Field(..., min_length=1, max_length=50, description="品牌")
    flavor: Optional[str] = Field(None, max_length=50, description="口味")
    drink_type: Optional[str] = Field(None, max_length=50, description="饮品类型：咖啡、茶、酒水、果汁等")
    sweetness: Optional[str] = Field(None, max_length=20, description="甜度：无糖、少糖、半糖、标准糖")
    ice: Optional[str] = Field(None, max_length=20, description="冰量：去冰、少冰、标准冰、多冰")


class DrinkCreate(DrinkBase):
    """Request model for drink creation."""
    pass


class DrinkUpdate(BaseModel):
    """Request model for drink updates."""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, max_length=1000)
    cover: Optional[str] = Field(None, max_length=255)
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    star: Optional[int] = Field(None, ge=1, le=5)
    brand: Optional[str] = Field(None, min_length=1, max_length=50)
    flavor: Optional[str] = Field(None, max_length=50)
    drink_type: Optional[str] = Field(None, max_length=50)
    sweetness: Optional[str] = Field(None, max_length=20)
    ice: Optional[str] = Field(None, max_length=20)


class DrinkOut(DrinkBase):
    """Response model for drink data."""
    id: str
    create_time: datetime
    update_time: datetime
    created_by: str
    updated_by: str

    class Config:
        from_attributes = True
