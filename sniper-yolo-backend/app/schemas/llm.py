"""Pydantic models for LLM requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class LLMGenerateRequest(BaseModel):
    """Request model for LLM text generation."""
    model: str = Field(..., description="模型名称，如 deepseek-r1:1.5b")
    prompt: str = Field(..., description="输入提示词")
    stream: bool = Field(default=False, description="是否流式输出")
    temperature: Optional[float] = Field(default=0.8, ge=0.0, le=2.0, description="控制随机性，0-2")
    top_p: Optional[float] = Field(default=0.9, ge=0.0, le=1.0, description="核采样参数，0-1")
    max_tokens: Optional[int] = Field(default=500, ge=1, description="最大生成 token 数")
    num_ctx: Optional[int] = Field(default=2048, ge=1, description="上下文窗口大小")


class LLMChatMessage(BaseModel):
    """Chat message model."""
    role: str = Field(..., description="消息角色：user, assistant, system")
    content: str = Field(..., description="消息内容")


class LLMChatRequest(BaseModel):
    """Request model for LLM chat."""
    model: str = Field(..., description="模型名称，如 deepseek-r1:1.5b")
    messages: List[LLMChatMessage] = Field(..., description="对话消息列表")
    stream: bool = Field(default=False, description="是否流式输出")
    temperature: Optional[float] = Field(default=0.8, ge=0.0, le=2.0, description="控制随机性，0-2")
    top_p: Optional[float] = Field(default=0.9, ge=0.0, le=1.0, description="核采样参数，0-1")
    max_tokens: Optional[int] = Field(default=500, ge=1, description="最大生成 token 数")
    num_ctx: Optional[int] = Field(default=2048, ge=1, description="上下文窗口大小")


class LLMGenerateResponse(BaseModel):
    """Response model for LLM text generation."""
    response: str = Field(..., description="生成的文本")
    model: str = Field(..., description="使用的模型名称")
    done: bool = Field(..., description="是否完成")
    context: Optional[List[int]] = Field(default=None, description="上下文 token 列表")
    total_duration: Optional[int] = Field(default=None, description="总耗时（纳秒）")
    load_duration: Optional[int] = Field(default=None, description="加载耗时（纳秒）")
    prompt_eval_count: Optional[int] = Field(default=None, description="提示词 token 数")
    eval_count: Optional[int] = Field(default=None, description="生成 token 数")


class LLMChatResponse(BaseModel):
    """Response model for LLM chat."""
    message: Dict[str, str] = Field(..., description="生成的消息")
    model: str = Field(..., description="使用的模型名称")
    done: bool = Field(..., description="是否完成")
    total_duration: Optional[int] = Field(default=None, description="总耗时（纳秒）")
    load_duration: Optional[int] = Field(default=None, description="加载耗时（纳秒）")
    prompt_eval_count: Optional[int] = Field(default=None, description="提示词 token 数")
    eval_count: Optional[int] = Field(default=None, description="生成 token 数")
