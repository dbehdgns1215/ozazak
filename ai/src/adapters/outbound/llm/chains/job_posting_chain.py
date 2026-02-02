"""채용공고 분석을 위한 LangChain Chain"""
import json
from typing import Optional, Dict
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from ..prompts.job_posting_prompt import (
    get_job_posting_analysis_prompt,
    format_requirements_section
)


class JobPostingAnalysisChain:
    """채용공고 분석 Chain - LangChain LCEL 방식 구현"""
    
    def __init__(self, llm: ChatOpenAI):
        """
        Args:
            llm: OpenAI LLM 인스턴스
        """
        self.llm = llm
        self.prompt = get_job_posting_analysis_prompt()
        self.output_parser = StrOutputParser()
    
    async def analyze(
        self,
        company_name: str,
        position: str,
        job_posting: str,
        requirements: Optional[str] = None
    ) -> Dict:
        """
        채용공고 분석
        
        Args:
            company_name: 기업명
            position: 직무명
            job_posting: 채용공고 내용
            requirements: 추가 우대사항 (선택)
            
        Returns:
            분석 결과 딕셔너리
        """
        # 우대사항 섹션 포맷팅
        requirements_section = format_requirements_section(requirements)
        
        # LCEL Chain 구성: prompt | llm | output_parser
        chain = self.prompt | self.llm | self.output_parser
        
        result = await chain.ainvoke({
            "company_name": company_name,
            "position": position,
            "job_posting": job_posting,
            "requirements_section": requirements_section
        })
        
        # JSON 파싱
        return self._parse_json_response(result)
    
    def _parse_json_response(self, response: str) -> Dict:
        """LLM 응답에서 JSON 추출 및 파싱"""
        try:
            # JSON 블록 추출 (```json ... ``` 형식)
            if "```json" in response:
                start = response.find("```json") + 7
                end = response.find("```", start)
                json_str = response[start:end].strip()
            elif "```" in response:
                start = response.find("```") + 3
                end = response.find("```", start)
                json_str = response[start:end].strip()
            else:
                json_str = response.strip()
            
            return json.loads(json_str)
            
        except json.JSONDecodeError as e:
            return {
                "error": f"JSON 파싱 실패: {str(e)}",
                "raw_response": response,
                "ideal_candidate": {"characteristics": [], "core_values": []},
                "key_responsibilities": {"main_tasks": [], "kpis": []},
                "requirements": {"must_have": [], "nice_to_have": []},
                "core_competencies": {"technical": [], "soft_skills": []},
                "keywords": [],
                "tips": []
            }
