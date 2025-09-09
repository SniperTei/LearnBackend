"""Item business logic layer using Starlette's async features."""
from typing import List, Optional
from app.schemas.item import ItemCreate, ItemUpdate

# Mock database - replace with actual database operations
mock_items = []
item_counter = 1


class ItemService:
    """Service class for item operations."""
    
    async def create_item(self, item_create: ItemCreate, owner_id: int) -> dict:
        """Create a new item."""
        global item_counter
        
        item_data = {
            "id": item_counter,
            "title": item_create.title,
            "description": item_create.description,
            "price": item_create.price,
            "is_available": item_create.is_available,
            "owner_id": owner_id,
            "created_at": "2024-01-01T00:00:00",
            "updated_at": None
        }
        
        mock_items.append(item_data)
        item_counter += 1
        
        return item_data
    
    async def get_item(self, item_id: int) -> Optional[dict]:
        """Get item by ID."""
        for item in mock_items:
            if item["id"] == item_id:
                return item
        return None
    
    async def get_items(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get list of items with pagination."""
        return mock_items[skip: skip + limit]
    
    async def update_item(self, item_id: int, item_update: ItemUpdate, owner_id: int) -> Optional[dict]:
        """Update item information."""
        for item in mock_items:
            if item["id"] == item_id and item["owner_id"] == owner_id:
                update_data = item_update.dict(exclude_unset=True)
                item.update(update_data)
                item["updated_at"] = "2024-01-01T12:00:00"
                return item
        return None
    
    async def delete_item(self, item_id: int, owner_id: int) -> bool:
        """Delete an item."""
        global mock_items
        initial_count = len(mock_items)
        mock_items = [
            item for item in mock_items 
            if not (item["id"] == item_id and item["owner_id"] == owner_id)
        ]
        return len(mock_items) < initial_count