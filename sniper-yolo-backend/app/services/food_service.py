"""Food business logic layer using SQLAlchemy and PostgreSQL"""
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func
from sqlalchemy.sql import text

from app.models.food import Food
from app.schemas.food import FoodCreate, FoodUpdate


class FoodService:
    """Food service class for PostgreSQL operations"""

    async def create_food(self, food_create: FoodCreate, created_by: int, db: AsyncSession) -> dict:
        """Create a new food item."""
        try:
            import logging
            logger = logging.getLogger(__name__)
            logger.debug(f"准备创建食品记录，数据: {food_create.model_dump() if hasattr(food_create, 'model_dump') else food_create}, created_by: {created_by}")

            # 验证必需字段
            if not food_create.title or not food_create.maker:
                raise ValueError("标题和制作者为必需字段")

            # 验证star值范围
            if food_create.star is not None and (food_create.star < 0 or food_create.star > 5):
                raise ValueError("评分必须在0-5之间")

            now = datetime.now(timezone.utc)
            food = Food(
                title=food_create.title,
                content=food_create.content or "",
                cover=food_create.cover or "",
                images=food_create.images or [],
                tags=food_create.tags or [],
                star=food_create.star or 0,
                maker=food_create.maker,
                flavor=food_create.flavor or "",
                create_time=now,
                update_time=now,
                created_by=created_by,
                updated_by=created_by
            )

            logger.debug(f"准备保存到数据库")
            db.add(food)
            await db.commit()
            await db.refresh(food)
            logger.debug(f"保存成功，食品ID: {food.id}")

            result = food.to_dict()
            logger.debug(f"返回创建的食品数据")
            return result

        except ValueError as e:
            logger.error(f"创建食品记录验证失败: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"创建食品记录失败: {str(e)}", exc_info=True)
            raise Exception(f"创建食品记录时发生错误: {str(e)}") from e

    async def get_food(self, food_id: int, db: AsyncSession) -> Optional[dict]:
        """Get food by ID."""
        result = await db.execute(select(Food).where(Food.id == food_id))
        food = result.scalar_one_or_none()
        return food.to_dict() if food else None

    async def get_foods(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get list of foods with pagination."""
        result = await db.execute(
            select(Food)
            .order_by(Food.create_time.desc())
            .offset(skip)
            .limit(limit)
        )
        foods = result.scalars().all()
        return [f.to_dict() for f in foods]

    async def get_foods_count(self, db: AsyncSession) -> int:
        """Get total count of all foods."""
        result = await db.execute(select(func.count(Food.id)))
        return result.scalar()

    async def update_food(
        self, food_id: int, food_update: FoodUpdate, updated_by: int, db: AsyncSession
    ) -> Optional[dict]:
        """Update food information."""
        result = await db.execute(select(Food).where(Food.id == food_id))
        food = result.scalar_one_or_none()
        if not food:
            return None

        update_data = food_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(food, field, value)

        food.update_time = datetime.now(timezone.utc)
        food.updated_by = updated_by
        await db.commit()
        await db.refresh(food)
        return food.to_dict()

    async def delete_food(self, food_id: int, db: AsyncSession) -> bool:
        """Delete a food item."""
        result = await db.execute(select(Food).where(Food.id == food_id))
        food = result.scalar_one_or_none()
        if food:
            await db.delete(food)
            await db.commit()
            return True
        return False

    async def search_foods(
        self,
        title: Optional[str] = None,
        content: Optional[str] = None,
        maker: Optional[str] = None,
        min_star: Optional[int] = None,
        max_star: Optional[int] = None,
        flavor: Optional[str] = None,
        tag: Optional[str] = None,
        db: AsyncSession = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """Search foods with filters and pagination."""
        # 构建查询条件
        query = select(Food)

        # 标题模糊查询
        if title:
            query = query.where(Food.title.ilike(f"%{title}%"))

        # 内容模糊查询
        if content:
            query = query.where(Food.content.ilike(f"%{content}%"))

        # 制作者精确查询
        if maker:
            query = query.where(Food.maker == maker)

        # 星级评分区间查询
        if min_star is not None:
            query = query.where(Food.star >= min_star)

        if max_star is not None:
            query = query.where(Food.star <= max_star)

        # 口味精确查询
        if flavor:
            query = query.where(Food.flavor == flavor)

        # 标签包含查询
        if tag:
            query = query.where(Food.tags.contains([tag]))

        # 应用分页并按创建时间倒序
        query = query.order_by(Food.create_time.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        foods = result.scalars().all()
        return [f.to_dict() for f in foods]

    async def search_foods_count(
        self,
        title: Optional[str] = None,
        content: Optional[str] = None,
        maker: Optional[str] = None,
        min_star: Optional[int] = None,
        max_star: Optional[int] = None,
        flavor: Optional[str] = None,
        tag: Optional[str] = None,
        db: AsyncSession = None
    ) -> int:
        """Get total count of foods matching search criteria."""
        # 构建查询条件
        query = select(func.count(Food.id))

        # 标题模糊查询
        if title:
            query = query.where(Food.title.ilike(f"%{title}%"))

        # 内容模糊查询
        if content:
            query = query.where(Food.content.ilike(f"%{content}%"))

        # 制作者精确查询
        if maker:
            query = query.where(Food.maker == maker)

        # 星级评分区间查询
        if min_star is not None:
            query = query.where(Food.star >= min_star)

        if max_star is not None:
            query = query.where(Food.star <= max_star)

        # 口味精确查询
        if flavor:
            query = query.where(Food.flavor == flavor)

        # 标签包含查询
        if tag:
            query = query.where(Food.tags.contains([tag]))

        result = await db.execute(query)
        return result.scalar()
