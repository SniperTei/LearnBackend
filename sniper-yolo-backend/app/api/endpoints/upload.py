from fastapi import APIRouter, HTTPException, Query, Body, UploadFile, File
from typing import Optional, Dict, Any, List
import json
import time
from datetime import datetime
import uuid

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
    folder: Optional[str] = Query(
        default=None,
        description="自定义文件夹路径，不传则使用默认文件夹"
    ),
    expires: Optional[int] = Query(
        default=3600,
        description="token有效期，单位秒，默认3600秒"
    )
) -> ApiSuccessResponse:
    """
    获取七牛云上传配置，用于前端直传

    - **file_type**: 可选，文件类型分类，用于生成特定路径前缀
    - **folder**: 可选，自定义文件夹路径，如 'foods' 或 'uploads/2026/02'
    - **expires**: 可选，token有效期，单位秒，默认3600秒

    返回包含token、上传地址、域名等完整上传配置信息

    **示例**:
    - 使用默认文件夹: POST /api/v1/upload/config
    - 指定文件夹: POST /api/v1/upload/config?folder=foods
    - 按类型分类: POST /api/v1/upload/config?file_type=image
    - 组合使用: POST /api/v1/upload/config?folder=foods&file_type=image
    """
    try:
        # 验证文件类型参数
        if file_type and file_type not in settings.ALLOWED_FILE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件类型分类，请使用以下值: {', '.join(settings.ALLOWED_FILE_TYPES.keys())}"
            )

        # 获取上传配置（现在支持folder参数）
        config = storage_service.get_upload_config(file_type=file_type, folder=folder, expires=expires)

        return ApiSuccessResponse.create(data=config, msg="获取上传配置成功")
    except ValueError as e:
        # 处理文件夹验证错误
        raise HTTPException(status_code=400, detail=str(e))
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
        description="回调内容格式，默认为'filename=$(fname)&filesize=$(fsize)'"
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
        default=None,
        description="上传文件夹，不传则使用默认文件夹"
    )
) -> ApiSuccessResponse:
    """
    获取七牛云上传token，用于前端直传

    - **key**: 可选，上传后保存的文件名
    - **callback_url**: 可选，上传成功后的回调URL
    - **callback_body**: 可选，回调内容格式，默认为'filename=$(fname)&filesize=$(fsize)'
    - **expires**: 可选，token有效期，单位秒，默认3600秒
    - **policy_json**: 可选，自定义上传策略的JSON字符串，优先级高于其他策略参数
    - **folder**: 可选，上传文件夹路径

    **示例**:
    - 使用默认文件夹: POST /api/v1/upload/token
    - 指定文件夹: POST /api/v1/upload/token?folder=foods/images
    """
    try:
        # 验证文件夹路径
        folder_validation = storage_service.validate_folder_path(folder)
        if not folder_validation["valid"]:
            raise HTTPException(status_code=400, detail=folder_validation["error"])

        normalized_folder = folder_validation["normalized_folder"]

        # 处理文件夹逻辑
        key_with_folder = key
        folder_prefix = None

        if normalized_folder:
            # 确保folder以/结尾
            folder_prefix = normalized_folder if normalized_folder.endswith('/') else normalized_folder + '/'

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
        protocol = "https" if settings.USE_HTTPS else "http"
        domain = f"{protocol}://{settings.QINIU_DOMAIN}"

        # 构造响应数据
        response_data = {
            "token": token,
            "domain": domain,
            "upload_url": settings.QINIU_UPLOAD_URL,  # 使用配置的上传地址
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

        # 获取当前时间戳
        save_time = datetime.now().isoformat()

        # TODO: 这里可以添加保存文件信息到数据库的逻辑
        # 例如：保存到PostgreSQL数据库
        # from app.models.uploaded_file import UploadedFile
        # from sqlalchemy import select
        # uploaded_file = UploadedFile(
        #     key=key,
        #     filename=filename,
        #     size=size,
        #     url=file_url,
        #     hash=hash,
        #     file_type=file_type,
        #     created_at=datetime.now()
        # )
        # db.add(uploaded_file)
        # await db.commit()

        # 构建返回结果
        result = {
            "key": key,
            "filename": filename,
            "size": size,
            "url": file_url,
            "hash": hash,
            "file_type": file_type,
            "save_time": save_time
        }

        return ApiSuccessResponse.create(data=result, msg="保存文件信息成功")
    except HTTPException:
        raise
    except Exception as e:
        return ApiErrorResponse.create(code="SAVE_FILE_ERROR", status_code=500, msg=f"保存文件信息失败: {str(e)}")


@router.post("/image", summary="上传单张图片", response_model=ApiSuccessResponse)
async def upload_image(
    file: UploadFile = File(..., description="图片文件")
) -> ApiSuccessResponse:
    """
    上传单张图片到七牛云

    - **file**: 图片文件，支持jpg、png、gif等常见图片格式

    返回包含图片URL的响应数据

    **示例请求**:
    - POST /api/v1/upload/image (multipart/form-data)
    """
    try:
        # 验证文件类型
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="只支持上传图片文件")

        # 读取文件内容
        file_content = await file.read()
        file_size = len(file_content)

        # 验证文件大小（使用配置的限制）
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"图片大小不能超过{settings.MAX_FILE_SIZE // (1024*1024)}MB"
            )

        # 使用 storage_service 生成带环境前缀的唯一文件名
        from app.services.storage_service import storage_service
        unique_key = storage_service.generate_unique_key(
            original_filename=file.filename,
            file_type="image",
            folder=None  # 使用默认文件夹 QINIU_DEFAULT_FOLDER
        )

        # 添加调试日志
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"上传图片 - 原始文件名: {file.filename}, 生成的七牛key: {unique_key}")
        logger.info(f"当前环境配置 - ENVIRONMENT: {settings.ENVIRONMENT}, QINIU_DEFAULT_FOLDER: {settings.QINIU_DEFAULT_FOLDER}")

        # 使用七牛云的SDK上传文件
        from qiniu import Auth, put_data

        # 生成上传凭证
        q = Auth(settings.QINIU_ACCESS_KEY, settings.QINIU_SECRET_KEY)

        # 生成上传token
        token = q.upload_token(settings.QINIU_BUCKET_NAME, unique_key, 3600)

        # 上传文件到七牛云
        ret, info = put_data(token, unique_key, file_content)

        # 检查上传是否成功
        if ret and ret.get('key'):
            # 生成完整的图片URL
            file_url = storage_service.format_file_url(unique_key)

            # 构建返回结果
            result = {
                "url": file_url,
                "key": unique_key,
                "filename": file.filename,
                "size": file_size,
                "hash": ret.get('hash')
            }

            return ApiSuccessResponse.create(data=result, msg="上传图片成功")
        else:
            raise HTTPException(status_code=500, detail="上传失败，七牛云返回错误")

    except HTTPException:
        raise
    except Exception as e:
        return ApiErrorResponse.create(code="UPLOAD_IMAGE_ERROR", status_code=500, msg=f"上传图片失败: {str(e)}")


