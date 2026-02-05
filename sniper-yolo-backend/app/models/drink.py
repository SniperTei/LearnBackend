"""Drink SQLAlchemy model for PostgreSQL"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, ARRAY
from app.models.base import Base


class Drink(Base):
    """饮品表模型"""
    __tablename__ = "drinks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False, index=True)
    content = Column(String, nullable=True)
    cover = Column(String, nullable=True)
    images = Column(ARRAY(String), nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    star = Column(Float, nullable=True)
    user_id = Column(Integer, nullable=False)
    drink_name = Column(String, nullable=False)
    drink_type = Column(String, nullable=False, index=True)
    recommender = Column(String, nullable=True)
    taste = Column(String, nullable=True)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    currency = Column(String, nullable=True, default="元")
    create_time = Column(DateTime(timezone=True), server_default="now()", nullable=True)
    update_time = Column(DateTime(timezone=True), onupdate="now()", nullable=True)

    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
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
