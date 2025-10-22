import os
import uuid
from typing import Dict, Optional, Tuple
from datetime import datetime

from qiniu import Auth, put_file, put_data
from fastapi import UploadFile
from app.core.config import settings


class QiniuStorageService:
    """七牛云存储服务"""
    
    def __init__(self):
        self.access_key = settings.QINIU_ACCESS_KEY
        self.secret_key = settings.QINIU_SECRET_KEY
        self.bucket_name = settings.QINIU_BUCKET_NAME
        self.domain = settings.QINIU_DOMAIN
        self.q = Auth(self.access_key, self.secret_key)
    
    def get_token(self, key: Optional[str] = None) -> str:
        """获取上传token"""
        return self.q.upload_token(self.bucket_name, key, 3600)
    
    def generate_unique_filename(self, file: UploadFile) -> str:
        """生成唯一的文件名"""
        # 获取文件扩展名
        ext = os.path.splitext(file.filename)[1] if file.filename else ''
        # 生成唯一文件名：时间戳_随机UUID.扩展名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"uploads/{timestamp}_{unique_id}{ext}"
    
    async def upload_file(self, file: UploadFile) -> Tuple[bool, Dict]:
        """上传文件到七牛云
        
        Args:
            file: FastAPI上传的文件对象
            
        Returns:
            (成功标志, 结果字典) 成功时包含file_url, file_key等信息，失败时包含error信息
        """
        try:
            # 读取文件数据
            file_data = await file.read()
            
            # 生成唯一文件名
            key = self.generate_unique_filename(file)
            
            # 获取上传token
            token = self.get_token(key)
            
            # 上传文件数据
            ret, info = put_data(token, key, file_data)
            
            if ret is not None:
                # 上传成功
                file_url = f"http://{self.domain}/{key}"
                return True, {
                    "file_url": file_url,
                    "file_key": key,
                    "filename": file.filename,
                    "size": len(file_data),
                    "upload_time": datetime.now().isoformat()
                }
            else:
                # 上传失败
                return False, {
                    "error": f"七牛云上传失败: {str(info)}",
                    "status_code": info.status_code if hasattr(info, 'status_code') else 500
                }
                
        except Exception as e:
            return False, {"error": str(e), "status_code": 500}
    
    def delete_file(self, key: str) -> bool:
        """从七牛云删除文件"""
        try:
            from qiniu import BucketManager
            bucket = BucketManager(self.q)
            ret, info = bucket.delete(self.bucket_name, key)
            return ret is None and info.status_code == 200
        except Exception:
            return False


# 创建全局存储服务实例
storage_service = QiniuStorageService()