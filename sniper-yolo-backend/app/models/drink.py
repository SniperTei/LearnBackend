"""饮品相关的数据模型"""
from typing import Optional, List
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field


class Drink(Document):
    """饮品数据模型"""
    # 基础字段
    title: Indexed(str) = Field(..., description="饮品标题")
    content: Optional[str] = Field(None, description="饮品描述")
    cover: Optional[str] = Field(None, description="封面图片URL")
    images: List[str] = Field(default_factory=list, description="图片URL数组")
    tags: List[str] = Field(default_factory=list, description="标签数组")
    star: Optional[float] = Field(None, description="评分(0-5)")
    user_id: str = Field(..., description="创建用户ID")
    
    # 饮品特有字段
    drink_name: str = Field(..., description="酒/饮品名称")
    drink_type: Indexed(str) = Field(..., description="类型：白酒/红酒/啤酒/咖啡/奶茶等")
    recommender: Optional[str] = Field(None, description="推荐人")
    taste: Optional[str] = Field(None, description="口感描述")
    min_price: Optional[float] = Field(None, description="最低价格")
    max_price: Optional[float] = Field(None, description="最高价格")
    currency: Optional[str] = Field("元", description="货币单位，默认'元'")
    
    # 时间字段
    create_time: Optional[datetime] = Field(default_factory=datetime.utcnow, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")
    
    class Settings:
        name = "drinks"  # 集合名称
        indexes = [
            "title",
            "drink_type",
            "user_id",
            "star"
        ]
    
    def dict(self) -> dict:
        """将模型转换为字典"""
        try:
            return {
                "id": str(self.id) if self.id else "",
                "title": str(self.title) if self.title else "",
                "content": str(self.content) if self.content else "",
                "cover": str(self.cover) if self.cover else "",
                "images": list(self.images) if self.images else [],
                "tags": list(self.tags) if self.tags else [],
                "star": float(self.star) if self.star is not None else None,
                "user_id": str(self.user_id) if self.user_id else "",
                "drink_name": str(self.drink_name) if self.drink_name else "",
                "drink_type": str(self.drink_type) if self.drink_type else "",
                "recommender": str(self.recommender) if self.recommender else "",
                "taste": str(self.taste) if self.taste else "",
                "min_price": float(self.min_price) if self.min_price is not None else None,
                "max_price": float(self.max_price) if self.max_price is not None else None,
                "currency": str(self.currency) if self.currency else "元",
                "create_time": self.create_time.isoformat() if self.create_time else None,
                "update_time": self.update_time.isoformat() if self.update_time else None
            }
        except Exception as e:
            import logging
            logging.error(f"Drink模型序列化失败: {str(e)}", exc_info=True)
            return {
                "id": str(self.id) if hasattr(self, 'id') and self.id else "",
                "title": "",
                "content": "",
                "cover": "",
                "images": [],
                "tags": [],
                "star": None,
                "user_id": "",
                "drink_name": "",
                "drink_type": "",
                "recommender": "",
                "taste": "",
                "min_price": None,
                "max_price": None,
                "currency": "元",
                "create_time": None,
                "update_time": None
            }