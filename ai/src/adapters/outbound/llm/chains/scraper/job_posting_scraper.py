import logging
from typing import Optional
import aiohttp
from bs4 import BeautifulSoup
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.language_models import BaseChatModel

from ..schemas import JobPostingData

logger = logging.getLogger(__name__)

class JobPostingScraperChain:
    def __init__(self, llm: BaseChatModel):
        self.llm = llm
        self.parser = JsonOutputParser(pydantic_object=JobPostingData)
        
        self.prompt = PromptTemplate(
            template="""
            다음 채용공고 내용을 분석하여 구조화된 JSON 데이터로 변환해주세요.
            
            [채용공고 내용]
            {text}
            
            다음 필드를 포함하는 JSON을 작성해주세요:
            {{
                "title": "공고 제목",
                "company": "기업명",
                "description": "직무 상세 설명 (요약)",
                "requirements": ["자격요건 리스트"],
                "preferred": ["우대사항 리스트"],
                "tasks": ["주요 업무 리스트"],
                "benefits": ["복리후생 리스트"]
            }}
            
            내용이 명시되지 않은 필드는 빈 리스트 [] 또는 "정보 없음"으로 채워주세요.
            """,
            input_variables=["text"]
        )
        
        self.chain = self.prompt | self.llm | self.parser
        
    async def scrape(self, url: Optional[str] = None, fallback: Optional[str] = None) -> JobPostingData:
        try:
            logger.info(f"Scraping job posting URL: {url}")
            
            text = ""
            if url:
                text = await self._fetch_url(url)
                # 텍스트가 너무 짧거나 실패하면 fallback 사용
                if len(text.strip()) < 50 and fallback:
                    text = fallback
            elif fallback:
                text = fallback
            else:
                raise ValueError("URL과 Fallback content가 모두 없습니다.")
            
            # HTML 태그 제거 및 텍스트 정리 (BS4 사용 후에도 남은 잡다한 것들)
            # LLM에게는 Clean Text 전달
            
            # LLM 분석 실행
            # Claude/Gemini 등 최신 모델은 Context Window가 크므로 20,000자까지 허용
            MAX_TEXT_LENGTH = 20000 
            text_to_analyze = text[:MAX_TEXT_LENGTH]
            
            result = await self.chain.ainvoke({"text": text_to_analyze})
            
            return JobPostingData(**result)
            
        except Exception as e:
            logger.error(f"Scraping/Parsing Error: {e}")
            # 실패 시 기본값 (fallback 내용이라도 있으면 그것을 description에 넣음)
            return JobPostingData(
                title="채용공고",
                company="알 수 없음",
                description=fallback or "정보를 가져올 수 없습니다.",
                requirements=[],
                preferred=[],
                tasks=[],
                benefits=[]
            )
    
    async def _fetch_url(self, url: str) -> str:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, headers=headers, timeout=10) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        # 스크립트, 스타일 제거
                        for script in soup(["script", "style", "header", "footer", "nav"]):
                            script.decompose()
                            
                        text = soup.get_text(separator='\n')
                        
                        # 공백 정리
                        lines = (line.strip() for line in text.splitlines())
                        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                        text = '\n'.join(chunk for chunk in chunks if chunk)
                        
                        return text
                    else:
                        logger.warning(f"URL fetch failed: {response.status}")
                        return ""
            except Exception as e:
                logger.error(f"URL fetch exception: {e}")
                return ""
