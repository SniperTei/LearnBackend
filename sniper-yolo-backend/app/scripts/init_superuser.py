from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

ADMIN_EMAIL = "admin@123.com"
ADMIN_PASS = "admin123"

async def create_superuser():
    """创建超级用户（如果不存在）"""
    from app.core.database import Database
    from datetime import datetime, timezone

    async with Database.async_session() as db:
        # 检查是否已存在
        result = await db.execute(select(User).where(User.email == ADMIN_EMAIL))
        exists = result.scalar_one_or_none()

        if exists:
            print(f"超级用户已存在: {ADMIN_EMAIL}")
            return

        # 创建新用户
        user = User(
            username="admin",
            email=ADMIN_EMAIL,
            mobile="13800000000",
            hashed_password=get_password_hash(ADMIN_PASS),
            is_superuser=True,
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)
        print(f"超级用户创建成功: {ADMIN_EMAIL}")
