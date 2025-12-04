"""娱乐记录模型 - MongoDB文档模型"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from beanie import Document, PydanticObjectId
from pydantic import Field


class CreatorInfo(Document):
    """创建者信息子文档"""
    user_id: str = Field(..., description="创建者唯一ID")
    user_name: str = Field(..., description="创建者昵称")
    avatar: Optional[str] = Field(None, description="创建者头像URL")


class RelatedUser(Document):
    """关联用户子文档"""
    user_id: str = Field(..., description="关联用户唯一ID")
    user_name: str = Field(..., description="关联用户昵称")
    role: str = Field(..., description="关联角色：maker/recommender/companion/author")
    avatar: Optional[str] = Field(None, description="关联用户头像URL")


class FoodInfo(Document):
    """吃模块专属信息"""
    food_name: str = Field(..., description="菜品名称")
    maker_type: Optional[str] = Field(None, description="制作者类型：family/friend/restaurant")
    ingredients: Optional[List[str]] = Field(default_factory=list, description="食材列表")
    flavor: Optional[str] = Field(None, description="口味")
    cook_place: Optional[str] = Field(None, description="制作地点")
    my_comment: Optional[str] = Field(None, description="个人评价")


class DrinkInfo(Document):
    """喝模块专属信息"""
    drink_name: str = Field(..., description="酒/饮品名称")
    drink_type: str = Field(..., description="类型：白酒/红酒/啤酒/咖啡/奶茶等")
    brand: Optional[str] = Field(None, description="品牌")
    taste: Optional[str] = Field(None, description="口感描述")
    drink_place: Optional[str] = Field(None, description="饮用地点")
    price_range: Optional[str] = Field(None, description="价格区间")
    buy_channel: Optional[str] = Field(None, description="购买渠道")


class PlayInfo(Document):
    """玩模块专属信息"""
    spot_name: str = Field(..., description="景点/游玩地点名称")
    spot_type: Optional[str] = Field(None, description="类型：古城/自然景观/游乐园/美食街等")
    city: str = Field(..., description="所在城市")
    province: Optional[str] = Field(None, description="所在省份")
    country: Optional[str] = Field(None, description="所在国家")
    visit_time: Optional[datetime] = Field(None, description="游玩时间")
    companion: Optional[List[str]] = Field(default_factory=list, description="同行人")
    cost: Optional[float] = Field(None, description="游玩花费（元）")
    my_comment: Optional[str] = Field(None, description="个人评价")


class FunInfo(Document):
    """乐模块专属信息"""
    content_name: str = Field(..., description="影视/书籍/音乐名称")
    content_type: str = Field(..., description="类型：movie/anime/book/music等")
    author_director: str = Field(..., description="作者/导演/歌手")
    platform: Optional[str] = Field(None, description="观看/阅读平台")
    fun_status: str = Field(..., description="状态：to_watch/watching/watched")
    score: Optional[float] = Field(None, description="官方评分")
    expect_comment: Optional[str] = Field(None, description="期待/观后感")


class GeoLocation(Document):
    """地理位置子文档"""
    lat: float = Field(..., description="纬度")
    lng: float = Field(..., description="经度")


class ExtInfo(Document):
    """扩展字段子文档"""
    is_recommend: Optional[bool] = Field(None, description="是否推荐给朋友")
    geo_location: Optional[GeoLocation] = Field(None, description="地理位置经纬度")


class EnjoyRecord(Document):
    """娱乐记录主文档"""
    # 基本字段
    category: str = Field(..., description="核心分类：eat/drink/play/fun")
    title: str = Field(..., description="记录标题（搜索核心字段）")
    content: Optional[str] = Field(None, description="记录详细描述")
    cover: Optional[str] = Field(None, description="封面图URL（列表页主图）")
    images: List[str] = Field(default_factory=list, description="除封面外的其他图片URL数组")
    tags: List[str] = Field(default_factory=list, description="标签（辅助搜索/分类）")
    
    # 创建者信息
    creator: CreatorInfo = Field(..., description="记录创建者信息")
    
    # 权限和关联信息
    shared_scope: str = Field(..., description="数据权限：public/private/friend")
    related_users: List[RelatedUser] = Field(default_factory=list, description="关联用户")
    star_level: Optional[int] = Field(None, ge=1, le=5, description="评分（1-5星）")
    
    # 时间信息
    create_time: datetime = Field(default_factory=datetime.utcnow, description="创建时间")
    update_time: datetime = Field(default_factory=datetime.utcnow, description="更新时间")
    
    # 状态信息
    status: int = Field(default=1, description="记录状态：1(正常)/0(删除)/2(收藏)")
    
    # 分类专属字段
    food_info: Optional[FoodInfo] = Field(None, description="吃模块专属字段")
    drink_info: Optional[DrinkInfo] = Field(None, description="喝模块专属字段")
    play_info: Optional[PlayInfo] = Field(None, description="玩模块专属字段")
    fun_info: Optional[FunInfo] = Field(None, description="乐模块专属字段")
    
    # 扩展字段
    ext: Optional[ExtInfo] = Field(None, description="扩展字段")
    
    # 索引配置 - 按照设计文档的要求创建索引
    class Settings:
        name = "enjoy_records"
        indexes = [
            "category",  # 按分类索引
            "title",     # 标题索引用于搜索
            "tags",      # 标签索引
            "creator.user_id",  # 创建者ID索引
            "shared_scope",     # 权限范围索引
            "related_users.user_id",  # 关联用户ID索引
        ]
    
    def dict(self, **kwargs):
        """将文档转换为字典，处理ObjectId"""
        result = super().dict(**kwargs)
        result['id'] = str(self.id)
        if '_id' in result:
            del result['_id']
        return result