import asyncio
import uvicorn
import asyncio  # 添加这一行导入
from app.main import app
from app.core.database import Database
from app.core.config import settings
from app.scripts.init_superuser import create_superuser

async def on_startup():
    await Database.connect()          # 先连库
    await create_superuser() # ② 保证超管存在

if __name__ == "__main__":
    asyncio.run(on_startup())
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )