import logging
import base64
import json
import re
import aiohttp
from typing import Optional, Tuple
from bs4 import BeautifulSoup
from urllib.parse import urljoin

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage

# 프로젝트 구조에 맞는 Schema 임포트
from ..schemas import JobPostingData

logger = logging.getLogger(__name__)

class JobPostingScraperChain:
    def __init__(self, llm: BaseChatModel, vision_llm: Optional[BaseChatModel] = None):
        self.llm = llm
        self.vision_llm = vision_llm or llm
        self.parser = JsonOutputParser(pydantic_object=JobPostingData)
        
        # 텍스트 분석용 프롬프트
        self.text_prompt = PromptTemplate(
            template="""
            다음 채용공고 내용을 분석하여 구조화된 JSON 데이터로 변환해주세요.
            
            [채용공고 내용]
            {text}
            
            반드시 아래 필드를 포함하는 JSON 형식으로 응답하세요:
            {{
                "title": "공고 제목",
                "company": "기업명",
                "description": "직무 상세 설명 (요약)",
                "requirements": ["자격요건 리스트"],
                "preferred": ["우대사항 리스트"],
                "tasks": ["주요 업무 리스트"],
                "benefits": ["복리후생 리스트"]
            }}
            """,
            input_variables=["text"]
        )
        
        self.text_chain = self.text_prompt | self.llm | self.parser

    async def scrape(self, url: Optional[str] = None, fallback: Optional[str] = None) -> JobPostingData:
        """
        메인 로직: DB Content 우선 분석 -> 실패 시 URL 스크래핑
        Note: fallback 파라미터는 db_content(recruitment.content)를 의미함
        """
        db_content = fallback  # 파라미터 이름 매핑

        try:
            logger.info(f"[SCRAPE] Starting... Priority: DB_CONTENT > URL")

            # 1. DB Content (recruitment.content) 최우선 처리
            if db_content and len(db_content.strip()) > 50:
                logger.info("[SCRAPE:DB] Analyzing content from Database.")
                
                # 1-1. 이미지 추출 시도
                poster_url = self._extract_image_from_html(db_content)
                if poster_url:
                    logger.info(f"[SCRAPE:DB_VISION] Image found in DB. Analyzing image...")
                    return await self._analyze_image(poster_url)
                
                # 1-2. 텍스트 추출 및 분석
                text = self._extract_text_from_html(db_content)
                if len(text.strip()) > 100:
                    logger.info("[SCRAPE:DB_TEXT] Sufficient text found in DB. Analyzing text...")
                    result = await self.text_chain.ainvoke({"text": text[:15000]})
                    return JobPostingData(**result)

            # 2. DB 정보가 부족할 경우 URL 스크래핑 진행
            if url:
                logger.info(f"[SCRAPE:URL] Fetching external URL: {url}")
                scraped_text, found_image = await self._fetch_url(url)
                
                if found_image:
                    logger.info(f"[SCRAPE:URL_VISION] Image found via URL. Analyzing...")
                    return await self._analyze_image(found_image)
                
                if scraped_text:
                    logger.info("[SCRAPE:URL_TEXT] Analyzing scraped text...")
                    result = await self.text_chain.ainvoke({"text": scraped_text[:15000]})
                    return JobPostingData(**result)

            raise ValueError("분석할 수 있는 유효한 데이터(DB/URL)가 없습니다.")

        except Exception as e:
            logger.error(f"[SCRAPE:ERROR] {str(e)}")
            return self._get_default_data(db_content or "정보 없음")

    async def _analyze_image(self, image_url: str) -> JobPostingData:
        """
        Vision 모델 분석: Timeout 방지를 위해 Base64 인코딩 사용
        """
        try:
            # 1. 이미지 다운로드 (로컬 서버에서 직접 수행)
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url, timeout=15) as resp:
                    if resp.status != 200:
                        raise Exception(f"이미지 다운로드 실패 (HTTP {resp.status})")
                    image_data = await resp.read()

            # 2. Base64 변환 (OpenAI/Gemini 400 에러 방지용)
            base64_image = base64.b64encode(image_data).decode('utf-8')
            mime_type = "image/webp" if "webp" in image_url.lower() else "image/jpeg"

            prompt = """
            너는 전문 OCR 분석가야. 아래 지침을 엄격히 준수해:
            1. 이미지에 명시적으로 적힌 '텍스트'만 추출해. 절대 배경 지식으로 기업명을 추측하지 마.
            2. 로고나 하단 텍스트를 보고 '기업명(company)'을 반드시 재검증해. (예: 로고가 AXA면 AXA손해보험)
            3. 정보가 없으면 지어내지 말고 빈 리스트([])나 "정보 없음"으로 응답해.
            4. 반드시 유효한 JSON 포맷으로만 응답해.
            """

            message = HumanMessage(
                content=[
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime_type};base64,{base64_image}"}
                    }
                ]
            )

            # 3. 모델 호출
            response = await self.vision_llm.ainvoke([message])
            return self._parse_json_robust(response.content)

        except Exception as e:
            logger.error(f"[VISION:ERROR] {e}")
            # 이미지 분석 실패 시 에러 전파 (상위에서 fallback 처리 가능)
            raise e

    async def _fetch_url(self, url: str) -> Tuple[str, Optional[str]]:
        """URL에서 텍스트와 이미지 추출"""
        headers = {"User-Agent": "Mozilla/5.0"}
        async with aiohttp.ClientSession() as session:
            try:
                # 직접 이미지 링크인 경우
                if url.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    return "", url

                async with session.get(url, headers=headers, timeout=10) as resp:
                    if resp.status != 200: return "", None
                    html = await resp.text()
                    
                    found_image = self._extract_image_from_html(html, base_url=url)
                    text = self._extract_text_from_html(html)
                    return text, found_image
            except:
                return "", None

    def _extract_image_from_html(self, html: str, base_url: str = "") -> Optional[str]:
        """포스터 이미지 주소 추출 (로딩바/아이콘 필터링 적용)"""
        soup = BeautifulSoup(html, 'html.parser')
        blocked = ['loading', 'spinner', 'icon', 'logo', 'banner', 'pixel', 'thumb']
        
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if not src: continue
            
            src_lower = src.lower()
            if any(k in src_lower for k in blocked): continue
            
            if src.startswith('//'): src = "https:" + src
            elif not src.startswith('http'): src = urljoin(base_url, src)
            
            if any(ext in src_lower for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                return src
        return None

    def _extract_text_from_html(self, html: str) -> str:
        """HTML 태그 제거 후 클린 텍스트 반환"""
        soup = BeautifulSoup(html, 'html.parser')
        for s in soup(["script", "style", "nav", "footer", "header"]):
            s.decompose()
        return soup.get_text(separator='\n').strip()

    def _parse_json_robust(self, content: str) -> JobPostingData:
        """LLM 응답에서 JSON만 정교하게 추출"""
        try:
            # Markdown 코드 블록 제거
            if "```" in content:
                content = re.sub(r'```json\s*|\s*```', '', content)
            
            # JSON 파싱 시도 (중괄호 찾기)
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                data = json.loads(match.group())
                return JobPostingData(**data)
            
            # 그냥 로드 시도
            data = json.loads(content)
            return JobPostingData(**data)

        except Exception as e:
            logger.error(f"JSON Parsing Error: {e}, Content: {content[:200]}")
            # 파싱 실패 시 최소한의 데이터라도 반환
            return JobPostingData(title="분석 실패 (포맷 에러)", company="알 수 없음", description=content[:500], 
                                 requirements=[], preferred=[], tasks=[], benefits=[])

    def _get_default_data(self, desc: str) -> JobPostingData:
        return JobPostingData(title="채용공고", company="알 수 없음", description=desc[:500],
                             requirements=[], preferred=[], tasks=[], benefits=[])
