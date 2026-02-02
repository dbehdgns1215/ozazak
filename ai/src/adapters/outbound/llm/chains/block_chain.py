"""블록 추출을 위한 LangChain Chain (최신 API)"""
import json
from typing import Dict, List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from ..prompts.block_generation_prompt import (
    get_project_block_extraction_prompt,
    get_cover_letter_block_extraction_prompt
)


class BlockExtractionChain:
    """블록 추출 Chain - LangChain LCEL 방식 구현"""
    
    def __init__(self, llm: ChatOpenAI):
        """
        Args:
            llm: OpenAI LLM 인스턴스
        """
        self.llm = llm
        self.project_prompt = get_project_block_extraction_prompt()
        self.cover_letter_prompt = get_cover_letter_block_extraction_prompt()
        self.output_parser = StrOutputParser()
    
    async def extract_from_project(self, project_info: str) -> List[Dict]:
        """
        프로젝트 정보에서 블록 추출
        
        Args:
            project_info: 프로젝트 정보 텍스트
            
        Returns:
            추출된 블록 리스트 [{"category": ..., "content": ..., "keywords": [...]}]
        """
        # LCEL Chain 구성: prompt | llm | output_parser
        chain = self.project_prompt | self.llm | self.output_parser
        
        # 실행
        result = await chain.ainvoke({"project_info": project_info})
        
        # JSON 파싱
        return self._parse_result(result)
    
    async def extract_from_cover_letter(
        self, 
        question: str, 
        essay: str
    ) -> List[Dict]:
        """
        자기소개서에서 블록 추출
        
        Args:
            question: 문항
            essay: 답변
            
        Returns:
            추출된 블록 리스트
        """
        chain = self.cover_letter_prompt | self.llm | self.output_parser
        
        result = await chain.ainvoke({"question": question, "essay": essay})
        
        return self._parse_result(result)
    
    def _parse_result(self, result: str) -> List[Dict]:
        """
        LLM 결과를 파싱
        
        Args:
            result: LLM 응답 (JSON 문자열)
            
        Returns:
            파싱된 블록 리스트
        """
        try:
            # JSON 추출 (코드 블록 제거)
            if "```json" in result:
                result = result.split("```json")[1].split("```")[0].strip()
            elif "```" in result:
                result = result.split("```")[1].split("```")[0].strip()
            
            # JSON 파싱
            data = json.loads(result)
            return data.get("blocks", [])
        
        except Exception as e:
            print(f"블록 파싱 오류: {e}")
            print(f"결과: {result}")
            return []
