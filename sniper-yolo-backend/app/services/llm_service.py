"""LLM service for Zhipu BigModel API calls (OpenAI-compatible)."""
import logging
import json
import httpx
from typing import Optional, Dict, Any, AsyncIterator
from app.schemas.llm import LLMGenerateRequest, LLMChatRequest

logger = logging.getLogger(__name__)


class LLMService:
    """Service class for LLM operations using Zhipu BigModel API."""

    def __init__(self, api_key: str = "", base_url: str = "https://open.bigmodel.cn/api/paas/v4", default_model: str = "glm-5.1"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.default_model = default_model
        self.chat_url = f"{self.base_url}/chat/completions"
        self._headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

    async def generate(self, request: LLMGenerateRequest) -> Dict[str, Any]:
        """Generate text using chat completions (BigModel has no generate endpoint)."""
        try:
            messages = [{"role": "user", "content": request.prompt}]
            payload = self._build_payload(request.model, messages, stream=False,
                                          temperature=request.temperature, top_p=request.top_p,
                                          max_tokens=request.max_tokens)

            logger.info(f"Calling BigModel API: {self.chat_url}, model={request.model}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(self.chat_url, json=payload, headers=self._headers)
                response.raise_for_status()
                result = response.json()

            return self._adapt_response(result, request.model)

        except httpx.HTTPError as e:
            logger.error(f"BigModel API HTTP error: {str(e)}")
            raise Exception(f"BigModel API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"BigModel API error: {str(e)}")
            raise Exception(f"调用大模型失败: {str(e)}")

    async def generate_stream(self, request: LLMGenerateRequest) -> AsyncIterator[str]:
        """Generate text with SSE streaming."""
        try:
            messages = [{"role": "user", "content": request.prompt}]
            payload = self._build_payload(request.model, messages, stream=True,
                                          temperature=request.temperature, top_p=request.top_p,
                                          max_tokens=request.max_tokens)

            logger.info(f"Calling BigModel API with streaming: model={request.model}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream("POST", self.chat_url, json=payload, headers=self._headers) as response:
                    response.raise_for_status()
                    async for chunk in self._parse_sse(response):
                        yield chunk

        except httpx.HTTPError as e:
            logger.error(f"BigModel API streaming HTTP error: {str(e)}")
            raise Exception(f"BigModel API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"BigModel API streaming error: {str(e)}")
            raise Exception(f"调用大模型失败: {str(e)}")

    async def chat(self, request: LLMChatRequest) -> Dict[str, Any]:
        """Chat with LLM via BigModel API."""
        try:
            messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
            payload = self._build_payload(request.model, messages, stream=False,
                                          temperature=request.temperature, top_p=request.top_p,
                                          max_tokens=request.max_tokens)

            logger.info(f"Calling BigModel Chat API: model={request.model}, messages={len(messages)}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(self.chat_url, json=payload, headers=self._headers)
                response.raise_for_status()
                result = response.json()

            return self._adapt_response(result, request.model)

        except httpx.HTTPError as e:
            logger.error(f"BigModel Chat API HTTP error: {str(e)}")
            raise Exception(f"BigModel Chat API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"BigModel Chat API error: {str(e)}")
            raise Exception(f"调用大模型对话失败: {str(e)}")

    async def chat_stream(self, request: LLMChatRequest) -> AsyncIterator[str]:
        """Chat with SSE streaming."""
        try:
            messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
            payload = self._build_payload(request.model, messages, stream=True,
                                          temperature=request.temperature, top_p=request.top_p,
                                          max_tokens=request.max_tokens)

            logger.info(f"Calling BigModel Chat API with streaming: model={request.model}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream("POST", self.chat_url, json=payload, headers=self._headers) as response:
                    response.raise_for_status()
                    async for chunk in self._parse_sse(response):
                        yield chunk

        except httpx.HTTPError as e:
            logger.error(f"BigModel Chat API streaming HTTP error: {str(e)}")
            raise Exception(f"BigModel Chat API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"BigModel Chat API streaming error: {str(e)}")
            raise Exception(f"调用大模型对话失败: {str(e)}")

    async def list_models(self) -> Dict[str, Any]:
        """Return static model list (BigModel has no list models endpoint)."""
        models = [
            {"name": "glm-5.1", "details": {"description": "智谱 GLM-5.1"}},
            {"name": "glm-4-plus", "details": {"description": "智谱 GLM-4 Plus"}},
            {"name": "glm-4-flash", "details": {"description": "智谱 GLM-4 Flash (免费)"}},
        ]
        return {"models": models}

    def _build_payload(self, model: str, messages: list, stream: bool,
                       temperature: float, top_p: float, max_tokens: int) -> Dict[str, Any]:
        """Build request payload for BigModel API."""
        payload: Dict[str, Any] = {
            "model": model or self.default_model,
            "messages": messages,
            "stream": stream,
        }
        if temperature is not None:
            payload["temperature"] = temperature
        if top_p is not None:
            payload["top_p"] = top_p
        if max_tokens is not None:
            payload["max_tokens"] = max_tokens
        return payload

    def _adapt_response(self, result: Dict[str, Any], model: str) -> Dict[str, Any]:
        """Adapt BigModel response to match frontend expected format.

        BigModel returns: {choices: [{message: {content: ...}}]}
        Frontend expects: {message: {content: ...}, response: ...}
        """
        content = ""
        choices = result.get("choices", [])
        if choices:
            content = choices[0].get("message", {}).get("content", "")

        usage = result.get("usage", {})
        return {
            "message": {"role": "assistant", "content": content},
            "response": content,
            "model": result.get("model", model),
            "done": True,
            "eval_count": usage.get("completion_tokens", 0),
            "prompt_eval_count": usage.get("prompt_tokens", 0),
        }

    async def _parse_sse(self, response: httpx.Response) -> AsyncIterator[str]:
        """Parse SSE stream from BigModel API."""
        async for line in response.aiter_lines():
            if line.startswith("data: "):
                data = line[6:]
                if data.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(data)
                    choices = chunk.get("choices", [])
                    if choices:
                        delta = choices[0].get("delta", {})
                        content = delta.get("content", "")
                        if content:
                            yield content
                except json.JSONDecodeError:
                    continue
