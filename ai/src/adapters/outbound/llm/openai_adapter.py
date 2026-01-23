"""
OpenAI LLM Adapter - LangChain 연동 어댑터
헥사고날 아키텍처의 Outbound Adapter 역할
"""
from typing import List, Dict, Optional
from langchain_openai import ChatOpenAI

from .chains.block_chain import BlockExtractionChain
from .chains.cover_letter_chain import CoverLetterGenerationChain
from src.config.settings import settings


class OpenAILLMAdapter:
    """
    OpenAI LLM Adapter - LangChain을 사용하여 GPT-4와 통신
    
    헥사고날 아키텍처에서 Outbound Adapter 역할:
    - 도메인 계층은 이 어댑터의 존재를 모릅니다
    - Port 인터페이스를 구현하여 도메인과 통신합니다
    - LangChain 구현 세부사항은 여기에 캡슐화됩니다
    """
    
    def __init__(self):
        """OpenAI LLM 및 Chain 초기화"""
        # OpenAI ChatGPT 모델 설정 (SSAFY GMS base_url 사용)
        self.llm = ChatOpenAI(
            model=settings.openai_model,
            temperature=settings.openai_temperature,
            openai_api_key=settings.openai_api_key,
            base_url=settings.openai_base_url  # SSAFY GMS URL
        )
        
        # Chain 인스턴스 생성
        self.block_chain = BlockExtractionChain(self.llm)
        self.cover_letter_chain = CoverLetterGenerationChain(self.llm)
    
    async def extract_blocks_from_project(
        self, 
        project_info: str
    ) -> List[Dict]:
        """
        프로젝트 정보에서 블록 추출
        
        Args:
            project_info: 프로젝트 정보 (제목, 설명, 기술 스택, 역할 등)
            
        Returns:
            추출된 블록 리스트
            [
                {
                    "category": "TECHNICAL_SKILL",
                    "content": "블록 내용...",
                    "keywords": ["Python", "FastAPI"]
                },
                ...
            ]
        """
        return await self.block_chain.extract_from_project(project_info)
    
    async def extract_blocks_from_cover_letter(
        self,
        question: str,
        essay: str
    ) -> List[Dict]:
        """
        자기소개서에서 블록 추출
        
        Args:
            question: 자기소개서 문항
            essay: 답변 내용
            
        Returns:
            추출된 블록 리스트
        """
        return await self.block_chain.extract_from_cover_letter(question, essay)
    
    async def generate_cover_letter(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]] = None
    ) -> str:
        """
        자기소개서 생성
        
        Args:
            question: 자기소개서 문항
            blocks: 활용할 블록 내용들
            references: 참고할 이전 자기소개서들 (선택)
            
        Returns:
            생성된 자기소개서 내용
        """
        return await self.cover_letter_chain.generate(
            question=question,
            blocks=blocks,
            references=references
        )


# 싱글톤 인스턴스 (FastAPI 의존성 주입용)
_llm_adapter_instance: Optional[OpenAILLMAdapter] = None


def get_llm_adapter() -> OpenAILLMAdapter:
    """
    LLM Adapter 싱글톤 인스턴스 반환
    FastAPI Depends에서 사용
    """
    global _llm_adapter_instance
    if _llm_adapter_instance is None:
        _llm_adapter_instance = OpenAILLMAdapter()
    return _llm_adapter_instance
