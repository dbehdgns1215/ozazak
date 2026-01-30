"""
OpenAI LLM Adapter - LangChain 연동 어댑터 (리팩토링 버전)
"""
from typing import List, Dict, Optional, Any
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

from .base_llm_adapter import BaseLLMAdapter
from .chains.block_chain import BlockExtractionChain
from .chains.cover_letter_chain import CoverLetterGenerationChain
from .chains.job_posting_chain import JobPostingAnalysisChain
from .chains.smart_generation_chain import SmartGenerationChain
from .chains.refinement_chain import RefinementChain

from src.config.settings import settings
from src.domain.entities.block import Block
from src.domain.value_objects.job_analysis import JobAnalysis


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
        self.smart_chain = SmartGenerationChain(self.llm)
        self.refinement_chain = RefinementChain(self.llm)
    
    async def chat_completion(self, messages: List[Dict], temperature: float = 0.7) -> str:
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
    
    async def extract_blocks_from_project(self, project_info: str) -> List[Block]:
        raw_blocks = await self.block_chain.extract_from_project(project_info)
        return [
            Block(
                content=b.get("content", ""),
                category=b.get("category", "직무 역량"),
                keywords=b.get("keywords", [])
            ) for b in raw_blocks
        ]
    
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Block]:
        raw_blocks = await self.block_chain.extract_from_cover_letter(question, essay)
        return [
            Block(
                content=b.get("content", ""),
                category=b.get("category", "직무 역량"),
                keywords=b.get("keywords", [])
            ) for b in raw_blocks
        ]
    
    async def analyze_job_posting(
        self, company_name: str, position: str, job_posting: str,
        requirements: Optional[str] = None
    ) -> JobAnalysis:
        data = await self.job_posting_chain.analyze(
            company_name=company_name, position=position,
            job_posting=job_posting, requirements=requirements
        )
        return JobAnalysis(
            responsibilities=data.get("responsibilities", []),
            requirements=data.get("requirements", []),
            preferred_qualifications=data.get("preferred_qualifications", []),
            ideal_candidate=data.get("ideal_candidate", ""),
            yearly_goals=data.get("yearly_goals", ""),
            company_name=company_name,
            position=position
        )
        
    async def generate_cover_letter_with_validation(
        self,
        question: str,
        company_name: str,
        position: str,
        blocks: List[Block],
        cover_letters: List[Dict[str, str]],
        job_analysis: JobAnalysis,
        char_limit: int = 800,
        on_status: Any = None
    ) -> Any:
        """Generate cover letter with validation (Smart Chain)"""
        # blocks: List[Block] -> List[Dict] conversion
        blocks_as_dicts = [
            {
                "id": b.id,
                "content": b.content,
                "category": b.category,
                "keywords": b.keywords
            }
            for b in blocks
        ]
        
        return await self.smart_chain.generate_with_validation(
            question=question,
            company_name=company_name,
            position=position,
            blocks=blocks_as_dicts,
            cover_letters=cover_letters,
            job_analysis=job_analysis,
            char_limit=char_limit,
            on_status=on_status
        )

    async def generate_selected_cover_letter_with_validation(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]],
        job_analysis: JobAnalysis,
        char_limit: int,
        company_name: str,
        position: str,
        on_status: Any = None
    ) -> Any:
        """Generate cover letter from selected blocks with validation"""
        return await self.cover_letter_chain.generate_with_validation(
            question=question,
            blocks=blocks,
            references=references,
            job_analysis=job_analysis,
            char_limit=char_limit,
            company_name=company_name,
            position=position,
            on_status=on_status
        )

    async def refine_with_validation(
        self,
        question: str,
        original_content: str,
        feedback: str,
        company_name: str,
        position: str,
        char_limit: int,
        on_status: Any = None
    ) -> Any:
        """Refine cover letter with validation"""
        return await self.refinement_chain.generate_with_validation(
            question=question,
            original_content=original_content,
            feedback=feedback,
            company_name=company_name,
            position=position,
            char_limit=char_limit,
            on_status=on_status
        )

