from app.models.user import User

ADMIN_EMAIL = "admin@123.com"
ADMIN_PASS  = "admin123"
from datetime import datetime, timezone  # 修复导入，添加timezone

async def create_superuser():
    from app.models.user import User  # 在函数内部导入，避免循环导入问题
    exists = await User.find_one(User.email == ADMIN_EMAIL)
    if exists:
        return          # 已存在直接返回
    user = User(
        username="admin",
        email=ADMIN_EMAIL,
        hashed_password=User.hash_password(ADMIN_PASS),
        is_superuser=True,
        is_active=True,
        created_at=datetime.now(timezone.utc),  # 修复datetime使用方式
        updated_at=datetime.now(timezone.utc),  # 修复datetime使用方式
    )
    await user.insert()