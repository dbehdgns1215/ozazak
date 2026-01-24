"""스마트 선택 + 자기소개서 생성 Chain"""
import re
from typing import List, Dict, Optional, AsyncGenerator
from langchain_core.output_parsers import StrOutputParser

from ..prompts.smart_selection_prompt import (
    get_smart_generation_prompt,
    format_blocks_section,
    format_cover_letters_section
)
from ..prompts.cover_letter_prompt import format_job_analysis_section


class SmartGenerationChain:
    """스마트 선택 + 자기소개서 생성 Chain
    
    문항에 가장 적합한 블록/자소서를 LLM이 선택하고,
    선택된 자료를 바탕으로 자기소개서를 생성합니다.
    """
    
    def __init__(self, llm):
        self.llm = llm
        self.prompt = get_smart_generation_prompt()
        self.output_parser = StrOutputParser()
    
    async def generate(
        self,
        question: str,
        company_name: str,
        position: str,
        blocks: List[Dict],
        cover_letters: List[Dict],
        job_analysis: Optional[Dict] = None,
        char_limit: int = 800
    ) -> Dict:
        """
        스마트 선택 + 자기소개서 생성
        
        Returns:
            {
                "selected_blocks": [1, 3],  # 선택된 블록 인덱스
                "selected_cover_letters": [2],  # 선택된 자소서 인덱스
                "content": "생성된 자기소개서..."
            }
        """
        blocks_section = format_blocks_section(blocks)
        cover_letters_section = format_cover_letters_section(cover_letters)
        job_analysis_section = format_job_analysis_section(job_analysis)
        
        chain = self.prompt | self.llm | self.output_parser
        
        result = await chain.ainvoke({
            "company_name": company_name,
            "position": position,
            "question": question,
            "char_limit": char_limit,
            "job_analysis_section": job_analysis_section,
            "blocks_section": blocks_section,
            "cover_letters_section": cover_letters_section
        })
        
        return self._parse_response(result)
    
    async def stream(
        self,
        question: str,
        company_name: str,
        position: str,
        blocks: List[Dict],
        cover_letters: List[Dict],
        job_analysis: Optional[Dict] = None,
        char_limit: int = 800
    ) -> AsyncGenerator[str, None]:
        """스마트 선택 + 자기소개서 생성 (스트리밍)"""
        blocks_section = format_blocks_section(blocks)
        cover_letters_section = format_cover_letters_section(cover_letters)
        job_analysis_section = format_job_analysis_section(job_analysis)
        
        chain = self.prompt | self.llm | self.output_parser
        
        async for chunk in chain.astream({
            "company_name": company_name,
            "position": position,
            "question": question,
            "char_limit": char_limit,
            "job_analysis_section": job_analysis_section,
            "blocks_section": blocks_section,
            "cover_letters_section": cover_letters_section
        }):
            yield chunk
    
    def _parse_response(self, response: str) -> Dict:
        """LLM 응답 파싱"""
        result = {
            "selected_blocks": [],
            "selected_cover_letters": [],
            "content": "",
            "raw_response": response
        }
        
        # [선택된 자료] 섹션 파싱
        selection_match = re.search(
            r'\[선택된 자료\](.*?)\[자기소개서\]',
            response,
            re.DOTALL
        )
        
        if selection_match:
            selection_text = selection_match.group(1)
            
            # 블록 번호 추출
            block_match = re.search(r'블록[:\s]*(.+)', selection_text)
            if block_match:
                block_nums = re.findall(r'블록(\d+)', block_match.group(1))
                result["selected_blocks"] = [int(n) for n in block_nums]
            
            # 자소서 번호 추출
            cl_match = re.search(r'자소서[:\s]*(.+)', selection_text)
            if cl_match:
                cl_nums = re.findall(r'자소서(\d+)', cl_match.group(1))
                result["selected_cover_letters"] = [int(n) for n in cl_nums]
        
        # [자기소개서] 섹션 추출
        content_match = re.search(r'\[자기소개서\]\s*(.*)', response, re.DOTALL)
        if content_match:
            result["content"] = content_match.group(1).strip()
        else:
            # 형식이 맞지 않으면 전체를 content로
            result["content"] = response.strip()
        
        return result
