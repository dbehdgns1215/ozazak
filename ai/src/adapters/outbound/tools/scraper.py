"""채용공고 스크래핑 Tool (기존 JobPostingScraperAdapter 래핑)"""
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Optional
import logging
import re

logger = logging.getLogger(__name__)


class JobPostingScraperTool:
    """채용공고 스크래핑 Tool
    
    자소설닷컴 등에서 채용공고 정보(담당업무, 자격요건, 우대사항)를 추출합니다.
    """
    
    name = "job_posting_scraper"
    description = "채용공고 URL 또는 본문에서 직무 정보(담당업무, 자격요건, 우대사항)를 추출합니다."
    
    def __init__(self, timeout: float = 30.0):
        self.timeout = timeout
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        }
    
    async def run(
        self,
        poster_url: Optional[str] = None,
        fallback_content: Optional[str] = None,
        position: Optional[str] = None
    ) -> Dict:
        """
        채용공고 스크래핑 실행
        
        Returns:
            {
                "preferred_qualifications": [],
                "responsibilities": [],
                "requirements": [],
                "success": bool,
                "source": "url" | "fallback" | "failed"
            }
        """
        result = {
            "preferred_qualifications": [],
            "responsibilities": [],
            "requirements": [],
            "success": False,
            "source": "failed"
        }
        
        # 1. URL 스크래핑 시도
        if poster_url and self._is_valid_url(poster_url):
            try:
                html = await self._fetch_page(poster_url)
                if html:
                    parsed = self._parse_html(html, position)
                    if parsed.get("success"):
                        parsed["source"] = "url"
                        return parsed
            except Exception as e:
                logger.warning(f"URL 스크래핑 실패: {e}")
        
        # 2. Fallback 텍스트 파싱
        if fallback_content:
            try:
                parsed = self._extract_from_text(fallback_content, position)
                parsed["source"] = "fallback"
                return parsed
            except Exception as e:
                logger.warning(f"본문 파싱 실패: {e}")
        
        return result
    
    def _is_valid_url(self, url: str) -> bool:
        return bool(url and url.startswith("http"))
    
    async def _fetch_page(self, url: str) -> Optional[str]:
        async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.text
    
    def _parse_html(self, html: str, position: Optional[str] = None) -> Dict:
        soup = BeautifulSoup(html, "lxml")
        
        # 본문 추출
        for selector in [".job-posting-content", ".recruit-detail", "article", "main", "body"]:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(separator="\n", strip=True)
                if text:
                    return self._extract_from_text(text, position)
        
        return {"success": False}
    
    def _extract_from_text(self, text: str, position: Optional[str] = None) -> Dict:
        result = {
            "preferred_qualifications": [],
            "responsibilities": [],
            "requirements": [],
            "success": True
        }
        
        lines = text.split("\n")
        current_section = None
        
        qual_kw = ["우대", "우대사항", "플러스"]
        resp_kw = ["담당", "담당업무", "주요업무", "하시게 될 일"]
        req_kw = ["자격", "자격요건", "필수", "지원자격", "찾아요"]
        end_kw = ["복리후생", "급여", "근무", "전형", "접수"]
        
        for line in lines:
            line = line.strip()
            if not line or len(line) < 3:
                continue
            
            lower = line.lower()
            
            if any(kw in lower for kw in qual_kw):
                current_section = "qual"
            elif any(kw in lower for kw in resp_kw):
                current_section = "resp"
            elif any(kw in lower for kw in req_kw):
                current_section = "req"
            elif any(kw in lower for kw in end_kw):
                current_section = None
            elif current_section:
                cleaned = re.sub(r"^[-•·▪▶◦○●\*\d\.]+\s*", "", line)
                if len(cleaned) > 3:
                    if current_section == "qual":
                        result["preferred_qualifications"].append(cleaned)
                    elif current_section == "resp":
                        result["responsibilities"].append(cleaned)
                    elif current_section == "req":
                        result["requirements"].append(cleaned)
        
        total = sum(len(result[k]) for k in ["preferred_qualifications", "responsibilities", "requirements"])
        result["success"] = total > 0
        return result
