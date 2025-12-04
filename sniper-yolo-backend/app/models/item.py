from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import Field

class Item(Document):
    title: str
    description: str
    price: float = Field(ge=0)
    is_available: bool = True
    owner_id: PydanticObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = None

    class Settings:
        name = "items"

    class Config:
        json_encoders = {PydanticObjectId: str}

    def dict(self, **kwargs):
        d = super().dict(**kwargs)
        # 安全取值，不存在就不转换
        if "_id" in d:
            d["id"] = str(d.pop("_id"))
        return d
