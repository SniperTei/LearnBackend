"""Food business logic layer backed by Beanie + MongoDB."""
from datetime import datetime, timezone
from typing import List, Optional
from beanie import PydanticObjectId
from app.models.food import Food
from app.schemas.food import FoodCreate, FoodUpdate


class FoodService:
    async def create_food(self, food_create: FoodCreate, created_by: str) -> dict:
        """Create a new food item."""
        now = datetime.now(timezone.utc)
        food = Food(
            food_name=food_create.food_name,
            food_url=food_create.food_url,
            food_desc=food_create.food_desc or "",
            chef_name=food_create.chef_name,
            tags=food_create.tags,
            price=food_create.price,
            created_at=now,
            created_by=created_by,
            updated_at=now,
            updated_by=created_by
        )
        await food.insert()
        return food.dict()

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
        food.updated_at = datetime.now(timezone.utc)
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
        food_name: Optional[str] = None,
        food_desc: Optional[str] = None,
        chef_name: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        tag: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """Search foods with filters and pagination."""
        # 构建查询条件
        query = Food.find()
        
        # 食品名称模糊查询
        if food_name:
            query = query.find({"food_name": {"$regex": food_name, "$options": "i"}})
        
        # 食品描述模糊查询
        if food_desc:
            query = query.find({"food_desc": {"$regex": food_desc, "$options": "i"}})
        
        # 厨师名称精确查询
        if chef_name:
            query = query.find(Food.chef_name == chef_name)
        
        # 价格区间查询
        if min_price is not None:
            query = query.find(Food.price >= min_price)
        
        if max_price is not None:
            query = query.find(Food.price <= max_price)
        
        # 标签包含查询
        if tag:
            query = query.find({"tags": tag})
        
        # 应用分页
        foods = await query.skip(skip).limit(limit).to_list()
        return [f.dict() for f in foods]
        
    async def search_foods_count(
        self, 
        food_name: Optional[str] = None,
        food_desc: Optional[str] = None,
        chef_name: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        tag: Optional[str] = None
    ) -> int:
        """Get total count of foods matching search criteria."""
        # 构建查询条件
        query = Food.find()
        
        # 食品名称模糊查询
        if food_name:
            query = query.find({"food_name": {"$regex": food_name, "$options": "i"}})
        
        # 食品描述模糊查询
        if food_desc:
            query = query.find({"food_desc": {"$regex": food_desc, "$options": "i"}})
        
        # 厨师名称精确查询
        if chef_name:
            query = query.find(Food.chef_name == chef_name)
        
        # 价格区间查询
        if min_price is not None:
            query = query.find(Food.price >= min_price)
        
        if max_price is not None:
            query = query.find(Food.price <= max_price)
        
        # 标签包含查询
        if tag:
            query = query.find({"tags": tag})
        
        return await query.count()