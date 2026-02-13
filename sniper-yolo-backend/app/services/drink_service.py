"""Drink business logic layer using SQLAlchemy and PostgreSQL"""
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func
from sqlalchemy.sql import text

from app.models.drink import Drink
from app.schemas.drink import DrinkCreate, DrinkUpdate


class DrinkService:
    """Drink service class for PostgreSQL operations"""

    async def create_drink(self, drink_create: DrinkCreate, created_by: int, db: AsyncSession) -> dict:
        """Create a new drink item."""
        try:
            import logging
            logger = logging.getLogger(__name__)
            logger.debug(f"准备创建饮品记录，数据: {drink_create.model_dump() if hasattr(drink_create, 'model_dump') else drink_create}, created_by: {created_by}")

            # 验证必需字段
            if not drink_create.title or not drink_create.brand:
                raise ValueError("标题和品牌为必需字段")

            # 验证star值范围
            if drink_create.star is not None and (drink_create.star < 0 or drink_create.star > 5):
                raise ValueError("评分必须在0-5之间")

            now = datetime.now(timezone.utc)
            drink = Drink(
                title=drink_create.title,
                content=drink_create.content or "",
                cover=drink_create.cover or "",
                images=drink_create.images or [],
                tags=drink_create.tags or [],
                star=drink_create.star or 0,
                brand=drink_create.brand,
                flavor=drink_create.flavor or "",
                drink_type=drink_create.drink_type or "",
                sweetness=drink_create.sweetness or "",
                ice=drink_create.ice or "",
                create_time=now,
                update_time=now,
                created_by=created_by,
                updated_by=created_by
            )

            logger.debug(f"准备保存到数据库")
            db.add(drink)
            await db.commit()
            await db.refresh(drink)
            logger.debug(f"保存成功，饮品ID: {drink.id}")

            result = drink.to_dict()
            logger.debug(f"返回创建的饮品数据")
            return result

        except ValueError as e:
            logger.error(f"创建饮品记录验证失败: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"创建饮品记录失败: {str(e)}", exc_info=True)
            raise Exception(f"创建饮品记录时发生错误: {str(e)}") from e

    async def get_drink(self, drink_id: int, db: AsyncSession) -> Optional[dict]:
        """Get drink by ID."""
        result = await db.execute(select(Drink).where(Drink.id == drink_id))
        drink = result.scalar_one_or_none()
        return drink.to_dict() if drink else None

    async def get_drinks(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get list of drinks with pagination."""
        result = await db.execute(
            select(Drink)
            .order_by(Drink.create_time.desc())
            .offset(skip)
            .limit(limit)
        )
        drinks = result.scalars().all()
        return [d.to_dict() for d in drinks]

    async def get_drinks_count(self, db: AsyncSession) -> int:
        """Get total count of all drinks."""
        result = await db.execute(select(func.count(Drink.id)))
        return result.scalar()

    async def update_drink(
        self, drink_id: int, drink_update: DrinkUpdate, updated_by: int, db: AsyncSession
    ) -> Optional[dict]:
        """Update drink information."""
        result = await db.execute(select(Drink).where(Drink.id == drink_id))
        drink = result.scalar_one_or_none()
        if not drink:
            return None

        update_data = drink_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(drink, field, value)

        drink.update_time = datetime.now(timezone.utc)
        drink.updated_by = updated_by
        await db.commit()
        await db.refresh(drink)
        return drink.to_dict()

    async def delete_drink(self, drink_id: int, db: AsyncSession) -> bool:
        """Delete a drink item."""
        result = await db.execute(select(Drink).where(Drink.id == drink_id))
        drink = result.scalar_one_or_none()
        if drink:
            await db.delete(drink)
            await db.commit()
            return True
        return False

    async def search_drinks(
        self,
        title: Optional[str] = None,
        content: Optional[str] = None,
        brand: Optional[str] = None,
        min_star: Optional[int] = None,
        max_star: Optional[int] = None,
        flavor: Optional[str] = None,
        drink_type: Optional[str] = None,
        sweetness: Optional[str] = None,
        ice: Optional[str] = None,
        tag: Optional[str] = None,
        db: AsyncSession = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """Search drinks with filters and pagination."""
        # 构建查询条件
        query = select(Drink)

        # 标题模糊查询
        if title:
            query = query.where(Drink.title.ilike(f"%{title}%"))

        # 内容模糊查询
        if content:
            query = query.where(Drink.content.ilike(f"%{content}%"))

        # 品牌精确查询
        if brand:
            query = query.where(Drink.brand == brand)

        # 星级评分区间查询
        if min_star is not None:
            query = query.where(Drink.star >= min_star)

        if max_star is not None:
            query = query.where(Drink.star <= max_star)

        # 口味精确查询
        if flavor:
            query = query.where(Drink.flavor == flavor)

        # 饮品类型精确查询
        if drink_type:
            query = query.where(Drink.drink_type == drink_type)

        # 甜度精确查询
        if sweetness:
            query = query.where(Drink.sweetness == sweetness)

        # 冰量精确查询
        if ice:
            query = query.where(Drink.ice == ice)

        # 标签包含查询
        if tag:
            query = query.where(Drink.tags.contains([tag]))

        # 应用分页并按创建时间倒序
        query = query.order_by(Drink.create_time.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        drinks = result.scalars().all()
        return [d.to_dict() for d in drinks]

    async def search_drinks_count(
        self,
        title: Optional[str] = None,
        content: Optional[str] = None,
        brand: Optional[str] = None,
        min_star: Optional[int] = None,
        max_star: Optional[int] = None,
        flavor: Optional[str] = None,
        drink_type: Optional[str] = None,
        sweetness: Optional[str] = None,
        ice: Optional[str] = None,
        tag: Optional[str] = None,
        db: AsyncSession = None
    ) -> int:
        """Get total count of drinks matching search criteria."""
        # 构建查询条件
        query = select(func.count(Drink.id))

        # 标题模糊查询
        if title:
            query = query.where(Drink.title.ilike(f"%{title}%"))

        # 内容模糊查询
        if content:
            query = query.where(Drink.content.ilike(f"%{content}%"))

        # 品牌精确查询
        if brand:
            query = query.where(Drink.brand == brand)

        # 星级评分区间查询
        if min_star is not None:
            query = query.where(Drink.star >= min_star)

        if max_star is not None:
            query = query.where(Drink.star <= max_star)

        # 口味精确查询
        if flavor:
            query = query.where(Drink.flavor == flavor)

        # 饮品类型精确查询
        if drink_type:
            query = query.where(Drink.drink_type == drink_type)

        # 甜度精确查询
        if sweetness:
            query = query.where(Drink.sweetness == sweetness)

        # 冰量精确查询
        if ice:
            query = query.where(Drink.ice == ice)

        # 标签包含查询
        if tag:
            query = query.where(Drink.tags.contains([tag]))

        result = await db.execute(query)
        return result.scalar()
