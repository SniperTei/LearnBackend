"""Item business logic layer using SQLAlchemy and PostgreSQL"""
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func

from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate


class ItemService:
    """Item service class for PostgreSQL operations"""

    async def create_item(self, item_create: ItemCreate, owner_id: int, db: AsyncSession) -> dict:
        """Create a new item."""
        item = Item(
            title=item_create.title,
            description=item_create.description,
            price=item_create.price,
            is_available=item_create.is_available,
            owner_id=owner_id,
        )
        db.add(item)
        await db.commit()
        await db.refresh(item)
        return item.to_dict()

    async def get_item(self, item_id: int, db: AsyncSession) -> Optional[dict]:
        """Get item by ID."""
        result = await db.execute(select(Item).where(Item.id == item_id))
        item = result.scalar_one_or_none()
        return item.to_dict() if item else None

    async def get_items(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get list of items with pagination."""
        result = await db.execute(
            select(Item)
            .order_by(Item.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        items = result.scalars().all()
        return [i.to_dict() for i in items]

    async def get_items_count(self, db: AsyncSession) -> int:
        """Get total count of all items."""
        result = await db.execute(select(func.count(Item.id)))
        return result.scalar()

    async def search_items(
        self,
        title: Optional[str] = None,
        description: Optional[str] = None,
        owner_id: Optional[int] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        db: AsyncSession = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """Search items with filters and pagination."""
        # 构建查询条件
        query = select(Item)

        # 标题模糊查询
        if title:
            query = query.where(Item.title.ilike(f"%{title}%"))

        # 描述模糊查询
        if description:
            query = query.where(Item.description.ilike(f"%{description}%"))

        # 所有者ID精确查询
        if owner_id:
            query = query.where(Item.owner_id == owner_id)

        # 价格区间查询
        if min_price is not None:
            query = query.where(Item.price >= min_price)

        if max_price is not None:
            query = query.where(Item.price <= max_price)

        # 应用分页
        query = query.order_by(Item.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        items = result.scalars().all()
        return [i.to_dict() for i in items]

    async def search_items_count(
        self,
        title: Optional[str] = None,
        description: Optional[str] = None,
        owner_id: Optional[int] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        db: AsyncSession = None
    ) -> int:
        """Get total count of items matching search criteria."""
        # 构建查询条件
        query = select(func.count(Item.id))

        # 标题模糊查询
        if title:
            query = query.where(Item.title.ilike(f"%{title}%"))

        # 描述模糊查询
        if description:
            query = query.where(Item.description.ilike(f"%{description}%"))

        # 所有者ID精确查询
        if owner_id:
            query = query.where(Item.owner_id == owner_id)

        # 价格区间查询
        if min_price is not None:
            query = query.where(Item.price >= min_price)

        if max_price is not None:
            query = query.where(Item.price <= max_price)

        # 返回匹配条件的总数
        result = await db.execute(query)
        return result.scalar()

    async def update_item(
        self, item_id: int, item_update: ItemUpdate, owner_id: int, db: AsyncSession
    ) -> Optional[dict]:
        """Update item information."""
        result = await db.execute(
            select(Item).where(
                and_(Item.id == item_id, Item.owner_id == owner_id)
            )
        )
        item = result.scalar_one_or_none()
        if not item:
            return None

        update_data = item_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(item)
        return item.to_dict()

    async def delete_item(self, item_id: int, owner_id: int, db: AsyncSession) -> bool:
        """Delete an item."""
        result = await db.execute(
            select(Item).where(
                and_(Item.id == item_id, Item.owner_id == owner_id)
            )
        )
        item = result.scalar_one_or_none()
        if item:
            await db.delete(item)
            await db.commit()
            return True
        return False
