from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import Optional, Dict, List
import os

from app.services.storage_service import storage_service
from app.core.config import settings
from app.utils.response import success_response, error_response, ApiSuccessResponse, ApiErrorResponse

router = APIRouter(prefix="/upload", tags=["upload"])


def validate_file(file: UploadFile, file_type: Optional[str] = None) -> None:
    """验证文件类型和大小"""
    # 检查文件大小
    if file.size and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"文件大小超过限制，最大允许 {settings.MAX_FILE_SIZE // (1024 * 1024)}MB"
        )
    
    # 检查文件类型
    if file_type and file_type in settings.ALLOWED_FILE_TYPES:
        ext = os.path.splitext(file.filename)[1].lower() if file.filename else ''
        if ext not in settings.ALLOWED_FILE_TYPES[file_type]:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件类型，请上传以下格式: {', '.join(settings.ALLOWED_FILE_TYPES[file_type])}"
            )


@router.post("/file", summary="上传单个文件", response_model=ApiSuccessResponse)
async def upload_single_file(
    file: UploadFile = File(...),
    file_type: Optional[str] = Query(
        None,
        description="文件类型(image/audio/video/document)，用于文件格式验证"
    )
) -> ApiSuccessResponse:
    """
    上传单个文件到七牛云存储
    
    - **file**: 要上传的文件
    - **file_type**: 可选，指定文件类型(image/audio/video/document)，用于验证文件格式
    """
    try:
        # 验证文件
        validate_file(file, file_type)
        
        # 上传到七牛云
        success, result = await storage_service.upload_file(file)
        
        if success:
            return ApiSuccessResponse.create(data=result, msg="文件上传成功")
        else:
            raise HTTPException(
                status_code=result.get("status_code", 500),
                detail=result.get("error", "文件上传失败")
            )
    except HTTPException:
        raise
    except Exception as e:
        return ApiErrorResponse.create(code="B0001", status_code=500, msg=f"上传文件时发生错误: {str(e)}")


@router.post("/files", summary="批量上传文件", response_model=ApiSuccessResponse)
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    file_type: Optional[str] = Query(
        None,
        description="文件类型(image/audio/video/document)，用于文件格式验证"
    )
) -> ApiSuccessResponse:
    """
    批量上传文件到七牛云存储
    
    - **files**: 要上传的文件列表
    - **file_type**: 可选，指定文件类型(image/audio/video/document)，用于验证文件格式
    """
    results = []
    errors = []
    
    for i, file in enumerate(files):
        try:
            # 验证文件
            validate_file(file, file_type)
            
            # 上传到七牛云
            success, result = await storage_service.upload_file(file)
            
            if success:
                results.append(result)
            else:
                errors.append({
                    "index": i,
                    "filename": file.filename,
                    "error": result.get("error", "上传失败")
                })
                
        except Exception as e:
            errors.append({
                "index": i,
                "filename": file.filename,
                "error": str(e)
            })
    
    return ApiSuccessResponse.create(data={
        "total": len(files),
        "success": len(results),
        "failed": len(errors),
        "results": results,
        "errors": errors
    }, msg="批量上传完成")


@router.post("/token", summary="获取上传token", response_model=ApiSuccessResponse)
async def get_upload_token(
    key: Optional[str] = Query(None, description="可选的文件key，不传则由服务器生成")
) -> ApiSuccessResponse:
    """
    获取七牛云上传token，用于前端直传
    """
    token = storage_service.get_token(key)
    return ApiSuccessResponse.create(data={
        "token": token,
        "domain": settings.QINIU_DOMAIN,
        "expires_in": 3600  # token有效期3600秒
    }, msg="获取上传令牌成功")