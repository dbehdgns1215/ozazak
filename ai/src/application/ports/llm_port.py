from abc import ABC, abstractmethod
from typing import List, AsyncGenerator, Dict, Any, Optional
from src.domain.entities.block import Block
from src.domain.value_objects.job_analysis import JobAnalysis

class LLMPort(ABC):
    """Interface for LLM Adapter"""
    
    @abstractmethod
    async def extract_blocks_from_project(self, content: str) -> List[Block]:
        """Extract project blocks from text content"""
        pass
    
    @abstractmethod
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Block]:
        """Extract blocks from cover letter"""
        pass
        
    @abstractmethod
    async def analyze_job_posting(self, company_name: str, position: str, job_posting: str, requirements: str) -> JobAnalysis:
        """Analyze job posting"""
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
        # Tuple[str, Dict]
        """Generate cover letter with validation (Smart Chain)"""
        pass

    @abstractmethod
    async def generate_selected_cover_letter_with_validation(
        self,
        question: str,
        blocks: List[str],
        references: List[str],
        job_analysis: JobAnalysis,
        char_limit: int = 800,
        company_name: str = "",
        position: str = "",
        user_prompt: Optional[str] = None,
        on_status: Any = None
    ) -> Any:
        # Tuple[str, Dict]
        """Generate cover letter with validation (Cover Letter Chain)"""
        pass

    @abstractmethod
    async def refine_with_validation(
        self,
        question: str,
        original_content: str,
        feedback: str,
        company_name: str,
        position: str,
        char_limit: int = 800,
        on_status: Any = None
    ) -> Any:
         # Tuple[str, Dict]
        """Refine cover letter with validation based on feedback"""
        pass

    @abstractmethod
    async def generate_enhanced_cover_letter(
        self,
        question: str,
        blocks: List[str],
        company_name: str,
        position: str,
        poster_url: Optional[str] = None,
        fallback_content: Optional[str] = None,
        char_limit: int = 800
    ) -> Any:
        """Enhanced Cover Letter Generation (Pipeline)"""
        pass
