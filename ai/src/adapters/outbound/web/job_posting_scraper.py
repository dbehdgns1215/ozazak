"""자소설닷컴 채용공고 웹 스크래핑 어댑터"""
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Optional, List
import logging
import re

logger = logging.getLogger(__name__)


class JobPostingScraperAdapter:
    """자소설닷컴 채용공고 스크래핑 어댑터
    
    포스터 URL에서 직무 정보(우대사항, 담당 과업 등)를 추출합니다.
    URL이 없거나 스크래핑 실패 시 본문 텍스트에서 정보를 추출합니다.
    """
    
    def __init__(self, timeout: float = 30.0):
        self.timeout = timeout
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        }
    
    async def scrape_job_posting(
        self,
        poster_url: Optional[str] = None,
        fallback_content: Optional[str] = None,
        position: Optional[str] = None
    ) -> Dict:
        """
        채용공고에서 직무 정보를 스크래핑합니다.
        
        Args:
            poster_url: 자소설닷컴 포스터 URL (선택)
            fallback_content: URL이 없을 경우 사용할 본문 텍스트 (선택)
            position: 직무명 (필터링에 사용)
            
        Returns:
            Dict containing:
                - preferred_qualifications: 우대사항 목록
                - responsibilities: 담당 과업 목록
                - requirements: 자격요건 목록
                - success: 스크래핑 성공 여부
                - source: 데이터 출처 ("url", "fallback", "failed")
        """
        result = {
            "preferred_qualifications": [],
            "responsibilities": [],
            "requirements": [],
            "success": False,
            "source": "failed",
            "raw_text": ""
        }
        
        # 1. URL 스크래핑 시도
        if poster_url and self._is_valid_url(poster_url):
            try:
                html_content = await self._fetch_page(poster_url)
                if html_content:
                    parsed = self._parse_jasoseol_html(html_content, position)
                    if parsed.get("success"):
                        parsed["source"] = "url"
                        return parsed
                    logger.warning(f"HTML 파싱 실패, fallback 시도: {poster_url}")
            except Exception as e:
                logger.warning(f"URL 스크래핑 실패: {poster_url}, error: {e}")
        
        # 2. Fallback: 본문 텍스트에서 추출
        if fallback_content:
            try:
                parsed = self._extract_from_text(fallback_content, position)
                parsed["source"] = "fallback"
                return parsed
            except Exception as e:
                logger.warning(f"본문 파싱 실패: {e}")
        
        return result
    
    def _is_valid_url(self, url: str) -> bool:
        """URL 유효성 검사"""
        if not url:
            return False
        # 잘못된 URL 패턴 필터링 (이미지에서 본 잘린 URL 등)
        if "jasoseol" in url or "saramin" in url or "jobkorea" in url:
            return url.startswith("http")
        return url.startswith("http")
    
    async def _fetch_page(self, url: str) -> Optional[str]:
        """웹 페이지 HTML 가져오기"""
        async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.text
    
    def _parse_jasoseol_html(self, html: str, position: Optional[str] = None) -> Dict:
        """자소설닷컴 HTML 파싱"""
        soup = BeautifulSoup(html, "lxml")
        result = {
            "preferred_qualifications": [],
            "responsibilities": [],
            "requirements": [],
            "success": False,
            "raw_text": ""
        }
        
        # 본문 텍스트 추출 시도 (다양한 셀렉터)
        content_selectors = [
            ".job-posting-content",
            ".recruit-detail",
            ".job-description",
            ".posting-content",
            "article",
            ".content-area",
            "main"
        ]
        
        raw_text = ""
        for selector in content_selectors:
            element = soup.select_one(selector)
            if element:
                raw_text = element.get_text(separator="\n", strip=True)
                break
        
        if not raw_text:
            # 전체 body에서 추출
            body = soup.find("body")
            if body:
                raw_text = body.get_text(separator="\n", strip=True)
        
        if raw_text:
            result["raw_text"] = raw_text
            return self._extract_from_text(raw_text, position)
        
        return result
    
    def _extract_from_text(self, text: str, position: Optional[str] = None) -> Dict:
        """텍스트에서 직무 정보 추출"""
        result = {
            "preferred_qualifications": [],
            "responsibilities": [],
            "requirements": [],
            "success": True,
            "raw_text": text[:2000]  # 처음 2000자만 저장
        }
        
        lines = text.split("\n")
        current_section = None
        
        # 섹션 키워드 패턴
        qualification_keywords = ["우대", "우대사항", "우대 조건", "이런 분이면 더 좋아요", "플러스 요소"]
        responsibility_keywords = ["담당", "담당업무", "담당 업무", "주요업무", "주요 업무", "하시게 될 일", "이런 일을 해요"]
        requirement_keywords = ["자격", "자격요건", "자격 요건", "필수", "필수 조건", "지원자격", "이런 분을 찾아요"]
        
        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                continue
            
            line_lower = line_stripped.lower()
            
            # 섹션 감지
            if any(kw in line_lower for kw in qualification_keywords):
                current_section = "qualification"
                continue
            elif any(kw in line_lower for kw in responsibility_keywords):
                current_section = "responsibility"
                continue
            elif any(kw in line_lower for kw in requirement_keywords):
                current_section = "requirement"
                continue
            
            # 섹션 종료 감지 (다른 주요 섹션 시작)
            if any(kw in line_lower for kw in ["복리후생", "급여", "근무", "전형", "접수", "제출", "문의"]):
                current_section = None
                continue
            
            # 내용 추가 (bullet point 형식 처리)
            if current_section and len(line_stripped) > 3:
                # 불릿 포인트 정리
                cleaned = re.sub(r"^[-•·▪▶◦○●\*\d\.\)]+\s*", "", line_stripped)
                if cleaned and len(cleaned) > 3:
                    if current_section == "qualification":
                        result["preferred_qualifications"].append(cleaned)
                    elif current_section == "responsibility":
                        result["responsibilities"].append(cleaned)
                    elif current_section == "requirement":
                        result["requirements"].append(cleaned)
        
        # 성공 여부 판단
        total_items = (
            len(result["preferred_qualifications"]) +
            len(result["responsibilities"]) +
            len(result["requirements"])
        )
        result["success"] = total_items > 0
        
        return result
    
    def format_for_prompt(self, scraped_data: Dict) -> str:
        """스크래핑 결과를 프롬프트용 텍스트로 포맷팅"""
        if not scraped_data.get("success"):
            return ""
        
        sections = []
        
        if scraped_data.get("responsibilities"):
            sections.append("【담당 업무】")
            for item in scraped_data["responsibilities"][:5]:
                sections.append(f"  • {item}")
        
        if scraped_data.get("requirements"):
            sections.append("\n【자격 요건】")
            for item in scraped_data["requirements"][:5]:
                sections.append(f"  • {item}")
        
        if scraped_data.get("preferred_qualifications"):
            sections.append("\n【우대 사항】")
            for item in scraped_data["preferred_qualifications"][:5]:
                sections.append(f"  • {item}")
        
        return "\n".join(sections)
