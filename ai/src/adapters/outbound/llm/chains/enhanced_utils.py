"""Enhanced 기능 유틸리티 (스크래핑 + 검색 + job_analysis 생성)"""
import json
from typing import Dict, Optional, AsyncGenerator
import logging

from src.adapters.outbound.tools.scraper import JobPostingScraperTool
from src.adapters.outbound.tools.searcher import SerperSearchTool
from src.config.settings import settings

logger = logging.getLogger(__name__)


async def run_enhanced_analysis(
    company_name: str,
    position: str,
    poster_url: Optional[str] = None,
    fallback_content: Optional[str] = None,
    existing_job_analysis: Optional[Dict] = None
) -> AsyncGenerator[tuple, None]:
    """
    Enhanced 분석 실행 (스크래핑 + 검색)
    
    Yields:
        (event_type, data): SSE 이벤트 타입과 데이터
        마지막으로 ("job_analysis", job_analysis_dict) 반환
    """
    scraper = JobPostingScraperTool()
    searcher = SerperSearchTool(api_key=settings.serper_api_key)
    
    scraped_data = {}
    search_data = {}
    
    # 이미 job_analysis가 있으면 스킵
    if existing_job_analysis:
        yield ("job_analysis", existing_job_analysis)
        return
    
    # ===== 1단계: 채용공고 스크래핑 =====
    if poster_url or fallback_content:
        yield ("step_start", {
            "step": "scraping",
            "message": f"📄 '{company_name}' 채용공고에서 직무 정보 수집 중..."
        })
        
        try:
            scraped_data = await scraper.run(
                poster_url=poster_url,
                fallback_content=fallback_content,
                position=position
            )
            
            if scraped_data.get("success"):
                yield ("step_complete", {
                    "step": "scraping",
                    "data": {
                        "success": True,
                        "source": scraped_data.get("source", "unknown")
                    }
                })
            else:
                yield ("step_complete", {
                    "step": "scraping",
                    "data": {"success": False}
                })
        except Exception as e:
            logger.warning(f"스크래핑 실패: {e}")
            yield ("step_complete", {
                "step": "scraping",
                "data": {"success": False, "error": str(e)}
            })
    
    # ===== 2단계: 기업 정보 검색 =====
    yield ("step_start", {
        "step": "searching",
        "message": f"🔍 '{company_name}' 인재상 및 올해 목표 검색 중..."
    })
    
    try:
        search_data = await searcher.run(company_name)
        
        yield ("step_complete", {
            "step": "searching",
            "data": {
                "success": search_data.get("success", False),
                "ideal_candidate_found": bool(search_data.get("ideal_candidate")),
                "yearly_goals_found": bool(search_data.get("yearly_goals"))
            }
        })
    except Exception as e:
        logger.warning(f"검색 실패: {e}")
        yield ("step_complete", {
            "step": "searching",
            "data": {"success": False, "error": str(e)}
        })
    
    # ===== 3단계: 분석 결과 통합 =====
    job_analysis = _build_job_analysis(scraped_data, search_data, company_name, position)
    yield ("job_analysis", job_analysis)


def _build_job_analysis(
    scraped_data: Dict,
    search_data: Dict,
    company_name: str,
    position: str
) -> Dict:
    """스크래핑 및 검색 결과를 통합한 job_analysis 생성"""
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
        analysis["keywords"] = _extract_keywords(all_text)
    
    # 검색 데이터 통합
    if search_data.get("success"):
        analysis["ideal_candidate"] = {
            "characteristics": [search_data.get("ideal_candidate", "")] if search_data.get("ideal_candidate") else [],
            "core_values": [search_data.get("culture", "")] if search_data.get("culture") else []
        }
        
        if search_data.get("yearly_goals"):
            analysis["tips"].append(f"올해 목표: {search_data['yearly_goals']}")
    
    return analysis


def _extract_keywords(text: str) -> list:
    """텍스트에서 주요 키워드 추출"""
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
