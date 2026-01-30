"""
Gemini LLM Adapter - LangChain 기반 어댑터
"""
from typing import List, Dict, Optional, AsyncGenerator, Any

from .base_llm_adapter import BaseLLMAdapter
from .custom_llms import GeminiChatModel
from .chains.block_chain import BlockExtractionChain
from .chains.cover_letter_chain import CoverLetterGenerationChain
from .chains.job_posting_chain import JobPostingAnalysisChain
from src.config.settings import settings
from src.domain.entities.block import Block
from src.domain.value_objects.job_analysis import JobAnalysis


class GeminiLLMAdapter(BaseLLMAdapter):
    """Gemini LLM Adapter - LangChain 기반"""
    
    def __init__(self, model: str = None, is_flash: bool = True):
        """
        Args:
            model: 모델명 (None이면 기본값 사용)
            is_flash: True면 Flash 모델, False면 Pro 모델
        """
        if model:
            self.model = model
        else:
            self.model = settings.gemini_flash_model if is_flash else settings.gemini_pro_model
        
        # LangChain 호환 Gemini Chat Model
        self.llm = GeminiChatModel(
            model=self.model,
            temperature=settings.llm_temperature
        )
        
        # LangChain 체인들 초기화
        self.block_chain = BlockExtractionChain(self.llm)
        self.cover_letter_chain = CoverLetterGenerationChain(self.llm)
        self.job_posting_chain = JobPostingAnalysisChain(self.llm)
        
        # 추가 체인 (Lazy import to avoid circular dependency if any)
        from .chains.smart_generation_chain import SmartGenerationChain
        from .chains.refinement_chain import RefinementChain
        
        self.smart_chain = SmartGenerationChain(self.llm)
        self.refinement_chain = RefinementChain(self.llm)
    
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
    
    async def extract_blocks_from_project(self, project_info: str) -> List[Block]:
        """프로젝트에서 블록 추출"""
        raw_blocks = await self.block_chain.extract_from_project(project_info)
        return [
            Block(
                content=b.get("content", ""),
                category=b.get("category", "UNKNOWN"),
                keywords=b.get("keywords", [])
            ) for b in raw_blocks
        ]
    
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Block]:
        """자기소개서에서 블록 추출"""
        raw_blocks = await self.block_chain.extract_from_cover_letter(question, essay)
        return [
            Block(
                content=b.get("content", ""),
                category=b.get("category", "UNKNOWN"),
                keywords=b.get("keywords", [])
            ) for b in raw_blocks
        ]
    
    async def analyze_job_posting(
        self, company_name: str, position: str, job_posting: str,
        requirements: str = ""
    ) -> JobAnalysis:
        """채용공고 분석"""
        analysis_data = await self.job_posting_chain.analyze(
            company_name=company_name, position=position,
            job_posting=job_posting, requirements=requirements
        )
        return JobAnalysis(
            responsibilities=analysis_data.get("responsibilities", []),
            requirements=analysis_data.get("requirements", []),
            preferred_qualifications=analysis_data.get("preferred_qualifications", []),
            ideal_candidate=analysis_data.get("ideal_candidate", ""),
            yearly_goals=analysis_data.get("yearly_goals", ""),
            company_name=company_name,
            position=position
        )
    
    # === LLMPort Implementations ===

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
        # blocks: List[Block] -> List[Dict] 변환 (Chain 요구사항 준수)
        blocks_as_dicts = [
            {
                "id": b.id,  # Block entity might not have ID populated often, but safe to include if exists
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
        """Generate cover letter with validation (Cover Letter Chain)"""
        return await self.cover_letter_chain.generate_with_validation(
            question=question, blocks=blocks, references=references,
            job_analysis=job_analysis, char_limit=char_limit,
            company_name=company_name, position=position,
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

    # Legacy Compatibility Methods Removed
    # If backward compatibility is strictly needed, delegate to new methods.
    # But per review, we remove them to avoid crashes.
