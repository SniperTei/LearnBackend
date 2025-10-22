import os
import uuid
from typing import Dict, Optional, Any
from datetime import datetime

from qiniu import Auth
from app.core.config import settings


class QiniuStorageService:
    """七牛云存储服务 - 前端直传模式"""
    
    def __init__(self):
        self.access_key = settings.QINIU_ACCESS_KEY
        self.secret_key = settings.QINIU_SECRET_KEY
        self.bucket_name = settings.QINIU_BUCKET_NAME
        self.domain = settings.QINIU_DOMAIN
        self.q = Auth(self.access_key, self.secret_key)
        # 默认上传策略配置
        self.default_policy = getattr(settings, 'QINIU_UPLOAD_POLICY', {})
    
    def get_token(self, key: Optional[str] = None, policy: Optional[Dict] = None, expires: int = 3600) -> str:
        """获取上传token
        
        Args:
            key: 上传后保存的文件名，如果为None则使用默认文件名
            policy: 上传策略，如回调配置等
            expires: token过期时间，单位秒
            
        Returns:
            上传token字符串
        """
        # 合并默认策略和自定义策略
        upload_policy = self.default_policy.copy()
        if policy:
            upload_policy.update(policy)
        
        return self.q.upload_token(self.bucket_name, key, expires, upload_policy)
    
    def get_upload_config(self, file_type: Optional[str] = None, expires: int = 3600) -> Dict[str, Any]:
        """获取完整的上传配置信息（用于前端直传）
        
        Args:
            file_type: 文件类型，用于生成特定前缀的路径
            expires: token过期时间，单位秒
            
        Returns:
            包含token、上传地址、存储域名等信息的配置字典
        """
        # 生成唯一key前缀（可选）
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        key_prefix = f"uploads/{file_type or 'general'}/{timestamp}_{unique_id}_"
        
        # 生成token
        token = self.get_token(None, expires=expires)
        
        # 构建上传配置
        protocol = "https" if getattr(settings, 'USE_HTTPS', False) else "http"
        
        return {
            "token": token,
            "key_prefix": key_prefix,
            "upload_url": "https://up.qiniup.com",  # 七牛云默认上传地址
            "upload_url_v2": "https://upload.qiniup.com",  # 七牛云v2版本上传地址
            "domain": f"{protocol}://{self.domain}",
            "expires_in": expires,
            "max_file_size": settings.MAX_FILE_SIZE,
            "allowed_types": settings.ALLOWED_FILE_TYPES.get(file_type, []) if file_type else []
        }
    
    def generate_unique_key(self, original_filename: str, file_type: Optional[str] = None) -> str:
        """生成唯一的文件存储键名
        
        Args:
            original_filename: 原始文件名
            file_type: 文件类型分类
            
        Returns:
            唯一的文件存储键名
        """
        # 获取文件扩展名
        ext = os.path.splitext(original_filename)[1] if original_filename else ''
        # 生成唯一文件名：时间戳_随机UUID.扩展名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        type_prefix = file_type or "general"
        return f"uploads/{type_prefix}/{timestamp}_{unique_id}{ext}"
    
    def validate_file_info(self, filename: str, file_size: int, file_type: Optional[str] = None) -> Dict[str, Any]:
        """验证文件信息（前端上传后调用）
        
        Args:
            filename: 文件名
            file_size: 文件大小（字节）
            file_type: 文件类型分类
            
        Returns:
            包含验证结果和错误信息的字典
        """
        # 检查文件大小
        if file_size > settings.MAX_FILE_SIZE:
            return {
                "valid": False,
                "error": f"文件大小超过限制，最大允许 {settings.MAX_FILE_SIZE // (1024 * 1024)}MB",
                "code": "FILE_TOO_LARGE"
            }
        
        # 检查文件类型
        if file_type and file_type in settings.ALLOWED_FILE_TYPES:
            ext = os.path.splitext(filename)[1].lower()
            if ext not in settings.ALLOWED_FILE_TYPES[file_type]:
                return {
                    "valid": False,
                    "error": f"不支持的文件类型，请上传以下格式: {', '.join(settings.ALLOWED_FILE_TYPES[file_type])}",
                    "code": "INVALID_FILE_TYPE"
                }
        
        return {"valid": True}
    
    def format_file_url(self, key: str) -> str:
        """格式化文件URL
        
        Args:
            key: 文件在七牛云的存储键名
            
        Returns:
            完整的文件访问URL
        """
        protocol = "https" if getattr(settings, 'USE_HTTPS', False) else "http"
        return f"{protocol}://{self.domain}/{key}"
    
    def delete_file(self, key: str) -> bool:
        """从七牛云删除文件"""
        try:
            from qiniu import BucketManager
            bucket = BucketManager(self.q)
            ret, info = bucket.delete(self.bucket_name, key)
            return ret is None and info.status_code == 200
        except Exception:
            return False
            
    def create_callback_policy(self, callback_url: str, callback_body: str = 'filename=$(fname)&filesize=$(fsize)') -> Dict:
        """创建回调策略
        
        Args:
            callback_url: 回调URL
            callback_body: 回调内容格式
            
        Returns:
            回调策略字典
        """
        return {
            'callbackUrl': callback_url,
            'callbackBody': callback_body
        }


# 创建全局存储服务实例
storage_service = QiniuStorageService()