"""Item SQLAlchemy model for PostgreSQL"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base


class Item(Base):
    """物品表模型"""
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    is_available = Column(Boolean, default=True, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default="now()", nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate="now()", nullable=True)

    # Relationships
    owner = relationship("User", back_populates="items")

    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description or "",
            "price": float(self.price) if self.price is not None else 0.0,
            "is_available": self.is_available,
            "owner_id": str(self.owner_id) if self.owner_id else "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
