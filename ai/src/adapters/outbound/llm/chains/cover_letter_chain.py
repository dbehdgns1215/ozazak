"""자기소개서 생성을 위한 LangChain Chain (최신 API)"""
from typing import List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from ..prompts.cover_letter_prompt import (
    get_cover_letter_generation_prompt,
    format_reference_section
)


class CoverLetterGenerationChain:
    """자기소개서 생성 Chain - LangChain LCEL 방식 구현"""
    
    def __init__(self, llm: ChatOpenAI):
        """
        Args:
            llm: OpenAI LLM 인스턴스
        """
        self.llm = llm
        self.prompt = get_cover_letter_generation_prompt()
        self.output_parser = StrOutputParser()
    
    async def generate(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]] = None
    ) -> str:
        """
        자기소개서 생성
        
        Args:
            question: 자기소개서 문항
            blocks: 활용할 블록 내용 리스트
            references: 참고할 이전 자기소개서 리스트 (선택)
            
        Returns:
            생성된 자기소개서 텍스트
        """
        # 블록 포맷팅
        formatted_blocks = self._format_blocks(blocks)
        
        # 참고 자료 포맷팅
        reference_section = format_reference_section(references or [])
        
        # LCEL Chain 구성: prompt | llm | output_parser
        chain = self.prompt | self.llm | self.output_parser
        
        result = await chain.ainvoke({
            "question": question,
            "blocks": formatted_blocks,
            "reference_section": reference_section
        })
        
        return result.strip()
    
    def _format_blocks(self, blocks: List[str]) -> str:
        """
        블록들을 문자열로 포맷팅
        
        Args:
            blocks: 블록 내용 리스트
            
        Returns:
            포맷팅된 블록 문자열
        """
        if not blocks:
            return "사용 가능한 블록이 없습니다."
        
        formatted = []
        for i, block in enumerate(blocks, 1):
            formatted.append(f"[블록 {i}]\n{block}")
        
        return "\n\n".join(formatted)
