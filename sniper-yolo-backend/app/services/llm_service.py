"""LLM service for Ollama API calls."""
import logging
import httpx
from typing import Optional, Dict, Any, AsyncIterator
from app.schemas.llm import LLMGenerateRequest, LLMChatRequest

logger = logging.getLogger(__name__)


class LLMService:
    """Service class for LLM operations using Ollama API."""

    def __init__(self, base_url: str = "http://localhost:11434"):
        """
        Initialize LLM service.

        Args:
            base_url: Ollama API base URL, default is http://localhost:11434
        """
        self.base_url = base_url
        self.generate_url = f"{base_url}/api/generate"
        self.chat_url = f"{base_url}/api/chat"
        self.tags_url = f"{base_url}/api/tags"

    async def generate(self, request: LLMGenerateRequest) -> Dict[str, Any]:
        """
        Generate text using LLM.

        Args:
            request: LLMGenerateRequest object

        Returns:
            Dict containing the generated response

        Raises:
            Exception: If API call fails
        """
        try:
            payload = {
                "model": request.model,
                "prompt": request.prompt,
                "stream": request.stream,
                "options": {
                    "temperature": request.temperature,
                    "top_p": request.top_p,
                    "num_predict": request.max_tokens,
                    "num_ctx": request.num_ctx
                }
            }

            logger.info(f"Calling Ollama API: {self.generate_url}")
            logger.info(f"Request payload: model={request.model}, prompt_length={len(request.prompt)}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(
                    self.generate_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                result = response.json()

            logger.info(f"Ollama API response: eval_count={result.get('eval_count', 0)} tokens")
            return result

        except httpx.HTTPError as e:
            logger.error(f"Ollama API HTTP error: {str(e)}")
            raise Exception(f"Ollama API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"Ollama API error: {str(e)}")
            raise Exception(f"调用大模型失败: {str(e)}")

    async def generate_stream(self, request: LLMGenerateRequest) -> AsyncIterator[str]:
        """
        Generate text using LLM with streaming output.

        Args:
            request: LLMGenerateRequest object

        Yields:
            str: Generated text chunks

        Raises:
            Exception: If API call fails
        """
        try:
            payload = {
                "model": request.model,
                "prompt": request.prompt,
                "stream": True,
                "options": {
                    "temperature": request.temperature,
                    "top_p": request.top_p,
                    "num_predict": request.max_tokens,
                    "num_ctx": request.num_ctx
                }
            }

            logger.info(f"Calling Ollama API with streaming: {self.generate_url}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream(
                    "POST",
                    self.generate_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line:
                            import json
                            result = json.loads(line)
                            if "response" in result:
                                yield result["response"]

        except httpx.HTTPError as e:
            logger.error(f"Ollama API streaming HTTP error: {str(e)}")
            raise Exception(f"Ollama API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"Ollama API streaming error: {str(e)}")
            raise Exception(f"调用大模型失败: {str(e)}")

    async def chat(self, request: LLMChatRequest) -> Dict[str, Any]:
        """
        Chat with LLM.

        Args:
            request: LLMChatRequest object

        Returns:
            Dict containing the chat response

        Raises:
            Exception: If API call fails
        """
        try:
            messages = [
                {"role": msg.role, "content": msg.content}
                for msg in request.messages
            ]

            payload = {
                "model": request.model,
                "messages": messages,
                "stream": request.stream,
                "options": {
                    "temperature": request.temperature,
                    "top_p": request.top_p,
                    "num_predict": request.max_tokens,
                    "num_ctx": request.num_ctx
                }
            }

            logger.info(f"Calling Ollama Chat API: {self.chat_url}")
            logger.info(f"Request payload: model={request.model}, messages_count={len(messages)}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(
                    self.chat_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                result = response.json()

            logger.info(f"Ollama Chat API response: eval_count={result.get('eval_count', 0)} tokens")
            return result

        except httpx.HTTPError as e:
            logger.error(f"Ollama Chat API HTTP error: {str(e)}")
            raise Exception(f"Ollama Chat API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"Ollama Chat API error: {str(e)}")
            raise Exception(f"调用大模型对话失败: {str(e)}")

    async def chat_stream(self, request: LLMChatRequest) -> AsyncIterator[str]:
        """
        Chat with LLM with streaming output.

        Args:
            request: LLMChatRequest object

        Yields:
            str: Generated text chunks

        Raises:
            Exception: If API call fails
        """
        try:
            messages = [
                {"role": msg.role, "content": msg.content}
                for msg in request.messages
            ]

            payload = {
                "model": request.model,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": request.temperature,
                    "top_p": request.top_p,
                    "num_predict": request.max_tokens,
                    "num_ctx": request.num_ctx
                }
            }

            logger.info(f"Calling Ollama Chat API with streaming: {self.chat_url}")

            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream(
                    "POST",
                    self.chat_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line:
                            import json
                            result = json.loads(line)
                            if "message" in result and "content" in result["message"]:
                                yield result["message"]["content"]

        except httpx.HTTPError as e:
            logger.error(f"Ollama Chat API streaming HTTP error: {str(e)}")
            raise Exception(f"Ollama Chat API 调用失败: {str(e)}")
        except Exception as e:
            logger.error(f"Ollama Chat API streaming error: {str(e)}")
            raise Exception(f"调用大模型对话失败: {str(e)}")

    async def list_models(self) -> Dict[str, Any]:
        """
        List available models.

        Returns:
            Dict containing list of available models

        Raises:
            Exception: If API call fails
        """
        try:
            logger.info(f"Listing models from Ollama: {self.tags_url}")

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.tags_url)
                response.raise_for_status()
                result = response.json()

            logger.info(f"Available models: {len(result.get('models', []))} models found")
            return result

        except httpx.HTTPError as e:
            logger.error(f"Ollama API list models HTTP error: {str(e)}")
            raise Exception(f"获取模型列表失败: {str(e)}")
        except Exception as e:
            logger.error(f"Ollama API list models error: {str(e)}")
            raise Exception(f"获取模型列表失败: {str(e)}")