@router.post("/images", summary="上传多张图片", response_model=ApiSuccessResponse)
async def upload_images(
    files: List[UploadFile] = File(..., description="图片文件列表")
) -> ApiSuccessResponse:
    """
    上传多张图片到七牛云

    - **files**: 图片文件列表，支持jpg、png、gif等常见图片格式

    返回包含图片URL列表的响应数据

    **示例请求**:
    - POST /api/v1/upload/images (multipart/form-data)
    """
    try:
        if not files or len(files) == 0:
            raise HTTPException(status_code=400, detail="请至少选择一张图片")

        # 限制最多上传数量
        max_files = 9
        if len(files) > max_files:
            raise HTTPException(status_code=400, detail=f"最多只能上传{max_files}张图片")

        from qiniu import Auth, put_data

        # 生成上传凭证
        q = Auth(settings.QINIU_ACCESS_KEY, settings.QINIU_SECRET_KEY)

        uploaded_files = []
        errors = []

        for index, file in enumerate(files):
            try:
                # 验证文件类型
                if not file.content_type or not file.content_type.startswith("image/"):
                    errors.append(f"文件{index+1}不是图片文件")
                    continue

                # 读取文件内容
                file_content = await file.read()
                file_size = len(file_content)

                # 验证文件大小（使用配置的限制）
                if file_size > settings.MAX_FILE_SIZE:
                    errors.append(f"文件{index+1}超过{settings.MAX_FILE_SIZE // (1024*1024)}MB")
                    continue

                # 使用 storage_service 生成带环境前缀的唯一文件名
                from app.services.storage_service import storage_service
                unique_key = storage_service.generate_unique_key(
                    original_filename=file.filename,
                    file_type="image",
                    folder=None  # 使用默认文件夹 QINIU_DEFAULT_FOLDER
                )

                # 添加调试日志
                import logging
                logger = logging.getLogger(__name__)
                logger.info(f"批量上传[{index+1}] - 原始文件名: {file.filename}, 生成的七牛key: {unique_key}")

                # 生成上传token
                token = q.upload_token(settings.QINIU_BUCKET_NAME, unique_key, 3600)

                # 上传文件到七牛云
                ret, info = put_data(token, unique_key, file_content)

                if ret and ret.get('key'):
                    # 生成完整的图片URL
                    file_url = storage_service.format_file_url(unique_key)

                    uploaded_files.append({
                        "url": file_url,
                        "key": unique_key,
                        "filename": file.filename,
                        "size": file_size,
                        "hash": ret.get('hash')
                    })
                else:
                    errors.append(f"文件{index+1}上传失败")

            except Exception as e:
                errors.append(f"文件{index+1}处理失败: {str(e)}")

        # 构建返回结果
        result = {
            "success_count": len(uploaded_files),
            "files": uploaded_files
        }

        if errors:
            result["errors"] = errors

        msg = f"成功上传{len(uploaded_files)}张图片"
        if errors:
            msg += f"，{len(errors)}张失败"

        return ApiSuccessResponse.create(data=result, msg=msg)

    except HTTPException:
        raise
    except Exception as e:
        return ApiErrorResponse.create(code="UPLOAD_IMAGES_ERROR", status_code=500, msg=f"批量上传图片失败: {str(e)}")
