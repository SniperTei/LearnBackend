"""统一响应格式工具 - 返回标准字典格式"""
from datetime import datetime
from typing import Any, Dict

def success_response(data: Any = None, msg: str = "Success", status_code: int = 200) -> Dict[str, Any]:
    """创建成功响应 - 支持自定义状态码"""
    return {
        "code": "000000",
        "statusCode": status_code,
        "msg": msg,
        "data": data,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def error_response(code: str, status_code: int, msg: str) -> Dict[str, Any]:
    """创建错误响应"""
    return {
        "code": code,
        "statusCode": status_code,
        "msg": msg,
        "data": None,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }