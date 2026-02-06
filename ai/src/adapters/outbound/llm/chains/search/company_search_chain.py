import asyncio
import logging
from typing import Dict, Any, List
from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.language_models import BaseChatModel

from ..schemas import CompanySearchResult

logger = logging.getLogger(__name__)

class CompanySearchChain:
    def __init__(self, llm: BaseChatModel, api_key: str):
        self.llm = llm
        self.search = GoogleSerperAPIWrapper(serper_api_key=api_key, type="search")
        self.news_search = GoogleSerperAPIWrapper(serper_api_key=api_key, type="news")
        self.parser = JsonOutputParser(pydantic_object=CompanySearchResult)
        
        self.prompt = PromptTemplate(
            template="""
            검색 결과를 바탕으로 해당 기업에 대한 정보를 JSON 형식으로 정리해주세요.
            
            기업명: {company_name}
            지원 직무: {position}
            
            [검색 결과]
            {results}
            
            [뉴스 검색 결과]
            {news_results}
            
            다음 형식의 JSON으로 출력해주세요:
            {{
                "company_name": "{company_name}",
                "industry": "주요 업종",
                "description": "기업에 대한 한 줄 소개 (핵심 가치나 비전 포함)",
                "news": ["최근 주요 뉴스 (채용, 성장, 이슈 등 관련성 높은 순) 3개"],
                "culture": "기업 문화나 인재상, 핵심 가치"
            }}
            
            응답은 반드시 유효한 JSON 형식이어야 합니다.
            """,
            input_variables=["company_name", "position", "results", "news_results"]
        )
        
        # LCEL chain
        self.chain = self.prompt | self.llm | self.parser
    
    async def search_company(self, company_name: str, position: str) -> CompanySearchResult:
        try:
            logger.info(f"Searching for company: {company_name}")
            
            # 1. 일반 검색 (기업 소개, 문화)
            query = f"{company_name} 기업정보 인재상 기업문화"
            results = await self._async_search(query)
            
            # 2. 뉴스 검색
            news_query = f"{company_name} 최근 이슈 뉴스"
            news_results = await self._async_search(news_query, search_type="news")
            
            # 3. LLM 요약 및 구조화
            try:
                result = await self.chain.ainvoke({
                    "company_name": company_name,
                    "position": position,
                    "results": results,
                    "news_results": news_results
                })
                
                # Pydantic 모델로 변환 (이미 parser가 dict를 반환함)
                # raw_results 추가
                result["raw_results"] = [str(results), str(news_results)]
                
                return CompanySearchResult(**result)
            
            except Exception as parse_error:
                logger.warning(f"JSON parsing failed, using fallback: {parse_error}")
                # JSON 파싱 실패 시 기본값 반환
                return CompanySearchResult(
                    company_name=company_name,
                    industry="정보 없음",
                    description=f"{company_name}에 대한 정보",
                    news=[],
                    culture="정보 없음",
                    raw_results=[str(results), str(news_results)]
                )
        
        except Exception as e:
            logger.error(f"Company Search Error: {e}")
            # 검색 실패 시 기본값 반환
            return CompanySearchResult(
                company_name=company_name,
                industry="정보 없음",
                description="기업 정보를 가져올 수 없습니다.",
                news=[],
                culture="정보 없음",
                raw_results=[]
            )

    async def _async_search(self, query: str, search_type: str = "search") -> Any:
        """비동기 검색 래퍼 (실제 비동기 실행을 위해 run_in_executor 사용)"""
        loop = asyncio.get_event_loop()
        wrapper = self.news_search if search_type == "news" else self.search
        return await loop.run_in_executor(
            None, 
            lambda: wrapper.results(query)
        )
