"""Pydantic configuration models for reading environment variables."""
from pydantic import validator, Field
from pydantic_settings import BaseSettings
from typing import Optional, List, Dict


# 在Settings类中添加以下配置项
class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Sniper YOLO Backend"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI backend for Sniper YOLO application"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # Security Settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Database Settings
    # DATABASE_URL: Optional[str] = "sqlite:///./sniper_yolo.db"
    MONGODB_URL: Optional[str] = "mongodb://localhost:27017"
    DATABASE_NAME: Optional[str] = "sniper_yolo"
    
    # YOLO Settings
    YOLO_MODEL_PATH: str = "./models/yolo.pt"
    YOLO_CONFIDENCE_THRESHOLD: float = 0.5
    YOLO_IOU_THRESHOLD: float = 0.45
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        """Parse CORS origins from comma-separated string or list."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    # 七牛云配置
    QINIU_ACCESS_KEY: str = Field(default="", description="七牛云AccessKey")
    QINIU_SECRET_KEY: str = Field(default="", description="七牛云SecretKey") 
    QINIU_BUCKET_NAME: str = Field(default="", description="七牛云存储桶名称")
    QINIU_DOMAIN: str = Field(default="", description="七牛云CDN域名")
    
    # 文件上传限制
    MAX_FILE_SIZE: int = Field(default=100 * 1024 * 1024, description="最大文件大小 (100MB)")
    ALLOWED_FILE_TYPES: Dict[str, List[str]] = Field(
        default={
            "image": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
            "audio": [".mp3", ".wav", ".ogg", ".aac"],
            "video": [".mp4", ".flv", ".avi", ".mov", ".wmv"],
            "document": [".pdf", ".doc", ".docx", ".txt", ".xlsx", ".pptx"]
        },
        description="允许的文件类型"
    )

settings = Settings()