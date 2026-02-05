"""Enjoy service layer - SQLAlchemy and PostgreSQL"""
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func

from app.models.enjoy import Enjoy
from app.schemas.enjoy import EnjoyCreate, EnjoyUpdate

logger = logging.getLogger(__name__)


class EnjoyService:
    """饭店信息服务类 - 实现增删改查等业务逻辑"""

    async def create_enjoy(self, enjoy_data: EnjoyCreate, created_by: int, db: AsyncSession) -> Dict[str, Any]:
        """创建新的饭店信息

        Args:
            enjoy_data: 饭店信息创建数据
            created_by: 创建人ID

        Returns:
            创建成功的饭店信息
        """
        try:
            logger.info(f"创建饭店信息: {enjoy_data.title}, 创建人: {created_by}")

            # 验证必需字段
            if not enjoy_data.title or not enjoy_data.location or not enjoy_data.maker:
                raise ValueError("标题、地址和推荐来源为必需字段")

            # 验证star值范围
            if enjoy_data.star is not None and (enjoy_data.star < 1 or enjoy_data.star > 5):
                raise ValueError("评分必须在1-5之间")

            # 创建新的饭店信息对象
            now = datetime.now(timezone.utc)
            new_enjoy = Enjoy(
                title=enjoy_data.title,
                content=enjoy_data.content or "",
                cover=enjoy_data.cover or "",
                images=enjoy_data.images or [],
                tags=enjoy_data.tags or [],
                star=enjoy_data.star,
                maker=enjoy_data.maker,
                flavor=enjoy_data.flavor or "",
                location=enjoy_data.location,
                price_per_person=enjoy_data.price_per_person,
                recommend_dishes=enjoy_data.recommend_dishes or [],
                created_by=created_by,
                updated_by=created_by,
                create_time=now,
                update_time=now
            )

            # 保存到数据库
            db.add(new_enjoy)
            await db.commit()
            await db.refresh(new_enjoy)

            logger.info(f"饭店信息创建成功: {new_enjoy.id}")
            return new_enjoy.to_dict()

        except Exception as e:
            logger.error(f"创建饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoy(self, enjoy_id: int, db: AsyncSession) -> Optional[Dict[str, Any]]:
        """根据ID获取饭店信息

        Args:
            enjoy_id: 饭店信息ID

        Returns:
            饭店信息，如果不存在返回None
        """
        try:
            logger.info(f"获取饭店信息: {enjoy_id}")

            # 查询数据库
            result = await db.execute(select(Enjoy).where(Enjoy.id == enjoy_id))
            enjoy = result.scalar_one_or_none()

            if enjoy:
                return enjoy.to_dict()
            return None

        except Exception as e:
            logger.error(f"获取饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_all_enjoys(self, db: AsyncSession, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """获取所有饭店信息"""
        try:
            result = await db.execute(
                select(Enjoy)
                .order_by(Enjoy.create_time.desc())
                .offset(skip)
                .limit(limit)
            )
            enjoys = result.scalars().all()
            return [enjoy.to_dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"获取所有饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def update_enjoy(self, enjoy_id: int, enjoy_data: EnjoyUpdate, updated_by: int, db: AsyncSession) -> Optional[Dict[str, Any]]:
        """根据ID更新饭店信息

        Args:
            enjoy_id: 饭店信息ID
            enjoy_data: 更新数据
            updated_by: 更新人ID

        Returns:
            更新后的饭店信息，如果不存在返回None
        """
        try:
            logger.info(f"更新饭店信息: {enjoy_id}, 更新人: {updated_by}")

            # 查找饭店信息
            result = await db.execute(select(Enjoy).where(Enjoy.id == enjoy_id))
            enjoy = result.scalar_one_or_none()

            if not enjoy:
                logger.warning(f"饭店信息不存在: {enjoy_id}")
                return None

            # 获取更新数据
            update_data = enjoy_data.model_dump(exclude_unset=True)

            if update_data:
                # 更新字段
                for key, value in update_data.items():
                    setattr(enjoy, key, value)

                # 更新元数据
                enjoy.updated_by = updated_by
                enjoy.update_time = datetime.now(timezone.utc)

                # 保存到数据库
                await db.commit()
                await db.refresh(enjoy)

            logger.info(f"饭店信息更新成功: {enjoy_id}")
            return enjoy.to_dict()

        except Exception as e:
            logger.error(f"更新饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def delete_enjoy(self, enjoy_id: int, db: AsyncSession) -> bool:
        """根据ID删除饭店信息

        Args:
            enjoy_id: 饭店信息ID

        Returns:
            删除成功返回True，否则返回False
        """
        try:
            logger.info(f"删除饭店信息: {enjoy_id}")

            # 查找饭店信息
            result = await db.execute(select(Enjoy).where(Enjoy.id == enjoy_id))
            enjoy = result.scalar_one_or_none()

            if not enjoy:
                logger.warning(f"饭店信息不存在: {enjoy_id}")
                return False

            # 删除饭店信息
            await db.delete(enjoy)
            await db.commit()

            logger.info(f"饭店信息删除成功: {enjoy_id}")
            return True

        except Exception as e:
            logger.error(f"删除饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def search_enjoys(self,
                          title: Optional[str] = None,
                          location: Optional[str] = None,
                          maker: Optional[str] = None,
                          min_star: Optional[float] = None,
                          max_star: Optional[float] = None,
                          flavor: Optional[str] = None,
                          tag: Optional[str] = None,
                          db: AsyncSession = None,
                          limit: int = 10,
                          skip: int = 0) -> List[Dict[str, Any]]:
        """搜索饭店信息

        Args:
            title: 标题模糊查询
            location: 地址模糊查询
            maker: 推荐来源精确查询
            min_star: 最低评分
            max_star: 最高评分
            flavor: 口味精确查询
            tag: 标签包含查询
            limit: 返回条数
            skip: 跳过条数

        Returns:
            符合条件的饭店信息列表
        """
        try:
            logger.info(f"搜索饭店信息，title: {title}, location: {location}, maker: {maker}, min_star: {min_star}, max_star: {max_star}, flavor: {flavor}, tag: {tag}, skip: {skip}, limit: {limit}")

            # 构建查询条件
            query = select(Enjoy)

            if title:
                query = query.where(Enjoy.title.ilike(f"%{title}%"))

            if location:
                query = query.where(Enjoy.location.ilike(f"%{location}%"))

            if maker:
                query = query.where(Enjoy.maker == maker)

            if min_star is not None:
                query = query.where(Enjoy.star >= min_star)

            if max_star is not None:
                query = query.where(Enjoy.star <= max_star)

            if flavor:
                query = query.where(Enjoy.flavor == flavor)

            if tag:
                query = query.where(Enjoy.tags.contains([tag]))

            # 执行查询
            query = query.order_by(Enjoy.create_time.desc()).offset(skip).limit(limit)
            result = await db.execute(query)
            enjoys = result.scalars().all()

            return [enjoy.to_dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"搜索饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def search_enjoys_count(
        self,
        title: Optional[str] = None,
        location: Optional[str] = None,
        maker: Optional[str] = None,
        min_star: Optional[float] = None,
        max_star: Optional[float] = None,
        flavor: Optional[str] = None,
        tag: Optional[str] = None,
        db: AsyncSession = None
    ) -> int:
        """获取符合条件的饭店信息总数

        Args:
            title: 标题模糊查询
            location: 地址模糊查询
            maker: 推荐来源精确查询
            min_star: 最低评分
            max_star: 最高评分
            flavor: 口味精确查询
            tag: 标签包含查询

        Returns:
            符合条件的饭店信息总数
        """
        try:
            logger.info(f"获取符合条件的饭店信息总数，title: {title}, location: {location}, maker: {maker}, min_star: {min_star}, max_star: {max_star}, flavor: {flavor}, tag: {tag}")

            # 构建查询条件
            query = select(func.count(Enjoy.id))

            if title:
                query = query.where(Enjoy.title.ilike(f"%{title}%"))

            if location:
                query = query.where(Enjoy.location.ilike(f"%{location}%"))

            if maker:
                query = query.where(Enjoy.maker == maker)

            if min_star is not None:
                query = query.where(Enjoy.star >= min_star)

            if max_star is not None:
                query = query.where(Enjoy.star <= max_star)

            if flavor:
                query = query.where(Enjoy.flavor == flavor)

            if tag:
                query = query.where(Enjoy.tags.contains([tag]))

            # 执行查询
            result = await db.execute(query)
            return result.scalar()

        except Exception as e:
            logger.error(f"获取符合条件的饭店信息总数失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys(self, db: AsyncSession, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """获取饭店信息列表（分页）

        Args:
            skip: 跳过条数
            limit: 返回条数

        Returns:
            饭店信息列表
        """
        try:
            logger.info(f"获取饭店信息列表，跳过: {skip}, 限制: {limit}")

            # 查询数据库
            result = await db.execute(
                select(Enjoy)
                .order_by(Enjoy.create_time.desc())
                .offset(skip)
                .limit(limit)
            )
            enjoys = result.scalars().all()

            return [enjoy.to_dict() for enjoy in enjoys]

        except Exception as e:
            logger.error(f"获取饭店信息列表失败: {str(e)}", exc_info=True)
            raise
