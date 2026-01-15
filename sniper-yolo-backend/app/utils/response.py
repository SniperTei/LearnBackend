"""统一响应格式工具 - 使用Pydantic类实现"""
from datetime import datetime
from typing import Any, Dict, Optional, Union
from pydantic import BaseModel, Field, RootModel


# class BaseResponse(BaseModel):
#     """响应模型的基类"""
#     code: str
#     statusCode: int
#     msg: str
#     data: Optional[Any] = None
#     timestamp: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))


class ApiSuccessResponse(BaseModel):
    """成功响应模型"""
    code: str = "000000"
    statusCode: int = 200
    msg: str = "Success"
    data: Optional[Any] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    @classmethod
    def create(cls, data: Any = None, msg: str = "Success", status_code: int = 200, code: str = "000000") -> "ApiSuccessResponse":
        """快速创建成功响应实例"""
        return cls(
            code=code,
            data=data,
            msg=msg,
            statusCode=status_code,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
    
    def json(self, **kwargs):
        """自定义JSON序列化，确保中文正常显示"""
        kwargs.setdefault("ensure_ascii", False)
        return super().json(**kwargs)


class ApiErrorResponse(BaseModel):
    """错误响应模型"""
    code: str  # 添加code字段
    statusCode: int  # 添加statusCode字段
    msg: str  # 添加msg字段
    data: None = None  # 错误响应中data始终为None
    timestamp: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    @classmethod
    def create(cls, code: str, status_code: int, msg: str) -> "ApiErrorResponse":
        """快速创建错误响应实例"""
        return cls(
            code=code,
            statusCode=status_code,
            msg=msg,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
    
    def json(self, **kwargs):
        """自定义JSON序列化，确保中文正常显示"""
        kwargs.setdefault("ensure_ascii", False)
        return super().json(**kwargs)


# 创建统一的响应类型，可以在路由中使用
ApiResponse = Union[ApiSuccessResponse, ApiErrorResponse]

# 先注释掉，以后需要再说
# class ApiRootResponse(RootModel):
#     root: Union[ApiSuccessResponse, ApiErrorResponse] 


# 
# 使用现有响应格式实现文件上传功能
#
# 当然可以复用现有的响应工具！我看到您已经有了结构完善的 `ApiSuccessResponse` 和 `ApiErrorResponse` 类，可以直接在上传功能中使用。以下是修改后的实现方案：
#
# ### 1. 首先修改 response.py，取消注释并调整工具函数
def success_response(data: Any = None, msg: str = "Success", status_code: int = 200) -> Dict[str, Any]:
    """创建成功响应 - 支持自定义状态码"""
    return ApiSuccessResponse.create(data=data, msg=msg, status_code=status_code).model_dump()


def error_response(code: str, status_code: int, msg: str) -> Dict[str, Any]:
    """创建错误响应"""
    return ApiErrorResponse.create(code=code, status_code=status_code, msg=msg).model_dump()