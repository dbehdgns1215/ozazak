"""
커스텀 LangChain LLM 클래스들
GMS API를 통해 다양한 LLM 모델을 LangChain에서 사용할 수 있도록 래핑
"""
import httpx
import json
import asyncio
from typing import List, Optional, Any, Dict, AsyncGenerator
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, SystemMessage, AIMessageChunk
from langchain_core.outputs import ChatResult, ChatGeneration, ChatGenerationChunk
from langchain_core.callbacks.manager import CallbackManagerForLLMRun

from src.config.settings import settings


class GeminiChatModel(BaseChatModel):
    """Gemini LangChain Chat Model - GMS API 경유"""
    
    model: str = "gemini-2.5-flash-lite-preview-06-17"
    temperature: float = 0.7
    api_key: str = ""
    base_url: str = "https://gms.ssafy.io/gmsapi/generativelanguage.googleapis.com/v1beta"
    
    def __init__(self, model: str = None, temperature: float = None, **kwargs):
        super().__init__(**kwargs)
        self.model = model or settings.gemini_flash_model
        self.temperature = temperature or settings.llm_temperature
        self.api_key = settings.gms_api_key
    
    @property
    def _llm_type(self) -> str:
        return "gemini"
    
    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> ChatResult:
        """동기 생성 - 비동기를 래핑"""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(asyncio.run, self._agenerate(messages, stop, run_manager, **kwargs))
                    return future.result()
            else:
                return loop.run_until_complete(self._agenerate(messages, stop, run_manager, **kwargs))
        except RuntimeError:
            return asyncio.run(self._agenerate(messages, stop, run_manager, **kwargs))
    
    async def _agenerate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> ChatResult:
        """비동기 생성"""
        url = f"{self.base_url}/models/{self.model}:generateContent"
        
        # LangChain 메시지를 Gemini 포맷으로 변환
        contents = []
        for msg in messages:
            contents.append({
                "parts": [{"text": msg.content}]
            })
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": self.temperature
            }
        }
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        # 응답 파싱
        text = ""
        candidates = data.get("candidates", [])
        if candidates:
            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if parts:
                text = parts[0].get("text", "")
        
        return ChatResult(generations=[ChatGeneration(message=AIMessage(content=text))])
    
    async def _astream(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> AsyncGenerator[ChatGenerationChunk, None]:
        """스트리밍 생성"""
        url = f"{self.base_url}/models/{self.model}:streamGenerateContent?alt=sse"
        
        contents = []
        for msg in messages:
            contents.append({
                "parts": [{"text": msg.content}]
            })
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": self.temperature
            }
        }
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        try:
                            data = json.loads(line[6:])
                            candidates = data.get("candidates", [])
                            if candidates:
                                content = candidates[0].get("content", {})
                                parts = content.get("parts", [])
                                if parts:
                                    text = parts[0].get("text", "")
                                    if text:
                                        chunk = ChatGenerationChunk(message=AIMessageChunk(content=text))
                                        if run_manager:
                                            await run_manager.on_llm_new_token(text, chunk=chunk)
                                        yield chunk
                        except json.JSONDecodeError:
                            continue


class ClaudeChatModel(BaseChatModel):
    """Claude LangChain Chat Model - GMS API 경유"""
    
    model: str = "claude-sonnet-4-5-20250514"
    temperature: float = 0.7
    max_tokens: int = 4096
    api_key: str = ""
    base_url: str = "https://gms.ssafy.io/gmsapi/api.anthropic.com/v1"
    
    def __init__(self, model: str = None, temperature: float = None, **kwargs):
        super().__init__(**kwargs)
        self.model = model or settings.claude_model
        self.temperature = temperature or settings.llm_temperature
        self.api_key = settings.gms_api_key
    
    @property
    def _llm_type(self) -> str:
        return "claude"
    
    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> ChatResult:
        """동기 생성 - 비동기를 래핑"""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(asyncio.run, self._agenerate(messages, stop, run_manager, **kwargs))
                    return future.result()
            else:
                return loop.run_until_complete(self._agenerate(messages, stop, run_manager, **kwargs))
        except RuntimeError:
            return asyncio.run(self._agenerate(messages, stop, run_manager, **kwargs))
    
    def _format_messages(self, messages: List[BaseMessage]):
        """메시지 포맷 변환"""
        formatted_messages = []
        system_prompt = None
        
        for msg in messages:
            if isinstance(msg, SystemMessage):
                system_prompt = msg.content
            else:
                role = "assistant" if isinstance(msg, AIMessage) else "user"
                formatted_messages.append({
                    "role": role,
                    "content": msg.content
                })
        
        return formatted_messages, system_prompt
    
    async def _agenerate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> ChatResult:
        """비동기 생성"""
        url = f"{self.base_url}/messages"
        
        formatted_messages, system_prompt = self._format_messages(messages)
        
        payload = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "messages": formatted_messages
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        # 응답 파싱
        text = ""
        content = data.get("content", [])
        if content:
            text = content[0].get("text", "")
        
        return ChatResult(generations=[ChatGeneration(message=AIMessage(content=text))])
    
    async def _astream(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> AsyncGenerator[ChatGenerationChunk, None]:
        """스트리밍 생성"""
        url = f"{self.base_url}/messages"
        
        formatted_messages, system_prompt = self._format_messages(messages)
        
        payload = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "messages": formatted_messages,
            "stream": True
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        try:
                            data = json.loads(line[6:])
                            event_type = data.get("type", "")
                            if event_type == "content_block_delta":
                                delta = data.get("delta", {})
                                text = delta.get("text", "")
                                if text:
                                    chunk = ChatGenerationChunk(message=AIMessageChunk(content=text))
                                    if run_manager:
                                        await run_manager.on_llm_new_token(text, chunk=chunk)
                                    yield chunk
                        except json.JSONDecodeError:
                            continue
