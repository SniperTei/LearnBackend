"""Drink SQLAlchemy model for PostgreSQL"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from app.models.base import Base


class Drink(Base):
    """饮品表模型"""
    __tablename__ = "drinks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=True)
    cover = Column(String, nullable=True)
    images = Column(ARRAY(String), nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    star = Column(Integer, nullable=True)
    brand = Column(String, nullable=False)
    flavor = Column(String, nullable=True)
    drink_type = Column(String, nullable=True)  # 饮品类型：咖啡、茶、酒水、果汁等
    sweetness = Column(String, nullable=True)  # 甜度：无糖、少糖、半糖、标准糖
    ice = Column(String, nullable=True)  # 冰量：去冰、少冰、标准冰、多冰
    create_time = Column(DateTime(timezone=True), server_default="now()", nullable=True)
    update_time = Column(DateTime(timezone=True), onupdate="now()", nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "title": self.title or "",
            "content": self.content or "",
            "cover": self.cover or "",
            "images": list(self.images) if self.images else [],
            "tags": list(self.tags) if self.tags else [],
            "star": int(self.star) if self.star is not None else 0,
            "brand": self.brand or "",
            "flavor": self.flavor or "",
            "drink_type": self.drink_type or "",
            "sweetness": self.sweetness or "",
            "ice": self.ice or "",
            "created_by": str(self.created_by) if self.created_by else "system",
            "updated_by": str(self.updated_by) if self.updated_by else "system",
            "create_time": self.create_time.isoformat() if self.create_time else None,
            "update_time": self.update_time.isoformat() if self.update_time else None
        }
