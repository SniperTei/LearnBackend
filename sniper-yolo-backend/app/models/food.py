from beanie import Document, Indexed, PydanticObjectId
from datetime import datetime, timezone
from pydantic import Field
from typing import List, Optional

class Food(Document):
    title: Indexed(str)           # 记录标题（菜品名+制作者），必选
    content: str = ""             # 品尝感受，可选
    cover: Optional[str] = None   # 菜品封面图，可选
    images: List[str] = []        # 菜品多图（步骤/成品），可选
    tags: List[str] = []          # 标签，可选
    star: float = Field(None, ge=1, le=5)  # 1-5星评分，支持小数，可选 （默认值为None）
    maker: str                    # 制作者（老婆/朋友/餐厅），必选
    flavor: Optional[str] = None  # 菜品口味，可选
    create_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # 创建时间（后端自动生成）
    update_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # 更新时间（后端自动生成）
    created_by: str               # 创建者用户ID
    updated_by: str               # 更新者用户ID

    class Settings:
        name = "foods"
        use_state_management = True
        indexes = ["title", "maker", "star"]
    
    def dict(self, **kwargs):
        """将模型转换为字典，增强了错误处理和类型安全检查"""
        try:
            d = super().dict(**kwargs)
            # 安全取值，不存在就不转换
            if "_id" in d:
                d["id"] = str(d.pop("_id"))
            
            # 确保所有必需字段都存在并进行类型安全检查
            required_fields = ["title", "maker", "created_by", "updated_by"]
            for field in required_fields:
                if field not in d or d[field] is None:
                    if field in ["title", "maker"]:
                        d[field] = ""  # 给字符串字段设置空字符串默认值
                    elif field in ["created_by", "updated_by"]:
                        d[field] = "system"  # 默认创建者/更新者为system
                else:
                    # 类型安全检查
                    if field in ["title", "maker", "created_by", "updated_by"]:
                        d[field] = str(d[field])
            
            # 确保时间字段格式化正确
            for field in ["create_time", "update_time"]:
                if field in d and isinstance(d[field], datetime):
                    d[field] = d[field].isoformat()
                elif field in d and d[field] is None:
                    d[field] = None
            
            # 确保其他字段的类型安全
            if "star" in d and d["star"] is not None:
                d["star"] = int(d["star"])
            
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
            
            return d
        except Exception as e:
            # 添加错误日志以便调试序列化问题
            import logging
            logging.error(f"Food模型序列化失败: {str(e)}", exc_info=True)
            # 返回一个安全的默认字典，确保不会中断程序流程
            return {
                "id": "",
                "title": "",
                "content": "",
                "cover": "",
                "images": [],
                "tags": [],
                "star": 0,
                "maker": "",
                "flavor": "",
                "created_by": "system",
                "updated_by": "system",
                "create_time": None,
                "update_time": None
            }