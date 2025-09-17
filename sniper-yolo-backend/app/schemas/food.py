"""Pydantic models for food requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class FoodBase(BaseModel):
    """Base food schema."""
    food_name: str = Field(..., min_length=1, max_length=100)
    food_url: str = Field(..., max_length=255)
    food_desc: Optional[str] = Field(None, max_length=500)
    chef_name: str = Field(..., max_length=50)
    tags: List[str] = Field(default_factory=list)
    price: float = Field(..., gt=0)


class FoodCreate(FoodBase):
    """Request model for food creation."""
    pass


class FoodUpdate(BaseModel):
    """Request model for food updates."""
    food_name: Optional[str] = Field(None, min_length=1, max_length=100)
    food_url: Optional[str] = Field(None, max_length=255)
    food_desc: Optional[str] = Field(None, max_length=500)
    chef_name: Optional[str] = Field(None, max_length=50)
    tags: Optional[List[str]] = None
    price: Optional[float] = Field(None, gt=0)


class FoodOut(FoodBase):
    """Response model for food data."""
    id: str
    created_at: datetime
    created_by: str
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

    class Config:
        orm_mode = True