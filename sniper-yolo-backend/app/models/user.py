from passlib.context import CryptContext   # 如果已有可忽略
import hashlib
import base64
from passlib.context import CryptContext
from beanie import Document
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from beanie.odm.fields import PydanticObjectId
from app.core.security import get_password_hash

class User(Document):
    username: str
    email: str
    mobile: Optional[str] = None  # 新增mobile字段
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    vip_level: int = Field(1, ge=1, le=10)   # 新增字段
    created_at: datetime = datetime.utcnow()
    updated_at: datetime   # 保持必填

    # 自动同步 superuser => vip_level
    @validator("vip_level", pre=True, always=True)
    def sync_vip_level(cls, v, values):
        if values.get("is_superuser"):
            return 10
        return v or 1

    class Settings:
        name = "users"
        use_state_management = True   # 启用 save 事件钩子

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            PydanticObjectId: str,
        }

    def dict(self, **kwargs):
        d = super().dict(**kwargs)
        if "_id" in d:
            d["id"] = str(d.pop("_id"))
        return d

    @staticmethod
    def hash_password(raw: str) -> str:
        # 使用security.py中已配置的PBKDF2哈希函数
        return get_password_hash(raw)