"""
Claude LLM Adapter - LangChain 기반 어댑터
"""
from typing import List, Dict, Optional

from .base_llm_adapter import BaseLLMAdapter
from .custom_llms import ClaudeChatModel
from .chains.block_chain import BlockExtractionChain
from .chains.cover_letter_chain import CoverLetterGenerationChain
from .chains.job_posting_chain import JobPostingAnalysisChain
from src.config.settings import settings


class ClaudeLLMAdapter(BaseLLMAdapter):
    """Claude LLM Adapter - LangChain 기반"""
    
    def __init__(self, model: str = None):
        """
        Args:
            model: 모델명 (None이면 기본값 사용)
        """
        self.model = model or settings.claude_model
        
        # LangChain 호환 Claude Chat Model
        self.llm = ClaudeChatModel(
            model=self.model,
            temperature=settings.llm_temperature
        )
        
        # LangChain 체인들 초기화
        self.block_chain = BlockExtractionChain(self.llm)
        self.cover_letter_chain = CoverLetterGenerationChain(self.llm)
        self.job_posting_chain = JobPostingAnalysisChain(self.llm)
    
    async def chat_completion(self, messages: List[Dict], temperature: float = 0.7) -> str:
        """범용 채팅 완성"""
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
        """프로젝트에서 블록 추출"""
        return await self.block_chain.extract_from_project(project_info)
    
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Dict]:
        """자기소개서에서 블록 추출"""
        return await self.block_chain.extract_from_cover_letter(question, essay)
    
    async def analyze_job_posting(
        self, company_name: str, position: str, job_posting: str,
        requirements: Optional[str] = None
    ) -> Dict:
        """채용공고 분석"""
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
        """자기소개서 생성"""
        return await self.cover_letter_chain.generate(
            question=question, blocks=blocks, references=references,
            job_analysis=job_analysis, char_limit=char_limit,
            company_name=company_name, position=position
        )
