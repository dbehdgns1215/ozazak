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

    async def _download_image_as_base64(self, image_url: str) -> tuple:
        """이미지 URL → base64 변환"""
        import base64
        async with httpx.AsyncClient(timeout=30.0) as client:
            try: 
                response = await client.get(image_url)
                response.raise_for_status()
                # Content-Type 헤더가 없거나 비정상적일 경우 기본값 jpeg 사용
                mime_type = response.headers.get("content-type", "image/jpeg")
                # 바이너리 데이터 base64 인코딩 후 문자열로 디코딩
                base64_data = base64.b64encode(response.content).decode("utf-8")
                return base64_data, mime_type
            except Exception as e:
                # 이미지 다운로드 실패 시 로그 남기고 예외 재발생
                print(f"[ERROR] Failed to download image for vision analysis: {e}")
                raise e

    async def _agenerate_vision(
        self,
        messages: List[BaseMessage],
        **kwargs
    ) -> ChatResult:
        """멀티모달(Vision) 전용 비동기 생성"""
        url = f"{self.base_url}/models/{self.model}:generateContent"
        
        contents = []
        for msg in messages:
            parts = []
            if isinstance(msg.content, list):
                for item in msg.content:
                    if item.get("type") == "text":
                        parts.append({"text": item["text"]})
                    elif item.get("type") == "image_url":
                        image_url = item["image_url"]["url"]
                        
                        # 이미지 다운로드 및 base64 변환 (file_uri 불가 -> inline_data 사용)
                        try:
                            # 로컬 파일 경로인 경우는 제외 (구현 필요 시 추가)
                            if image_url.startswith("http"):
                                base64_data, mime_type = await self._download_image_as_base64(image_url)
                                parts.append({
                                    "inline_data": {
                                        # GMS API는 mime_type과 data 필드를 사용
                                        "mime_type": mime_type,
                                        "data": base64_data
                                    }
                                })
                            else:
                                # http가 아닌 경우 (예: 이미 base64 등) - 현재는 무시하거나 에러
                                parts.append({"text": f"[Image skipped: invalid URL {image_url}]"})
                        except Exception as e:
                            parts.append({"text": f"[Image processing failed: {str(e)}]"})
                            
            else:
                parts.append({"text": msg.content})
            contents.append({"parts": parts})
        
        payload = {
            "contents": contents,
            "generationConfig": {"temperature": self.temperature}
        }
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        text = ""
        candidates = data.get("candidates", [])
        if candidates:
            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if parts:
                text = parts[0].get("text", "")
        
        return ChatResult(generations=[ChatGeneration(message=AIMessage(content=text))])


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


class OpenAIChatModel(BaseChatModel):
    """OpenAI LangChain Chat Model - GMS API 경유 (Vision 지원)"""
    
    model: str = "gpt-4o"
    temperature: float = 0.7
    api_key: str = ""
    base_url: str = "https://gms.ssafy.io/gmsapi/api.openai.com/v1"
    
    def __init__(self, model: str = None, temperature: float = None, **kwargs):
        super().__init__(**kwargs)
        self.model = model or "gpt-4o"
        self.temperature = temperature or settings.llm_temperature
        self.api_key = settings.gms_api_key
    
    @property
    def _llm_type(self) -> str:
        return "openai"
        
    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> ChatResult:
        """동기 생성"""
        return asyncio.run(self._agenerate(messages, stop, run_manager, **kwargs))

    async def _agenerate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs
    ) -> ChatResult:
        url = f"{self.base_url}/chat/completions"
        
        # OpenAI 형식으로 메시지 변환 (Vision 포함)
        formatted_messages = []
        for msg in messages:
            if isinstance(msg.content, list):
                # 멀티모달 (Vision)
                formatted_messages.append({
                    "role": "user",
                    "content": msg.content  # OpenAI는 그대로 사용 가능
                })
            else:
                role = "assistant" if isinstance(msg, AIMessage) else "user"
                formatted_messages.append({"role": role, "content": msg.content})
        
        payload = {
            "model": self.model,
            "messages": formatted_messages,
            "temperature": self.temperature
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
        text = ""
        choices = data.get("choices", [])
        if choices:
            text = choices[0].get("message", {}).get("content", "")
            
        return ChatResult(generations=[ChatGeneration(message=AIMessage(content=text))])
