from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, Dict, Any
import json
import time

from app.services.storage_service import storage_service
from app.core.config import settings
from app.utils.response import ApiSuccessResponse, ApiErrorResponse

router = APIRouter()


@router.post("/config", summary="获取上传配置", response_model=ApiSuccessResponse)
async def get_upload_config(
    file_type: Optional[str] = Query(
        default=None,
        description="文件类型分类(image/audio/video/document)，用于生成特定路径前缀和验证规则"
    ),
    expires: Optional[int] = Query(
        default=3600,
        description="token有效期，单位秒，默认3600秒"
    )
) -> ApiSuccessResponse:
    """
    获取七牛云上传配置，用于前端直传
    
    - **file_type**: 可选，文件类型分类，用于生成特定路径前缀
    - **expires**: 可选，token有效期，单位秒，默认3600秒
    
    返回包含token、上传地址、域名等完整上传配置信息
    """
    try:
        # 验证文件类型参数
        if file_type and file_type not in settings.ALLOWED_FILE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件类型分类，请使用以下值: {', '.join(settings.ALLOWED_FILE_TYPES.keys())}"
            )
        
        # 获取上传配置
        config = storage_service.get_upload_config(file_type=file_type, expires=expires)
        
        return ApiSuccessResponse.create(data=config, msg="获取上传配置成功")
    except HTTPException:
        raise
    except Exception as e:
        return ApiErrorResponse.create(code="UPLOAD_CONFIG_ERROR", status_code=500, msg=f"获取上传配置失败: {str(e)}")


# 同时支持新旧路径，确保兼容性
@router.post("/token", summary="获取上传token", response_model=ApiSuccessResponse)
async def get_upload_token(
    key: Optional[str] = Query(
        default=None,
        description="可选的文件key，不传则使用默认生成的文件名"
    ),
    callback_url: Optional[str] = Query(
        default=None,
        description="上传成功后的回调URL"
    ),
    callback_body: Optional[str] = Query(
        default="filename=$(fname)&filesize=$(fsize)",
        description="回调内容格式，默认为'filename=$(fname)&filesize=$(fsize)')"
    ),
    expires: Optional[int] = Query(
        default=3600,
        description="token有效期，单位秒，默认3600秒"
    ),
    policy_json: Optional[str] = Query(
        default=None,
        description="自定义上传策略的JSON字符串，优先级高于其他策略参数"
    ),
    folder: Optional[str] = Query(
        default="sniper-yolo",
        description="上传文件夹，默认为sniper-yolo"
    )
) -> ApiSuccessResponse:
    """
    获取七牛云上传token，用于前端直传
    
    - **key**: 可选，上传后保存的文件名
    - **callback_url**: 可选，上传成功后的回调URL
    - **callback_body**: 可选，回调内容格式，默认为'filename=$(fname)&filesize=$(fsize)'
    - **expires**: 可选，token有效期，单位秒，默认3600秒
    - **policy_json**: 可选，自定义上传策略的JSON字符串，优先级高于其他策略参数
    """
    try:
        # 处理文件夹逻辑
        key_with_folder = key
        folder_prefix = None
        
        if folder:
            # 确保folder以/结尾
            folder_prefix = folder if folder.endswith('/') else folder + '/'
            
            # 如果提供了key，则添加文件夹前缀
            if key:
                # 确保key不以/开头，避免重复斜杠
                key_with_folder = folder_prefix + (key.lstrip('/') if key.startswith('/') else key)
        
        # 构建上传策略
        policy = None
        if policy_json:
            try:
                policy = json.loads(policy_json)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="无效的策略JSON格式")
        elif callback_url:
            policy = storage_service.create_callback_policy(callback_url, callback_body)
        else:
            # 创建默认策略
            policy = {
                'isPrefixalScope': 1,
                'deadline': int(time.time()) + expires,
                'returnBody': json.dumps({
                    'key': '$(key)',
                    'hash': '$(etag)',
                    'fsize': '$(fsize)',
                    'name': '$(x:name)'
                }),
            }
            
            # 如果指定了文件夹前缀，在策略中限制上传范围
            if folder_prefix:
                # 当isPrefixalScope=1时，scope只需要是bucket:prefix，不需要加*
                # 这样可以确保上传的文件必须以prefix开头
                policy['scope'] = f"{settings.QINIU_BUCKET_NAME}:{folder_prefix}"
                # 确保isPrefixalScope为1，表示允许前缀匹配
                policy['isPrefixalScope'] = 1
        
        # 使用storage_service获取token
        # 当使用isPrefixalScope=1时，不需要传递key参数
        # 这样前端可以自行决定文件名，但必须使用指定的前缀
        token = storage_service.get_token(key_with_folder, policy=policy, expires=expires)
        
        # 构建完整的上传URL和domain
        protocol = "https" if getattr(settings, 'USE_HTTPS', False) else "http"
        domain = f"{protocol}://{settings.QINIU_DOMAIN}"
        
        # 构造响应数据
        response_data = {
            "token": token,
            "domain": domain,
            "upload_url": "https://up-z2.qiniup.com",  # 七牛云新加坡区域(z2)上传地址
            "expires_in": expires,
            # 添加建议的key格式，提示前端应该使用什么前缀
            "suggested_key_prefix": folder_prefix if folder_prefix else ""
        }
        
        # 如果有folder信息，添加到响应中
        if folder_prefix:
            response_data["folder"] = folder_prefix
        
        # 如果有policy信息，添加到响应中
        if policy:
            response_data["policy"] = policy
        
        return ApiSuccessResponse.create(data=response_data, msg="获取上传令牌成功")
    except HTTPException:
        raise
    except Exception as e:
        return ApiErrorResponse.create(code="UPLOAD_TOKEN_ERROR", status_code=500, msg=f"获取上传token失败: {str(e)}")


@router.post("/save", summary="保存文件信息", response_model=ApiSuccessResponse)
async def save_file_info(
    key: str = Body(..., description="文件在七牛云的存储键名"),
    filename: str = Body(..., description="原始文件名"),
    size: int = Body(..., description="文件大小，单位字节"),
    hash: Optional[str] = Body(None, description="文件哈希值"),
    file_type: Optional[str] = Body(None, description="文件类型分类")
) -> ApiSuccessResponse:
    """
    保存文件信息（前端直传成功后调用）
    
    - **key**: 文件在七牛云的存储键名
    - **filename**: 原始文件名
    - **size**: 文件大小，单位字节
    - **hash**: 可选，文件哈希值
    - **file_type**: 可选，文件类型分类
    """
    try:
        # 验证文件信息
        validation = storage_service.validate_file_info(filename, size, file_type)
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail=validation["error"])
        
        # 生成完整文件URL
        file_url = storage_service.format_file_url(key)
        
        # TODO: 这里可以添加保存文件信息到数据库的逻辑
        # 例如：保存到MongoDB或其他数据库
        
        # 构建返回结果
        result = {
            "key": key,
            "filename": filename,
            "size": size,
            "url": file_url,
            "hash": hash,
            "file_type": file_type,
            "save_time": json.dumps(0)  # 这里先用占位符，实际应该使用时间戳或ISO格式时间
        }
        
        return ApiSuccessResponse.create(data=result, msg="保存文件信息成功")
    except HTTPException:
        raise
    except Exception as e:
        return ApiErrorResponse.create(code="SAVE_FILE_ERROR", status_code=500, msg=f"保存文件信息失败: {str(e)}")