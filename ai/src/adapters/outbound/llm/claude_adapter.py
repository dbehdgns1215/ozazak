"""Claude LLM 어댑터 (Anthropic)"""
import json
import httpx
from typing import List, Dict, Optional

from .base_llm_adapter import BaseLLMAdapter
from .chains.block_chain import BlockExtractionChain
from .chains.cover_letter_chain import CoverLetterGenerationChain
from .chains.job_posting_chain import JobPostingAnalysisChain
from src.config.settings import settings


class ClaudeLLMAdapter(BaseLLMAdapter):
    """Claude LLM 어댑터 - Anthropic API 사용"""
    
    def __init__(self, model: str = None):
        self.model = model or settings.claude_model
        self.api_key = settings.gms_api_key
        self.base_url = "https://gms.ssafy.io/gmsapi/api.anthropic.com/v1"
        
        self._init_langchain_llm()
    
    def _init_langchain_llm(self):
        """LangChain용 커스텀 LLM 초기화"""
        from langchain_core.language_models.chat_models import BaseChatModel
        from langchain_core.messages import BaseMessage, AIMessage
        from langchain_core.outputs import ChatResult, ChatGeneration
        
        adapter = self
        
        class ClaudeChatModel(BaseChatModel):
            @property
            def _llm_type(self) -> str:
                return "claude"
            
            def _generate(self, messages: List[BaseMessage], **kwargs) -> ChatResult:
                import asyncio
                result = asyncio.get_event_loop().run_until_complete(
                    adapter._call_api([{"role": "user", "content": m.content} for m in messages])
                )
                return ChatResult(generations=[ChatGeneration(message=AIMessage(content=result))])
            
            async def _agenerate(self, messages: List[BaseMessage], **kwargs) -> ChatResult:
                result = await adapter._call_api([{"role": "user", "content": m.content} for m in messages])
                return ChatResult(generations=[ChatGeneration(message=AIMessage(content=result))])
        
        self.llm = ClaudeChatModel()
        self.block_chain = BlockExtractionChain(self.llm)
        self.cover_letter_chain = CoverLetterGenerationChain(self.llm)
        self.job_posting_chain = JobPostingAnalysisChain(self.llm)
    
    async def _call_api(self, messages: List[Dict], temperature: float = 0.7) -> str:
        """Claude API 직접 호출"""
        url = f"{self.base_url}/messages"
        
        # 메시지 포맷 변환
        formatted_messages = []
        for msg in messages:
            role = msg.get("role", "user")
            if role == "system":
                role = "user"  # Claude는 system을 별도 처리
            formatted_messages.append({
                "role": role,
                "content": msg.get("content", "")
            })
        
        payload = {
            "model": self.model,
            "max_tokens": 4096,
            "messages": formatted_messages
        }
        
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
        content = data.get("content", [])
        if content:
            return content[0].get("text", "")
        
        return ""
    
    async def chat_completion(self, messages: List[Dict], temperature: float = 0.7) -> str:
        return await self._call_api(messages, temperature)
    
    async def extract_blocks_from_project(self, project_info: str) -> List[Dict]:
        return await self.block_chain.extract_from_project(project_info)
    
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Dict]:
        return await self.block_chain.extract_from_cover_letter(question, essay)
    
    async def analyze_job_posting(
        self, company_name: str, position: str, job_posting: str,
        requirements: Optional[str] = None
    ) -> Dict:
        return await self.job_posting_chain.analyze(
            company_name=company_name, position=position,
            job_posting=job_posting, requirements=requirements
        )
    
    async def generate_cover_letter(
        self, question: str, blocks: List[str],
        references: Optional[List[str]] = None,
        job_analysis: Optional[Dict] = None,
        char_limit: Optional[int] = None,
        company_name: Optional[str] = None,
        position: Optional[str] = None
    ) -> str:
        return await self.cover_letter_chain.generate(
            question=question, blocks=blocks, references=references,
            job_analysis=job_analysis, char_limit=char_limit,
            company_name=company_name, position=position
        )
