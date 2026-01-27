"""LLM 어댑터 베이스 클래스"""
from abc import ABC, abstractmethod
from typing import List, Dict, Optional, AsyncGenerator, Any

from src.application.ports.llm_port import LLMPort
from src.domain.entities.block import Block
from src.domain.value_objects.job_analysis import JobAnalysis


class BaseLLMAdapter(LLMPort, ABC):
    """모든 LLM 어댑터가 구현해야 할 추상 클래스"""
    
    @abstractmethod
    async def chat_completion(self, messages: List[Dict], temperature: float = 0.7) -> str:
        """채팅 완료 요청"""
        pass
    
    @abstractmethod
    async def extract_blocks_from_project(self, content: str) -> List[Block]:
        """프로젝트 정보에서 블록 추출"""
        pass
    
    @abstractmethod
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Block]:
        """자기소개서에서 블록 추출"""
        pass
    
    @abstractmethod
    async def analyze_job_posting(
        self,
        company_name: str,
        position: str,
        job_posting: str,
        requirements: str
    ) -> JobAnalysis:
        """채용공고 분석"""
        pass
        
    @abstractmethod
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
        """Generate cover letter with smart selection and validation"""
        pass

    @abstractmethod
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
        pass
        
    @abstractmethod
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
        pass
    
    # Legacy method support (for backward compatibility if needed, or to be removed)
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
        """자기소개서 생성 (Legacy)"""
        pass
    
    # Map legacy stream method to new interface if needed or abstract methods
    # The concrete classes implement specific streaming logic

