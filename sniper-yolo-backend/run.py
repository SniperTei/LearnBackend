import asyncio
import uvicorn
import asyncio  # 添加这一行导入
from app.main import app
from app.core.database import Database
from app.scripts.init_superuser import create_superuser

async def on_startup():
    await Database.connect()          # 先连库
    await create_superuser() # ② 保证超管存在

if __name__ == "__main__":
    asyncio.run(on_startup())
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        # reload=True,  # 生产环境移除这一行
    )