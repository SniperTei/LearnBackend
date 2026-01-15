"""Enjoy服务层 - 实现饭店信息的业务逻辑"""
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime, timezone
from beanie import PydanticObjectId

from app.models.enjoy import Enjoy
from app.schemas.enjoy import EnjoyCreate, EnjoyUpdate

# 创建logger实例
logger = logging.getLogger(__name__)


class EnjoyService:
    """饭店信息服务类 - 实现增删改查等业务逻辑"""
    
    async def create_enjoy(self, enjoy_data: EnjoyCreate, created_by: str) -> Dict[str, Any]:
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
            await new_enjoy.insert()
            
            logger.info(f"饭店信息创建成功: {new_enjoy.id}")
            return new_enjoy.dict()
            
        except Exception as e:
            logger.error(f"创建饭店信息失败: {str(e)}", exc_info=True)
            raise
    
    async def get_enjoy(self, enjoy_id: PydanticObjectId) -> Optional[Dict[str, Any]]:
        """根据ID获取饭店信息
        
        Args:
            enjoy_id: 饭店信息ID
            
        Returns:
            饭店信息，如果不存在返回None
        """
        try:
            logger.info(f"获取饭店信息: {enjoy_id}")
            
            # 查询数据库
            enjoy = await Enjoy.get(enjoy_id)
            
            if enjoy:
                return enjoy.dict()
            return None
            
        except Exception as e:
            logger.error(f"获取饭店信息失败: {str(e)}", exc_info=True)
            raise
    
    async def get_all_enjoys(self, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """获取所有饭店信息"""
        try:
            # 查询所有饭店信息
            enjoys = await Enjoy.find_all().skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"获取所有饭店信息失败: {str(e)}", exc_info=True)
            raise
    
    async def update_enjoy(self, enjoy_id: PydanticObjectId, enjoy_data: EnjoyUpdate, updated_by: str) -> Optional[Dict[str, Any]]:
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
            enjoy = await Enjoy.get(enjoy_id)
            
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
                await enjoy.save()
                
            logger.info(f"饭店信息更新成功: {enjoy_id}")
            return enjoy.dict()
            
        except Exception as e:
            logger.error(f"更新饭店信息失败: {str(e)}", exc_info=True)
            raise
    
    async def delete_enjoy(self, enjoy_id: PydanticObjectId) -> bool:
        """根据ID删除饭店信息
        
        Args:
            enjoy_id: 饭店信息ID
            
        Returns:
            删除成功返回True，否则返回False
        """
        try:
            logger.info(f"删除饭店信息: {enjoy_id}")
            
            # 查找饭店信息
            enjoy = await Enjoy.get(enjoy_id)
            
            if not enjoy:
                logger.warning(f"饭店信息不存在: {enjoy_id}")
                return False
            
            # 删除饭店信息
            await enjoy.delete()
            
            logger.info(f"饭店信息删除成功: {enjoy_id}")
            return True
            
        except Exception as e:
            logger.error(f"删除饭店信息失败: {str(e)}", exc_info=True)
            raise
    
    async def get_enjoys_by_food_id(self, food_id: PydanticObjectId, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据美食ID获取相关饭店信息"""
        try:
            # 查询相关饭店信息
            enjoys = await Enjoy.find(
                Enjoy.food_id == food_id
            ).skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据美食ID获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise
    
    async def search_enjoys(self, 
                          title: Optional[str] = None,
                          location: Optional[str] = None,
                          maker: Optional[str] = None,
                          min_star: Optional[float] = None,
                          max_star: Optional[float] = None,
                          flavor: Optional[str] = None,
                          tag: Optional[str] = None,
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
            query = {}
            
            if title:
                query["title"] = {"$regex": title, "$options": "i"}
            
            if location:
                query["location"] = {"$regex": location, "$options": "i"}
            
            if maker:
                query["maker"] = maker
            
            if min_star is not None:
                query["star"] = query.get("star", {})
                query["star"]["$gte"] = min_star
            
            if max_star is not None:
                query["star"] = query.get("star", {})
                query["star"]["$lte"] = max_star
            
            if flavor:
                query["flavor"] = flavor
            
            if tag:
                query["tags"] = tag
            
            # 执行查询
            enjoys = await Enjoy.find(query).skip(skip).limit(limit).to_list()
            
            return [enjoy.dict() for enjoy in enjoys]
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
        tag: Optional[str] = None
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
            query = Enjoy.find({})
            
            if title:
                query = query.find({"title": {"$regex": title, "$options": "i"}})
            
            if location:
                query = query.find({"location": {"$regex": location, "$options": "i"}})
            
            if maker:
                query = query.find({"maker": maker})
            
            if min_star is not None:
                query = query.find({"star": {"$gte": min_star}})
            
            if max_star is not None:
                query = query.find({"star": {"$lte": max_star}})
            
            if flavor:
                query = query.find({"flavor": flavor})
            
            if tag:
                query = query.find({"tags": tag})
            
            # 执行查询
            count = await query.count()
            
            return count
            
        except Exception as e:
            logger.error(f"获取符合条件的饭店信息总数失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_location(self, location: str, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据位置获取饭店信息"""
        try:
            # 查询相关饭店信息
            enjoys = await Enjoy.find(Enjoy.location == location).skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据位置获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_rating(self, rating: float, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据评分获取饭店信息"""
        try:
            # 查询相关饭店信息
            enjoys = await Enjoy.find(Enjoy.star >= rating).skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据评分获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_price_range(self, min_price: float, max_price: float, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据价格范围获取饭店信息"""
        try:
            # 查询相关饭店信息
            enjoys = await Enjoy.find((Enjoy.price_per_person >= min_price) & (Enjoy.price_per_person <= max_price)).skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据价格范围获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_tags(self, tags: List[str], limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据标签获取饭店信息"""
        try:
            # 查询相关饭店信息
            enjoys = await Enjoy.find(Enjoy.tags.in_(tags)).skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据标签获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_opening_hours(self, day: str, time: str, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据营业时间获取饭店信息"""
        try:
            # 查询相关饭店信息
            # 这里需要根据实际的营业时间存储格式来调整查询条件
            enjoys = await Enjoy.find().skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据营业时间获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_features(self, features: List[str], limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据特色获取饭店信息"""
        try:
            # 查询相关饭店信息
            # 注意：Enjoy模型中没有features字段，这里可能需要根据实际模型字段调整
            enjoys = await Enjoy.find().skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据特色获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_cuisine(self, cuisine: str, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据菜系获取饭店信息"""
        try:
            # 查询相关饭店信息
            # 注意：Enjoy模型中没有cuisine字段，这里可能需要根据实际模型字段调整
            enjoys = await Enjoy.find().skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据菜系获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_ambiance(self, ambiance: str, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据氛围获取饭店信息"""
        try:
            # 查询相关饭店信息
            # 注意：Enjoy模型中没有ambiance字段，这里可能需要根据实际模型字段调整
            enjoys = await Enjoy.find().skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据氛围获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_payment_methods(self, payment_method: str, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据支付方式获取饭店信息"""
        try:
            # 查询相关饭店信息
            # 注意：Enjoy模型中没有payment_methods字段，这里可能需要根据实际模型字段调整
            enjoys = await Enjoy.find().skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据支付方式获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise

    async def get_enjoys_by_special_offers(self, special_offer: bool, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据优惠活动获取饭店信息"""
        try:
            # 查询相关饭店信息
            # 注意：Enjoy模型中没有special_offers字段，这里可能需要根据实际模型字段调整
            enjoys = await Enjoy.find().skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据优惠活动获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise
    
    async def get_enjoys(self, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
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
            enjoys = await Enjoy.find_all().skip(skip).limit(limit).to_list()
            
            return [enjoy.dict() for enjoy in enjoys]
            
        except Exception as e:
            logger.error(f"获取饭店信息列表失败: {str(e)}", exc_info=True)
            raise
    
    async def get_enjoys_by_user_id(self, user_id: PydanticObjectId, limit: int = 10, skip: int = 0) -> List[Dict[str, Any]]:
        """根据用户ID获取饭店信息"""
        try:
            # 查询相关饭店信息
            enjoys = await Enjoy.find(
                Enjoy.user_id == user_id
            ).skip(skip).limit(limit).to_list()
            return [enjoy.dict() for enjoy in enjoys]
        except Exception as e:
            logger.error(f"根据用户ID获取相关饭店信息失败: {str(e)}", exc_info=True)
            raise