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
    def stream_cover_letter_generation(
            self,
            question: str,
            company_name: str,
            position: str,
            blocks: List[Block],
            cover_letters: List[Dict[str, str]],
            job_analysis: JobAnalysis,
            char_limit: int = 800
    ) -> AsyncGenerator[str, None]:
        """Stream generated cover letter with smart selection (Smart Chain)"""
        pass

    @abstractmethod
    def stream_selected_cover_letter(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]],
        job_analysis: JobAnalysis,
        char_limit: int,
        company_name: str,
        position: str
    ) -> AsyncGenerator[str, None]:
        """Stream generated cover letter from selected blocks (Standard Chain)"""
        pass
        
    @abstractmethod
    def stream_refinement(
        self,
        question: str,
        original_content: str,
        feedback: str,
        company_name: str,
        position: str,
        char_limit: int
    ) -> AsyncGenerator[str, None]:
        """Stream refined cover letter based on feedback"""
        pass
