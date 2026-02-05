"""User business logic layer using SQLAlchemy and PostgreSQL"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from datetime import datetime, timezone

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class UserService:
    """Service class for user operations using PostgreSQL"""

    def __init__(self, db: AsyncSession = None):
        self.db = db

    async def create_user(self, user_create: UserCreate, db: AsyncSession) -> User:
        """Create a new user in PostgreSQL - 先验证后插入"""

        # 1. 先进行所有验证，确保可以创建用户
        if not user_create.email and not user_create.mobile:
            raise ValueError("邮箱和手机号至少需要提供一个")

        if not user_create.username or len(user_create.username) < 3:
            raise ValueError("用户名长度至少为3个字符")

        if not user_create.password or len(user_create.password) < 8:
            raise ValueError("密码长度至少为8个字符")

        # 2. 检查邮箱是否已存在（如果提供了邮箱）
        if user_create.email:
            result = await db.execute(select(User).where(User.email == user_create.email))
            existing_user = result.scalar_one_or_none()
            if existing_user:
                raise ValueError("邮箱已存在")

        # 3. 检查手机号是否已存在（如果提供了手机号）
        if user_create.mobile:
            result = await db.execute(select(User).where(User.mobile == user_create.mobile))
            existing_mobile = result.scalar_one_or_none()
            if existing_mobile:
                raise ValueError("手机号已存在")

        # 3. 检查用户名是否已存在
        result = await db.execute(select(User).where(User.username == user_create.username))
        existing_username = result.scalar_one_or_none()
        if existing_username:
            raise ValueError("用户名已存在")

        # 4. 所有验证通过后，才创建并插入用户
        now = datetime.now(timezone.utc)
        user = User(
            email=user_create.email,
            mobile=user_create.mobile,
            username=user_create.username,
            hashed_password=get_password_hash(user_create.password),
            is_active=user_create.is_active if hasattr(user_create, 'is_active') else True,
            is_superuser=user_create.is_superuser if hasattr(user_create, 'is_superuser') else False,
            vip_level=user_create.vip_level if hasattr(user_create, 'vip_level') else 1,
            created_at=now,
            updated_at=now,
        )

        # 5. 最后一步才插入数据库
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    async def get_user(self, user_id: int, db: AsyncSession) -> Optional[User]:
        """Get user by ID."""
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str, db: AsyncSession) -> Optional[User]:
        """Get user by email."""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_user_by_username(self, username: str, db: AsyncSession) -> Optional[User]:
        """Get user by username."""
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_user_by_mobile(self, mobile: str, db: AsyncSession) -> Optional[User]:
        """Get user by mobile phone number."""
        result = await db.execute(select(User).where(User.mobile == mobile))
        return result.scalar_one_or_none()

    async def get_users(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
        """Get list of users with pagination."""
        result = await db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_users_count(self, db: AsyncSession) -> int:
        """Get total count of all users."""
        from sqlalchemy import func
        result = await db.execute(select(func.count(User.id)))
        return result.scalar()

    async def update_user(self, user_id: int, user_update: UserUpdate, db: AsyncSession) -> Optional[User]:
        """Update user information."""
        user = await self.get_user(user_id, db)
        if not user:
            return None

        # 验证更新数据
        update_data = user_update.model_dump(exclude_unset=True)

        # 检查邮箱是否已存在（如果更新邮箱）
        if "email" in update_data:
            result = await db.execute(
                select(User).where(
                    and_(User.email == update_data["email"], User.id != user_id)
                )
            )
            existing_email = result.scalar_one_or_none()
            if existing_email:
                raise ValueError("邮箱已存在")

        # 检查用户名是否已存在（如果更新用户名）
        if "username" in update_data:
            result = await db.execute(
                select(User).where(
                    and_(User.username == update_data["username"], User.id != user_id)
                )
            )
            existing_username = result.scalar_one_or_none()
            if existing_username:
                raise ValueError("用户名已存在")

        # 处理密码更新
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        # 更新字段
        for field, value in update_data.items():
            setattr(user, field, value)

        user.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(user)
        return user

    async def delete_user(self, user_id: int, db: AsyncSession) -> bool:
        """Delete a user."""
        user = await self.get_user(user_id, db)
        if not user:
            return False

        await db.delete(user)
        await db.commit()
        return True

    async def authenticate_user(self, identifier: str, password: str, db: AsyncSession) -> Optional[User]:
        """Authenticate user with email or mobile phone number and password."""
        # 先尝试通过邮箱查找
        user = await self.get_user_by_email(identifier, db)

        # 如果邮箱没找到，尝试通过手机号查找
        if not user:
            user = await self.get_user_by_mobile(identifier, db)

        # 验证密码
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
