"""Serper API를 사용한 구글 검색 어댑터"""
import httpx
from typing import Dict, Optional, List
import logging
import json

logger = logging.getLogger(__name__)


class SerperSearchAdapter:
    """Serper API를 사용한 기업 정보 검색 어댑터
    
    기업명으로 구글 검색하여 인재상, 올해 목표 등을 수집합니다.
    API 한도 초과 등 실패 시 graceful degradation을 지원합니다.
    """
    
    def __init__(self, api_key: str, timeout: float = 30.0):
        self.api_key = api_key
        self.timeout = timeout
        self.base_url = "https://google.serper.dev/search"
    
    async def search_company_info(self, company_name: str) -> Dict:
        """
        기업 정보를 검색합니다.
        
        Args:
            company_name: 기업명
            
        Returns:
            Dict containing:
                - ideal_candidate: 인재상 정보
                - yearly_goals: 올해 목표/비전
                - culture: 기업 문화
                - search_results: 검색 결과 요약
                - sources: 출처 URL 목록
                - success: 검색 성공 여부
        """
        result = {
            "ideal_candidate": "",
            "yearly_goals": "",
            "culture": "",
            "search_results": [],
            "sources": [],
            "success": False,
            "error": None
        }
        
        if not self.api_key:
            result["error"] = "Serper API 키가 설정되지 않았습니다."
            logger.warning(result["error"])
            return result
        
        try:
            # 여러 쿼리로 검색하여 종합
            queries = [
                f"{company_name} 인재상",
                f"{company_name} 2026년 목표 비전",
                f"{company_name} 기업문화"
            ]
            
            all_results = []
            for query in queries:
                search_result = await self._search(query)
                if search_result:
                    all_results.extend(search_result)
            
            if all_results:
                result = self._process_results(all_results, company_name)
                result["success"] = True
            else:
                result["error"] = "검색 결과가 없습니다."
                
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                result["error"] = "API 호출 한도에 도달했습니다. 검색 결과 없이 진행합니다."
            else:
                result["error"] = f"API 오류: {e.response.status_code}"
            logger.warning(result["error"])
        except Exception as e:
            result["error"] = f"검색 중 오류 발생: {str(e)}"
            logger.warning(result["error"])
        
        return result
    
    async def _search(self, query: str) -> Optional[List[Dict]]:
        """Serper API로 검색 실행"""
        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "q": query,
            "gl": "kr",
            "hl": "ko",
            "num": 5
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                self.base_url,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            data = response.json()
            return data.get("organic", [])
    
    def _process_results(self, results: List[Dict], company_name: str) -> Dict:
        """검색 결과 처리 및 정보 추출"""
        processed = {
            "ideal_candidate": "",
            "yearly_goals": "",
            "culture": "",
            "search_results": [],
            "sources": [],
            "success": False,
            "error": None
        }
        
        ideal_candidate_keywords = ["인재상", "인재", "우리가 찾는", "원하는 인재"]
        goals_keywords = ["목표", "비전", "2026", "2025", "올해", "전략"]
        culture_keywords = ["문화", "복지", "조직", "분위기"]
        
        for item in results:
            title = item.get("title", "")
            snippet = item.get("snippet", "")
            link = item.get("link", "")
            
            combined_text = f"{title} {snippet}"
            
            # 결과 저장
            if link not in processed["sources"]:
                processed["sources"].append(link)
                processed["search_results"].append({
                    "title": title,
                    "snippet": snippet,
                    "link": link
                })
            
            # 인재상 관련
            if any(kw in combined_text for kw in ideal_candidate_keywords):
                if not processed["ideal_candidate"] or len(snippet) > len(processed["ideal_candidate"]):
                    processed["ideal_candidate"] = snippet
            
            # 목표/비전 관련
            if any(kw in combined_text for kw in goals_keywords):
                if not processed["yearly_goals"] or len(snippet) > len(processed["yearly_goals"]):
                    processed["yearly_goals"] = snippet
            
            # 기업문화 관련
            if any(kw in combined_text for kw in culture_keywords):
                if not processed["culture"] or len(snippet) > len(processed["culture"]):
                    processed["culture"] = snippet
        
        return processed
    
    def format_for_prompt(self, search_data: Dict) -> str:
        """검색 결과를 프롬프트용 텍스트로 포맷팅"""
        if not search_data.get("success"):
            return ""
        
        sections = []
        
        if search_data.get("ideal_candidate"):
            sections.append(f"【인재상】\n{search_data['ideal_candidate']}")
        
        if search_data.get("yearly_goals"):
            sections.append(f"\n【올해 목표/비전】\n{search_data['yearly_goals']}")
        
        if search_data.get("culture"):
            sections.append(f"\n【기업 문화】\n{search_data['culture']}")
        
        if sections:
            sections.append(f"\n(출처: {len(search_data.get('sources', []))}개의 검색 결과)")
        
        return "\n".join(sections)
