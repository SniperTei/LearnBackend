"""User SQLAlchemy model for PostgreSQL"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, SmallInteger
from sqlalchemy.orm import relationship
from app.models.base import Base


class User(Base):
    """用户表模型"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    mobile = Column(String, unique=True, nullable=True, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)
    is_superuser = Column(Boolean, default=False, nullable=True)
    vip_level = Column(SmallInteger, default=1, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default="now()", nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate="now()", nullable=True)

    # Relationships
    items = relationship("Item", back_populates="owner", cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "email": self.email,
            "username": self.username,
            "mobile": self.mobile,
            "is_active": self.is_active,
            "is_superuser": self.is_superuser,
            "vip_level": self.vip_level,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
