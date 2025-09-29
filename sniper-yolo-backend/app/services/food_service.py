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