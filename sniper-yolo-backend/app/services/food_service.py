"""Food business logic layer backed by Beanie + MongoDB."""
from datetime import datetime, timezone
from typing import List, Optional
from beanie import PydanticObjectId
from app.models.food import Food
from app.schemas.food import FoodCreate, FoodUpdate


class FoodService:
    async def create_food(self, food_create: FoodCreate, created_by: str) -> dict:
        """Create a new food item."""
        try:
            # 添加日志记录
            import logging
            logger = logging.getLogger(__name__)
            logger.debug(f"准备创建食品记录，数据: {food_create.dict() if hasattr(food_create, 'dict') else food_create}, created_by: {created_by}")
            
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
            await food.insert()
            logger.debug(f"保存成功，食品ID: {food.id}")
            
            result = food.dict()
            logger.debug(f"返回创建的食品数据")
            return result
            
        except ValueError as e:
            logger.error(f"创建食品记录验证失败: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"创建食品记录失败: {str(e)}", exc_info=True)
            raise Exception(f"创建食品记录时发生错误: {str(e)}") from e

    async def get_food(self, food_id: str) -> Optional[dict]:
        """Get food by ID."""
        food = await Food.get(PydanticObjectId(food_id))
        return food.dict() if food else None

    async def get_foods(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get list of foods with pagination."""
        foods = await Food.find().skip(skip).limit(limit).to_list()
        return [f.dict() for f in foods]

    async def get_foods_count(self) -> int:
        """Get total count of all foods."""
        return await Food.find().count()

    async def update_food(
        self, food_id: str, food_update: FoodUpdate, updated_by: str
    ) -> Optional[dict]:
        """Update food information."""
        oid = PydanticObjectId(food_id)
        food = await Food.get(oid)
        if not food:
            return None
        update_data = food_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(food, field, value)
        food.update_time = datetime.now(timezone.utc)
        food.updated_by = updated_by
        await food.save()
        return food.dict()

    async def delete_food(self, food_id: str) -> bool:
        """Delete a food item."""
        oid = PydanticObjectId(food_id)
        food = await Food.get(oid)
        if food:
            await food.delete()
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
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """Search foods with filters and pagination."""
        # 构建查询条件
        query = Food.find()
        
        # 标题模糊查询
        if title:
            query = query.find({"title": {"$regex": title, "$options": "i"}})
        
        # 内容模糊查询
        if content:
            query = query.find({"content": {"$regex": content, "$options": "i"}})
        
        # 制作者精确查询
        if maker:
            query = query.find(Food.maker == maker)
        
        # 星级评分区间查询
        if min_star is not None:
            query = query.find(Food.star >= min_star)
        
        if max_star is not None:
            query = query.find(Food.star <= max_star)
        
        # 口味精确查询
        if flavor:
            query = query.find(Food.flavor == flavor)
        
        # 标签包含查询
        if tag:
            query = query.find({"tags": tag})
        
        # 应用分页并按创建时间倒序
        foods = await query.sort([("create_time", -1)]).skip(skip).limit(limit).to_list()
        return [f.dict() for f in foods]
        
    async def search_foods_count(
        self, 
        title: Optional[str] = None,
        content: Optional[str] = None,
        maker: Optional[str] = None,
        min_star: Optional[int] = None,
        max_star: Optional[int] = None,
        flavor: Optional[str] = None,
        tag: Optional[str] = None
    ) -> int:
        """Get total count of foods matching search criteria."""
        # 构建查询条件
        query = Food.find()
        
        # 标题模糊查询
        if title:
            query = query.find({"title": {"$regex": title, "$options": "i"}})
        
        # 内容模糊查询
        if content:
            query = query.find({"content": {"$regex": content, "$options": "i"}})
        
        # 制作者精确查询
        if maker:
            query = query.find(Food.maker == maker)
        
        # 星级评分区间查询
        if min_star is not None:
            query = query.find(Food.star >= min_star)
        
        if max_star is not None:
            query = query.find(Food.star <= max_star)
        
        # 口味精确查询
        if flavor:
            query = query.find(Food.flavor == flavor)
        
        # 标签包含查询
        if tag:
            query = query.find({"tags": tag})
        
        return await query.count()