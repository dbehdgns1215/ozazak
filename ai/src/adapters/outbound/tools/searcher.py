"""Serper 검색 Tool (기업 정보 검색)"""
import httpx
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)


class SerperSearchTool:
    """Serper API 검색 Tool
    
    기업명으로 인재상, 올해 목표, 기업문화 등을 검색합니다.
    """
    
    name = "serper_search"
    description = "기업명으로 인재상, 올해 목표, 기업문화 등을 구글 검색합니다."
    
    def __init__(self, api_key: Optional[str] = None, timeout: float = 30.0):
        self.api_key = api_key
        self.timeout = timeout
        self.base_url = "https://google.serper.dev/search"
    
    async def run(self, company_name: str) -> Dict:
        """
        기업 정보 검색 실행
        
        Returns:
            {
                "ideal_candidate": str,    # 인재상
                "yearly_goals": str,       # 올해 목표
                "culture": str,            # 기업 문화
                "sources": [],             # 출처 URL
                "success": bool
            }
        """
        if not self.api_key:
            logger.warning("Serper API 키가 설정되지 않았습니다.")
            return {"success": False, "error": "API 키 없음"}
        
        result = {
            "ideal_candidate": "",
            "yearly_goals": "",
            "culture": "",
            "sources": [],
            "success": False
        }
        
        queries = [
            (f"{company_name} 인재상 원하는 인재", "ideal_candidate"),
            (f"{company_name} 2026년 목표 비전 전략", "yearly_goals"),
            (f"{company_name} 기업문화 조직문화", "culture"),
        ]
        
        for query, field in queries:
            try:
                search_result = await self._search(query)
                if search_result:
                    result[field] = search_result.get("answer", "")
                    result["sources"].extend(search_result.get("sources", []))
                    result["success"] = True
            except Exception as e:
                logger.warning(f"검색 실패 ({field}): {e}")
        
        return result
    
    async def _search(self, query: str) -> Optional[Dict]:
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
            response = await client.post(self.base_url, json=payload, headers=headers)
            
            if response.status_code == 429:
                logger.warning("Serper API 사용량 한도 도달")
                return None
            
            response.raise_for_status()
            data = response.json()
            
            result = {"answer": "", "sources": []}
            
            # Answer Box
            if "answerBox" in data:
                box = data["answerBox"]
                result["answer"] = box.get("answer") or box.get("snippet", "")
            
            # Knowledge Graph
            elif "knowledgeGraph" in data:
                kg = data["knowledgeGraph"]
                result["answer"] = kg.get("description", "")
            
            # 일반 검색 결과
            elif "organic" in data and data["organic"]:
                snippets = [r.get("snippet", "") for r in data["organic"][:3]]
                result["answer"] = " ".join(snippets)
                result["sources"] = [r.get("link") for r in data["organic"][:3] if r.get("link")]
            
            return result
