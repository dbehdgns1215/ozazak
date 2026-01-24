"""Spring Backend API 클라이언트"""
import httpx
from typing import Dict, List, Optional
import logging

from src.config.settings import settings

logger = logging.getLogger(__name__)


class SpringAPIClient:
    """Spring Backend API 클라이언트
    
    PostgreSQL에 저장된 블록 및 자기소개서 데이터를 가져옵니다.
    """
    
    def __init__(self, base_url: Optional[str] = None, timeout: float = 30.0):
        self.base_url = base_url or settings.backend_api_base_url
        self.timeout = timeout
    
    async def get_all_blocks(self, user_id: str, auth_token: Optional[str] = None) -> List[Dict]:
        """
        사용자의 모든 블록을 가져옵니다.
        
        GET /api/cover-letters/blocks
        
        Args:
            user_id: 사용자 ID
            auth_token: 인증 토큰 (선택)
            
        Returns:
            블록 리스트 [{"id", "category", "content", "keywords"}, ...]
        """
        try:
            headers = self._build_headers(auth_token)
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/cover-letters/blocks",
                    headers=headers,
                    params={"userId": user_id}
                )
                response.raise_for_status()
                
                data = response.json()
                # API 응답 구조에 따라 조정 필요
                return data.get("data", data) if isinstance(data, dict) else data
                
        except httpx.HTTPStatusError as e:
            logger.error(f"블록 조회 실패: {e.response.status_code}")
            return []
        except Exception as e:
            logger.error(f"블록 조회 중 오류: {e}")
            return []
    
    async def get_all_cover_letters(self, user_id: str, auth_token: Optional[str] = None) -> List[Dict]:
        """
        사용자의 모든 자기소개서를 가져옵니다.
        
        GET /api/cover-letters/originals
        
        Args:
            user_id: 사용자 ID
            auth_token: 인증 토큰 (선택)
            
        Returns:
            자기소개서 리스트 [{"id", "company", "question", "content"}, ...]
        """
        try:
            headers = self._build_headers(auth_token)
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/cover-letters/originals",
                    headers=headers,
                    params={"userId": user_id}
                )
                response.raise_for_status()
                
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data
                
        except httpx.HTTPStatusError as e:
            logger.error(f"자소서 조회 실패: {e.response.status_code}")
            return []
        except Exception as e:
            logger.error(f"자소서 조회 중 오류: {e}")
            return []
    
    def _build_headers(self, auth_token: Optional[str] = None) -> Dict[str, str]:
        """요청 헤더 생성"""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        return headers
    
    async def get_block_by_id(self, block_id: str, auth_token: Optional[str] = None) -> Optional[Dict]:
        """
        특정 블록을 ID로 가져옵니다.
        
        GET /api/cover-letters/blocks/{id}
        """
        try:
            headers = self._build_headers(auth_token)
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/cover-letters/blocks/{block_id}",
                    headers=headers
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data
                
        except Exception as e:
            logger.error(f"블록 조회 실패 (id={block_id}): {e}")
            return None
    
    async def get_cover_letter_by_id(self, cover_letter_id: str, auth_token: Optional[str] = None) -> Optional[Dict]:
        """
        특정 자기소개서를 ID로 가져옵니다.
        
        GET /api/cover-letters/originals/{id}
        """
        try:
            headers = self._build_headers(auth_token)
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/cover-letters/originals/{cover_letter_id}",
                    headers=headers
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data
                
        except Exception as e:
            logger.error(f"자소서 조회 실패 (id={cover_letter_id}): {e}")
            return None
    
    async def get_blocks_by_ids(self, block_ids: List[str], auth_token: Optional[str] = None) -> List[Dict]:
        """여러 블록을 ID 리스트로 가져옵니다."""
        import asyncio
        tasks = [self.get_block_by_id(bid, auth_token) for bid in block_ids]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None]
    
    async def get_cover_letters_by_ids(self, cover_letter_ids: List[str], auth_token: Optional[str] = None) -> List[Dict]:
        """여러 자소서를 ID 리스트로 가져옵니다."""
        import asyncio
        tasks = [self.get_cover_letter_by_id(cid, auth_token) for cid in cover_letter_ids]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None]
