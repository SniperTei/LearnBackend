from datetime import datetime, timezone
from typing import List, Optional
from beanie import Document, Indexed, Field


class Enjoy(Document):
    # ======== 核心业务字段 - 饭店记录专用（必选字段） ========
    title: Indexed(str)           # ✅ 必选 | 饭店名称（索引字段，查询更快）
    location: str                 # ✅ 必选 | 饭店详细地址
    maker: str                    # ✅ 必选 | 推荐来源/推荐人（自己发掘/朋友推荐/大众点评）
    created_by: str               # ✅ 必选 | 创建者用户ID
    updated_by: str               # ✅ 必选 | 更新者用户ID
    
    # ======== 核心业务字段 - 可选填 ========
    content: str = ""             # 饭店介绍/就餐体验/评价，默认为空
    cover: Optional[str] = None   # 饭店封面图/招牌菜图片URL
    images: List[str] = []        # 菜品图/店内环境图URL集合
    tags: List[str] = []          # 标签（如：云南菜、火锅、私房菜、性价比）
    star: Optional[float] = Field(default=None, ge=1, le=5)  # 口味评分 1-5星，支持小数(4.5)
    flavor: Optional[str] = None  # 主打口味（酸辣/麻辣/清淡/鲜香/咸鲜）
    price_per_person: Optional[float] = None  # 人均消费(元)，如：88.5
    recommend_dishes: List[str] = []  # 推荐菜品/招牌菜，如：["酸辣鱼", "乳扇沙琪玛"]

    # ======== 系统审计字段 - 自动生成/更新，无需手动赋值 ========
    create_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    update_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        on_update=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "enjoys"
        use_state_management = True
        indexes = ["title", "maker", "star", "location"]
    
    def dict(self, **kwargs):
        """将模型转换为字典，增强了错误处理和类型安全检查"""
        try:
            d = super().dict(**kwargs)
            # 安全取值，不存在就不转换
            if "_id" in d:
                d["id"] = str(d.pop("_id"))
            
            # 确保所有必需字段都存在并进行类型安全检查
            required_fields = ["title", "location", "maker", "created_by", "updated_by"]
            for field in required_fields:
                if field not in d or d[field] is None:
                    if field in ["title", "location", "maker"]:
                        d[field] = ""  # 给字符串字段设置空字符串默认值
                    elif field in ["created_by", "updated_by"]:
                        d[field] = "system"  # 默认创建者/更新者为system
                else:
                    # 类型安全检查
                    if field in ["title", "location", "maker", "created_by", "updated_by"]:
                        d[field] = str(d[field])
            
            # 确保时间字段格式化正确
            for field in ["create_time", "update_time"]:
                if field in d and isinstance(d[field], datetime):
                    d[field] = d[field].isoformat()
                elif field in d and d[field] is None:
                    d[field] = None
            
            # 确保其他字段的类型安全
            if "star" in d and d["star"] is not None:
                d["star"] = float(d["star"])
            
            if "price_per_person" in d and d["price_per_person"] is not None:
                d["price_per_person"] = float(d["price_per_person"])
            
            if "content" in d:
                d["content"] = str(d["content"])
            
            if "cover" in d:
                d["cover"] = str(d["cover"]) if d["cover"] is not None else ""
            
            if "flavor" in d:
                d["flavor"] = str(d["flavor"]) if d["flavor"] is not None else ""
            
            if "images" in d:
                d["images"] = list(d["images"]) if d["images"] is not None else []
            
            if "tags" in d:
                d["tags"] = list(d["tags"]) if d["tags"] is not None else []
            
            if "recommend_dishes" in d:
                d["recommend_dishes"] = list(d["recommend_dishes"]) if d["recommend_dishes"] is not None else []
            
            return d
        except Exception as e:
            # 添加错误日志以便调试序列化问题
            import logging
            logging.error(f"Enjoy模型序列化失败: {str(e)}", exc_info=True)
            # 返回一个安全的默认字典，确保不会中断程序流程
            return {
                "id": "",
                "title": "",
                "location": "",
                "maker": "",
                "content": "",
                "cover": "",
                "images": [],
                "tags": [],
                "star": None,
                "flavor": "",
                "price_per_person": None,
                "recommend_dishes": [],
                "created_by": "system",
                "updated_by": "system",
                "create_time": None,
                "update_time": None
            }