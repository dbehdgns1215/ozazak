"""
OpenAI LLM Adapter - LangChain 연동 어댑터 (리팩토링 버전)
"""
from typing import List, Dict, Optional
from langchain_openai import ChatOpenAI

from .base_llm_adapter import BaseLLMAdapter
from .chains.block_chain import BlockExtractionChain
from .chains.cover_letter_chain import CoverLetterGenerationChain
from .chains.job_posting_chain import JobPostingAnalysisChain
from src.config.settings import settings


class OpenAILLMAdapter(BaseLLMAdapter):
    """OpenAI LLM Adapter - GPT 모델 사용"""
    
    def __init__(self, model: str = None):
        self.model = model or settings.gpt_model
        
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=settings.llm_temperature,
            openai_api_key=settings.gms_api_key,
            base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1"
        )
        
        self.block_chain = BlockExtractionChain(self.llm)
        self.cover_letter_chain = CoverLetterGenerationChain(self.llm)
        self.job_posting_chain = JobPostingAnalysisChain(self.llm)
    
    async def chat_completion(self, messages: List[Dict], temperature: float = 0.7) -> str:
        from langchain_core.messages import HumanMessage, SystemMessage
        
        lc_messages = []
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                lc_messages.append(SystemMessage(content=content))
            else:
                lc_messages.append(HumanMessage(content=content))
        
        result = await self.llm.ainvoke(lc_messages)
        return result.content
    
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
