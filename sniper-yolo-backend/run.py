import asyncio
import uvicorn
from app.main import app
from app.core.database import Database
from app.scripts.init_superuser import create_superuser

async def on_startup():
    await Database.connect()          # 先连库
    await create_superuser() # ② 保证超管存在

if __name__ == "__main__":
    asyncio.run(on_startup())  # ③ 启动前执行
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )