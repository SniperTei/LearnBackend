"""Enjoy SQLAlchemy model for PostgreSQL"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from app.models.base import Base


class Enjoy(Base):
    """饭店信息表模型"""
    __tablename__ = "enjoys"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=True)
    cover = Column(String, nullable=True)
    images = Column(ARRAY(String), nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    star = Column(Integer, nullable=True)
    maker = Column(String, nullable=False)
    flavor = Column(String, nullable=True)
    location = Column(String, nullable=True)
    price_per_person = Column(Float, nullable=True)
    recommend_dishes = Column(ARRAY(String), nullable=True)
    category = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    create_time = Column(DateTime(timezone=True), server_default="now()", nullable=True)
    update_time = Column(DateTime(timezone=True), onupdate="now()", nullable=True)

    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "title": self.title or "",
            "location": self.location or "",
            "maker": self.maker or "",
            "content": self.content or "",
            "cover": self.cover or "",
            "images": list(self.images) if self.images else [],
            "tags": list(self.tags) if self.tags else [],
            "star": float(self.star) if self.star is not None else None,
            "flavor": self.flavor or "",
            "price_per_person": float(self.price_per_person) if self.price_per_person is not None else None,
            "recommend_dishes": list(self.recommend_dishes) if self.recommend_dishes else [],
            "category": self.category or "",
            "rating": self.rating,
            "created_by": str(self.created_by) if self.created_by else "system",
            "updated_by": str(self.updated_by) if self.updated_by else "system",
            "create_time": self.create_time.isoformat() if self.create_time else None,
            "update_time": self.update_time.isoformat() if self.update_time else None
        }
