"""User business logic layer using Beanie MongoDB ODM."""
from typing import List, Optional
from beanie import PydanticObjectId

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from datetime import datetime

class UserService:
    """Service class for user operations using MongoDB."""
    
    async def create_user(self, user_create: UserCreate) -> User:
        """Create a new user in MongoDB - 先验证后插入"""
        
        # 1. 先进行所有验证，确保可以创建用户
        if not user_create.email:
            raise ValueError("邮箱不能为空")
        
        if not user_create.username or len(user_create.username) < 3:
            raise ValueError("用户名长度至少为3个字符")
        
        if not user_create.password or len(user_create.password) < 8:
            raise ValueError("密码长度至少为8个字符")
        
        # 2. 检查邮箱是否已存在
        existing_user = await User.find_one(User.email == user_create.email)
        if existing_user:
            raise ValueError("邮箱已存在")
        
        # 3. 检查用户名是否已存在
        existing_username = await User.find_one(User.username == user_create.username)
        if existing_username:
            raise ValueError("用户名已存在")
        
        # 4. 所有验证通过后，才创建并插入用户
        now = datetime.now(datetime.timezone.utc)
        user = User(
            email=user_create.email,
            username=user_create.username,
            hashed_password=get_password_hash(user_create.password),
            is_active=user_create.is_active if hasattr(user_create, 'is_active') else True,
            is_superuser=user_create.is_superuser if hasattr(user_create, 'is_superuser') else False,
            vip_level=user_create.vip_level if hasattr(user_create, 'vip_level') else 1,
            created_at=now,
            updated_at=now,
        )
        
        # 5. 最后一步才插入数据库
        await user.insert()
        return user
    
    async def get_user(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        try:
            return await User.get(PydanticObjectId(user_id))
        except Exception:
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return await User.find_one(User.email == email)
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        return await User.find_one(User.username == username)
    
    async def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get list of users with pagination."""
        return await User.find().skip(skip).limit(limit).to_list()
    
    async def update_user(self, user_id: str, user_update: UserUpdate) -> Optional[User]:
        """Update user information."""
        user = await self.get_user(user_id)
        if not user:
            return None
        
        # 验证更新数据
        update_data = user_update.dict(exclude_unset=True)
        
        # 检查邮箱是否已存在（如果更新邮箱）
        if "email" in update_data:
            existing_email = await User.find_one(
                User.email == update_data["email"],
                User.id != user.id
            )
            if existing_email:
                raise ValueError("邮箱已存在")
        
        # 检查用户名是否已存在（如果更新用户名）
        if "username" in update_data:
            existing_username = await User.find_one(
                User.username == update_data["username"],
                User.id != user.id
            )
            if existing_username:
                raise ValueError("用户名已存在")
        
        # 处理密码更新
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        # 更新字段
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await user.save()
        return user
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete a user."""
        user = await self.get_user(user_id)
        if not user:
            return False
        
        await user.delete()
        return True
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        user = await self.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user