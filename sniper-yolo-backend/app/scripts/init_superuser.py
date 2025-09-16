from app.models.user import User

ADMIN_EMAIL = "admin@123.com"
ADMIN_PASS  = "admin123"
from datetime import datetime

async def create_superuser():
    exists = await User.find_one(User.email == ADMIN_EMAIL)
    if exists:
        return          # 已存在直接返回
    user = User(
        username="admin",
        email=ADMIN_EMAIL,
        hashed_password=User.hash_password(ADMIN_PASS),
        is_superuser=True,
        is_active=True,
        created_at=datetime.now(datetime.timezone.utc),
        updated_at=datetime.now(datetime.timezone.utc),
    )
    await user.insert()