"""PostgreSQL数据库连接管理"""
import logging
from typing import Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings

logger = logging.getLogger(__name__)

class Database:
    """PostgreSQL连接管理器"""
    DATABASE_URL: Optional[str] = settings.DATABASE_URL
    DATABASE_NAME: Optional[str] = settings.DATABASE_NAME

    engine = None
    async_session = None

    @classmethod
    async def connect(cls):
        """连接PostgreSQL"""
        try:
            cls.engine = create_async_engine(
                settings.DATABASE_URL,
                pool_size=10,
                max_overflow=20,
                pool_pre_ping=True,
                echo=False  # Set to True for SQL debug logging
            )

            # Create async session factory
            cls.async_session = sessionmaker(
                cls.engine,
                class_=AsyncSession,
                expire_on_commit=False
            )

            logger.info("✅ PostgreSQL连接成功")

        except Exception as e:
            logger.error(f"❌ PostgreSQL连接失败: {e}")
            raise

    @classmethod
    async def close(cls):
        """关闭PostgreSQL连接"""
        if cls.engine:
            await cls.engine.dispose()
            logger.info("✅ PostgreSQL连接已关闭")

    @classmethod
    async def ping(cls) -> bool:
        """测试PostgreSQL连接"""
        try:
            if cls.engine:
                async with cls.engine.connect() as conn:
                    await conn.execute(text("SELECT 1"))
                    return True
            return False
        except Exception:
            return False

    @classmethod
    def get_session(cls):
        """获取数据库session"""
        if cls.async_session:
            return cls.async_session()
        return None
