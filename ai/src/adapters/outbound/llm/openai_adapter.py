"""
OpenAI LLM Adapter - LangChain 연동 어댑터 (고도화 버전)
헥사고날 아키텍처의 Outbound Adapter 역할
"""
from typing import List, Dict, Optional
from langchain_openai import ChatOpenAI

from .chains.block_chain import BlockExtractionChain
from .chains.cover_letter_chain import CoverLetterGenerationChain
from .chains.job_posting_chain import JobPostingAnalysisChain
from src.config.settings import settings


class OpenAILLMAdapter:
    """OpenAI LLM Adapter - LangChain을 사용하여 GPT-4와 통신 (고도화 버전)"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.openai_model,
            temperature=settings.openai_temperature,
            openai_api_key=settings.openai_api_key,
            base_url=settings.openai_base_url
        )
        
        self.block_chain = BlockExtractionChain(self.llm)
        self.cover_letter_chain = CoverLetterGenerationChain(self.llm)
        self.job_posting_chain = JobPostingAnalysisChain(self.llm)
    
    async def extract_blocks_from_project(self, project_info: str) -> List[Dict]:
        """프로젝트 정보에서 블록 추출"""
        return await self.block_chain.extract_from_project(project_info)
    
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Dict]:
        """자기소개서에서 블록 추출"""
        return await self.block_chain.extract_from_cover_letter(question, essay)
    
    async def analyze_job_posting(
        self,
        company_name: str,
        position: str,
        job_posting: str,
        requirements: Optional[str] = None
    ) -> Dict:
        """채용공고 분석"""
        return await self.job_posting_chain.analyze(
            company_name=company_name,
            position=position,
            job_posting=job_posting,
            requirements=requirements
        )
    
    async def generate_cover_letter(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]] = None,
        job_analysis: Optional[Dict] = None,
        char_limit: Optional[int] = None,
        company_name: Optional[str] = None,
        position: Optional[str] = None
    ) -> str:
        """자기소개서 생성 (고도화 버전)"""
        return await self.cover_letter_chain.generate(
            question=question,
            blocks=blocks,
            references=references,
            job_analysis=job_analysis,
            char_limit=char_limit,
            company_name=company_name,
            position=position
        )


_llm_adapter_instance: Optional[OpenAILLMAdapter] = None


def get_llm_adapter() -> OpenAILLMAdapter:
    global _llm_adapter_instance
    if _llm_adapter_instance is None:
        _llm_adapter_instance = OpenAILLMAdapter()
    return _llm_adapter_instance
