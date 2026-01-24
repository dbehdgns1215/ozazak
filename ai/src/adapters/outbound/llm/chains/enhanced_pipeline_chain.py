"""Enhanced Pipeline Chain - 통합 파이프라인 (스크래핑 + 검색 + 생성 + COT 스트리밍)"""
import asyncio
from typing import AsyncGenerator, List, Dict, Optional
import logging

from ..chains.cot_events import COTEvent, COTEventType, COTStep
from ...web.job_posting_scraper import JobPostingScraperAdapter
from ...search.serper_search import SerperSearchAdapter
from src.config.settings import settings

logger = logging.getLogger(__name__)


class EnhancedPipelineChain:
    """통합 파이프라인 Chain
    
    1. 포스터 URL에서 채용공고 스크래핑
    2. 기업명으로 구글 검색하여 인재상/목표 수집
    3. 수집된 정보를 바탕으로 자기소개서 생성
    4. 각 단계를 COT 형태로 실시간 스트리밍
    """
    
    def __init__(self, llm_adapter):
        """
        Args:
            llm_adapter: LLM 어댑터 (OpenAI, Claude, Gemini 등)
        """
        self.llm_adapter = llm_adapter
        self.scraper = JobPostingScraperAdapter()
        self.searcher = SerperSearchAdapter(api_key=settings.serper_api_key)
    
    async def run_with_cot_stream(
        self,
        question: str,
        blocks: List[str],
        company_name: str,
        position: str,
        poster_url: Optional[str] = None,
        fallback_content: Optional[str] = None,
        char_limit: int = 800,
        references: Optional[List[str]] = None
    ) -> AsyncGenerator[COTEvent, None]:
        """
        COT 형태로 파이프라인을 실행하며 각 단계를 스트리밍합니다.
        
        Args:
            question: 자기소개서 문항
            blocks: 경험 블록 리스트
            company_name: 기업명
            position: 직무명
            poster_url: 채용공고 포스터 URL (선택)
            fallback_content: 본문 텍스트 (URL 없을 시 사용)
            char_limit: 글자 수 제한
            references: 참고 자기소개서 (선택)
            
        Yields:
            COTEvent: 각 단계별 이벤트
        """
        scraped_data = {}
        search_data = {}
        
        # ===== 1단계: 채용공고 스크래핑 =====
        yield COTEvent.step_start(
            COTStep.SCRAPING,
            f"📄 '{company_name}' 채용공고에서 직무 정보 수집 중..."
        )
        
        try:
            scraped_data = await self.scraper.scrape_job_posting(
                poster_url=poster_url,
                fallback_content=fallback_content,
                position=position
            )
            
            if scraped_data.get("success"):
                summary = self._summarize_scraped_data(scraped_data)
                yield COTEvent.step_complete(COTStep.SCRAPING, {
                    "success": True,
                    "summary": summary,
                    "source": scraped_data.get("source", "unknown")
                })
                yield COTEvent.thinking(
                    f"💭 채용공고에서 {len(scraped_data.get('responsibilities', []))}개의 업무, "
                    f"{len(scraped_data.get('preferred_qualifications', []))}개의 우대사항 확인"
                )
            else:
                yield COTEvent.step_complete(COTStep.SCRAPING, {
                    "success": False,
                    "message": "채용공고 정보를 찾지 못했습니다. 기본 정보로 진행합니다."
                })
        except Exception as e:
            logger.warning(f"스크래핑 실패: {e}")
            yield COTEvent.step_complete(COTStep.SCRAPING, {
                "success": False,
                "error": str(e)
            })
        
        await asyncio.sleep(0.3)  # UI 가독성을 위한 짧은 딜레이
        
        # ===== 2단계: 기업 정보 검색 =====
        yield COTEvent.step_start(
            COTStep.SEARCHING,
            f"🔍 '{company_name}' 인재상 및 올해 목표 검색 중..."
        )
        
        try:
            search_data = await self.searcher.search_company_info(company_name)
            
            if search_data.get("success"):
                yield COTEvent.step_complete(COTStep.SEARCHING, {
                    "success": True,
                    "ideal_candidate_found": bool(search_data.get("ideal_candidate")),
                    "yearly_goals_found": bool(search_data.get("yearly_goals")),
                    "sources_count": len(search_data.get("sources", []))
                })
                
                if search_data.get("ideal_candidate"):
                    yield COTEvent.thinking(
                        f"💭 인재상 발견: '{search_data['ideal_candidate'][:50]}...'"
                    )
            else:
                yield COTEvent.step_complete(COTStep.SEARCHING, {
                    "success": False,
                    "message": search_data.get("error", "검색 결과 없음. 검색 없이 진행합니다.")
                })
        except Exception as e:
            logger.warning(f"검색 실패: {e}")
            yield COTEvent.step_complete(COTStep.SEARCHING, {
                "success": False,
                "error": str(e)
            })
        
        await asyncio.sleep(0.3)
        
        # ===== 3단계: 정보 분석 =====
        yield COTEvent.step_start(
            COTStep.ANALYZING,
            "🧠 수집된 정보와 경험 블록 매칭 분석 중..."
        )
        
        # 분석 결과 통합
        enhanced_job_analysis = self._build_enhanced_analysis(
            scraped_data=scraped_data,
            search_data=search_data,
            company_name=company_name,
            position=position
        )
        
        # 블록 요약
        block_summary = self._summarize_blocks(blocks)
        yield COTEvent.thinking(
            f"💭 {len(blocks)}개의 경험 블록과 채용공고 요구사항 매칭 중... "
            f"({block_summary})"
        )
        
        await asyncio.sleep(0.3)
        
        yield COTEvent.step_complete(COTStep.ANALYZING, {
            "enhanced_analysis": True,
            "block_count": len(blocks)
        })
        
        # ===== 4단계: 자기소개서 생성 =====
        yield COTEvent.step_start(
            COTStep.GENERATING,
            f"✍️ '{question[:30]}...' 문항에 대한 자기소개서 작성 시작..."
        )
        
        try:
            # 스트리밍 생성
            async for chunk in self.llm_adapter.stream_cover_letter(
                question=question,
                blocks=blocks,
                references=references,
                job_analysis=enhanced_job_analysis,
                char_limit=char_limit,
                company_name=company_name,
                position=position
            ):
                yield COTEvent.content(chunk)
            
            yield COTEvent.step_complete(COTStep.GENERATING, {
                "success": True
            })
            
        except Exception as e:
            logger.error(f"생성 실패: {e}")
            yield COTEvent.error(f"자기소개서 생성 중 오류: {str(e)}", COTStep.GENERATING)
        
        # ===== 완료 =====
        yield COTEvent.done({
            "scraping_success": scraped_data.get("success", False),
            "search_success": search_data.get("success", False)
        })
    
    def _summarize_scraped_data(self, data: Dict) -> str:
        """스크래핑 데이터 요약"""
        parts = []
        if data.get("responsibilities"):
            parts.append(f"업무 {len(data['responsibilities'])}개")
        if data.get("requirements"):
            parts.append(f"자격요건 {len(data['requirements'])}개")
        if data.get("preferred_qualifications"):
            parts.append(f"우대사항 {len(data['preferred_qualifications'])}개")
        return ", ".join(parts) if parts else "정보 없음"
    
    def _summarize_blocks(self, blocks: List[str]) -> str:
        """블록 요약"""
        if not blocks:
            return "블록 없음"
        
        # 첫 블록의 앞부분만 보여줌
        first_block = blocks[0][:30] + "..." if len(blocks[0]) > 30 else blocks[0]
        if len(blocks) > 1:
            return f"'{first_block}' 외 {len(blocks)-1}개"
        return f"'{first_block}'"
    
    def _build_enhanced_analysis(
        self,
        scraped_data: Dict,
        search_data: Dict,
        company_name: str,
        position: str
    ) -> Dict:
        """스크래핑 및 검색 결과를 통합한 분석 결과 생성"""
        analysis = {
            "company_name": company_name,
            "position": position,
            "ideal_candidate": {},
            "key_responsibilities": {},
            "requirements": {},
            "core_competencies": {},
            "keywords": [],
            "tips": []
        }
        
        # 스크래핑 데이터 통합
        if scraped_data.get("success"):
            analysis["key_responsibilities"] = {
                "main_tasks": scraped_data.get("responsibilities", [])[:5],
                "kpis": []
            }
            analysis["requirements"] = {
                "must_have": scraped_data.get("requirements", [])[:5],
                "nice_to_have": scraped_data.get("preferred_qualifications", [])[:5]
            }
            
            # 키워드 추출
            all_text = " ".join(
                scraped_data.get("responsibilities", []) +
                scraped_data.get("requirements", []) +
                scraped_data.get("preferred_qualifications", [])
            )
            analysis["keywords"] = self._extract_keywords(all_text)
        
        # 검색 데이터 통합
        if search_data.get("success"):
            analysis["ideal_candidate"] = {
                "characteristics": [search_data.get("ideal_candidate", "")] if search_data.get("ideal_candidate") else [],
                "core_values": [search_data.get("culture", "")] if search_data.get("culture") else []
            }
            
            if search_data.get("yearly_goals"):
                analysis["tips"].append(f"올해 목표: {search_data['yearly_goals']}")
        
        return analysis
    
    def _extract_keywords(self, text: str) -> List[str]:
        """텍스트에서 주요 키워드 추출"""
        # 자주 등장하는 역량 관련 키워드
        common_keywords = [
            "협업", "커뮤니케이션", "문제해결", "분석", "기획", "개발",
            "데이터", "고객", "서비스", "마케팅", "영업", "전략",
            "리더십", "책임감", "창의", "혁신", "성장", "도전"
        ]
        
        found = []
        for kw in common_keywords:
            if kw in text and kw not in found:
                found.append(kw)
                if len(found) >= 5:
                    break
        
        return found
