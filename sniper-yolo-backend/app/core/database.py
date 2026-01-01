"""MongoDB数据库连接管理"""
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

logger = logging.getLogger(__name__)

class Database:
    """MongoDB连接管理器"""
    MONGODB_URL: Optional[str] = settings.MONGODB_URL
    DATABASE_NAME: Optional[str] = settings.DATABASE_NAME
    
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect(cls):
        """连接MongoDB"""
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
            logger.info("✅ MongoDB连接成功")
            
            # 初始化Beanie
            from app.models.user import User
            from app.models.item import Item
            from app.models.food import Food  # 导入Food模型
            from app.models.enjoy import Enjoy  # 导入Enjoy模型
            
            await init_beanie(
                database=cls.client[settings.DATABASE_NAME],
                document_models=[User, Item, Food, Enjoy]  # 添加Food和Enjoy模型
            )
            logger.info("✅ Beanie初始化完成")
            
        except Exception as e:
            logger.error(f"❌ MongoDB连接失败: {e}")
            raise
    
    @classmethod
    async def close(cls):
        """关闭MongoDB连接"""
        if cls.client:
            cls.client.close()
            logger.info("✅ MongoDB连接已关闭")
    
    @classmethod
    async def ping(cls) -> bool:
        """测试MongoDB连接"""
        try:
            if cls.client:
                await cls.client.admin.command('ping')
                return True
            return False
        except Exception:
            return False
    
    @classmethod
    def get_database(cls):
        """获取数据库实例"""
        if cls.client:
            return cls.client[settings.DATABASE_NAME]
        return None