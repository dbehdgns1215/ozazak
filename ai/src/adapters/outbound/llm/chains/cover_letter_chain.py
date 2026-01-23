"""자기소개서 생성을 위한 LangChain Chain (고도화 버전)"""
from typing import List, Optional, Dict
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from ..prompts.cover_letter_prompt import (
    get_cover_letter_generation_prompt,
    format_reference_section,
    format_company_info,
    format_job_analysis_section
)


class CoverLetterGenerationChain:
    """자기소개서 생성 Chain - LangChain LCEL 방식 구현 (고도화 버전)"""
    
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm
        self.prompt = get_cover_letter_generation_prompt()
        self.output_parser = StrOutputParser()
    
    async def generate(
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
        formatted_blocks = self._format_blocks(blocks)
        reference_section = format_reference_section(references or [])
        company_info = format_company_info(company_name, position)
        job_analysis_section = format_job_analysis_section(job_analysis)
        effective_char_limit = char_limit or 800
        
        chain = self.prompt | self.llm | self.output_parser
        
        result = await chain.ainvoke({
            "question": question,
            "blocks": formatted_blocks,
            "reference_section": reference_section,
            "company_info": company_info,
            "char_limit": effective_char_limit,
            "job_analysis_section": job_analysis_section
        })
        
        return result.strip()
    
    def _format_blocks(self, blocks: List[str]) -> str:
        if not blocks:
            return "사용 가능한 블록이 없습니다."
        
        formatted = []
        for i, block in enumerate(blocks, 1):
            formatted.append(f"[블록 {i}]\n{block}")
        
        return "\n\n".join(formatted)
