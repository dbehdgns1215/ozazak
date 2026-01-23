"""LLM 어댑터 베이스 클래스"""
from abc import ABC, abstractmethod
from typing import List, Dict, Optional


class BaseLLMAdapter(ABC):
    """모든 LLM 어댑터가 구현해야 할 추상 클래스"""
    
    @abstractmethod
    async def chat_completion(self, messages: List[Dict], temperature: float = 0.7) -> str:
        """채팅 완료 요청"""
        pass
    
    @abstractmethod
    async def extract_blocks_from_project(self, project_info: str) -> List[Dict]:
        """프로젝트 정보에서 블록 추출"""
        pass
    
    @abstractmethod
    async def extract_blocks_from_cover_letter(self, question: str, essay: str) -> List[Dict]:
        """자기소개서에서 블록 추출"""
        pass
    
    @abstractmethod
    async def analyze_job_posting(
        self,
        company_name: str,
        position: str,
        job_posting: str,
        requirements: Optional[str] = None
    ) -> Dict:
        """채용공고 분석"""
        pass
    
    @abstractmethod
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
        """자기소개서 생성"""
        pass
