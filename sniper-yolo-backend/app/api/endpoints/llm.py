"""LLM相关API端点 - 使用统一响应格式"""
import logging

from typing import Any
from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse

from app.schemas.llm import (
    LLMGenerateRequest,
    LLMChatRequest,
    LLMGenerateResponse,
    LLMChatResponse
)
from app.services.llm_service import LLMService
from app.core.dependencies import get_llm_service
from app.utils.response import ApiSuccessResponse, ApiErrorResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate", response_model=ApiSuccessResponse)
async def generate_text(
    request: LLMGenerateRequest,
    llm_service: LLMService = Depends(get_llm_service)
) -> ApiSuccessResponse:
    """生成文本 - 非流式输出"""
    try:
        logger.info(f"收到文本生成请求: model={request.model}, prompt_length={len(request.prompt)}")
        
        result = await llm_service.generate(request)
        
        response_data = {
            "response": result.get("response", ""),
            "model": result.get("model", request.model),
            "done": result.get("done", True),
            "context": result.get("context"),
            "total_duration": result.get("total_duration"),
            "load_duration": result.get("load_duration"),
            "prompt_eval_count": result.get("prompt_eval_count"),
            "eval_count": result.get("eval_count")
        }
        
        logger.info(f"文本生成成功: eval_count={result.get('eval_count', 0)} tokens")
        
        return ApiSuccessResponse.create(
            data=response_data,
            msg="文本生成成功"
        )
        
    except Exception as e:
        logger.error(f"文本生成失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"文本生成失败: {str(e)}"
        )


@router.post("/generate/stream")
async def generate_text_stream(
    request: LLMGenerateRequest,
    llm_service: LLMService = Depends(get_llm_service)
) -> StreamingResponse:
    """生成文本 - 流式输出"""
    try:
        logger.info(f"收到流式文本生成请求: model={request.model}, prompt_length={len(request.prompt)}")
        
        async def generate():
            async for chunk in llm_service.generate_stream(request):
                yield chunk
        
        return StreamingResponse(
            generate(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )
        
    except Exception as e:
        logger.error(f"流式文本生成失败: {str(e)}", exc_info=True)
        raise Exception(f"流式文本生成失败: {str(e)}")


@router.post("/chat", response_model=ApiSuccessResponse)
async def chat(
    request: LLMChatRequest,
    llm_service: LLMService = Depends(get_llm_service)
) -> ApiSuccessResponse:
    """对话模式 - 非流式输出"""
    try:
        logger.info(f"收到对话请求: model={request.model}, messages_count={len(request.messages)}")
        
        result = await llm_service.chat(request)
        
        response_data = {
            "message": result.get("message", {}),
            "model": result.get("model", request.model),
            "done": result.get("done", True),
            "total_duration": result.get("total_duration"),
            "load_duration": result.get("load_duration"),
            "prompt_eval_count": result.get("prompt_eval_count"),
            "eval_count": result.get("eval_count")
        }
        
        logger.info(f"对话成功: eval_count={result.get('eval_count', 0)} tokens")
        
        return ApiSuccessResponse.create(
            data=response_data,
            msg="对话成功"
        )
        
    except Exception as e:
        logger.error(f"对话失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"对话失败: {str(e)}"
        )


@router.post("/chat/stream")
async def chat_stream(
    request: LLMChatRequest,
    llm_service: LLMService = Depends(get_llm_service)
) -> StreamingResponse:
    """对话模式 - 流式输出"""
    try:
        logger.info(f"收到流式对话请求: model={request.model}, messages_count={len(request.messages)}")
        
        async def generate():
            async for chunk in llm_service.chat_stream(request):
                yield chunk
        
        return StreamingResponse(
            generate(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )
        
    except Exception as e:
        logger.error(f"流式对话失败: {str(e)}", exc_info=True)
        raise Exception(f"流式对话失败: {str(e)}")


@router.get("/models", response_model=ApiSuccessResponse)
async def list_models(
    llm_service: LLMService = Depends(get_llm_service)
) -> ApiSuccessResponse:
    """获取可用模型列表"""
    try:
        logger.info("获取模型列表")
        
        result = await llm_service.list_models()
        
        models = result.get("models", [])
        models_data = []
        
        for model in models:
            models_data.append({
                "name": model.get("name", ""),
                "modified_at": model.get("modified_at"),
                "size": model.get("size"),
                "digest": model.get("digest"),
                "details": model.get("details", {})
            })
        
        logger.info(f"获取模型列表成功: {len(models_data)} models")
        
        return ApiSuccessResponse.create(
            data={
                "models": models_data,
                "total": len(models_data)
            },
            msg="获取模型列表成功"
        )
        
    except Exception as e:
        logger.error(f"获取模型列表失败: {str(e)}", exc_info=True)
        return ApiErrorResponse.create(
            code="B00500",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            msg=f"获取模型列表失败: {str(e)}"
        )
