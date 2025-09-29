"""Item business logic layer backed by Beanie + MongoDB."""
from datetime import datetime
from typing import List, Optional
from beanie import PydanticObjectId
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate


class ItemService:
    async def create_item(self, item_create: ItemCreate, owner_id: str) -> dict:
        item = Item(
            title=item_create.title,
            description=item_create.description,
            price=item_create.price,
            is_available=item_create.is_available,
            owner_id=PydanticObjectId(owner_id),
        )
        await item.insert()   # 确保异步插入完成
        return item.dict()

    async def get_item(self, item_id: int) -> Optional[dict]:
        """Get item by ID."""
        item = await Item.get(PydanticObjectId(item_id))
        return item.dict() if item else None

    async def get_items(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get list of items with pagination."""
        items = await Item.find().skip(skip).limit(limit).to_list()
        return [i.dict() for i in items]

    async def get_items_count(self) -> int:
        """Get total count of all items."""
        return await Item.find().count()

    async def update_item(
        self, item_id: int, item_update: ItemUpdate, owner_id: str
    ) -> Optional[dict]:
        """Update item information."""
        oid = PydanticObjectId(item_id)
        item = await Item.find_one(Item.id == oid, Item.owner_id == PydanticObjectId(owner_id))
        if not item:
            return None
        update_data = item_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)
        item.updated_at = datetime.utcnow()
        await item.save()
        return item.dict()

    async def delete_item(self, item_id: int, owner_id: str) -> bool:
        """Delete an item."""
        oid = PydanticObjectId(item_id)
        item = await Item.find_one(Item.id == oid, Item.owner_id == PydanticObjectId(owner_id))
        if item:
            await item.delete()
            return True
        return False