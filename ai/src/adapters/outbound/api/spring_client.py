"""Spring Backend API 클라이언트"""
import httpx
from typing import Dict, List, Optional, Any
import logging

from src.config.settings import settings
from src.application.ports.backend_port import BackendPort

logger = logging.getLogger(__name__)


class SpringAPIClient(BackendPort):
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

    # ==================== AI 생성 결과 저장 API ====================

    async def get_essays_by_coverletter(
        self,
        coverletter_id: int,
        auth_token: Optional[str] = None
    ) -> List[Dict]:
        """
        특정 자소서의 모든 Essay 조회

        GET /api/cover-letters/{coverletterId}/essays

        Returns:
            [{"id", "questionId", "questionContent", "content", "charMax", "version", "versionTitle", "isCurrent"}, ...]
        """
        try:
            headers = self._build_headers(auth_token)

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/cover-letters/{coverletter_id}/essays",
                    headers=headers
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data

        except httpx.HTTPStatusError as e:
            logger.error(f"Essay 조회 실패 (coverletter_id={coverletter_id}): {e.response.status_code}")
            return []
        except Exception as e:
            logger.error(f"Essay 조회 중 오류: {e}")
            return []

    async def save_essay(
        self,
        coverletter_id: int,
        question_id: int,
        content: str,
        version_title: str = "AI 생성",
        set_as_current: bool = True,
        auth_token: Optional[str] = None
    ) -> Optional[Dict]:
        """
        AI 생성 자소서를 새 버전으로 저장

        POST /api/cover-letters/{coverletterId}/essays

        Args:
            coverletter_id: 자소서 ID
            question_id: 문항 ID
            content: 생성된 자소서 내용
            version_title: 버전 타이틀 (기본: "AI 생성")
            set_as_current: 현재 버전으로 설정 여부 (기본: True)
            auth_token: 인증 토큰

        Returns:
            {"id", "questionId", "content", "version", "versionTitle", "isCurrent"}
        """
        try:
            headers = self._build_headers(auth_token)
            payload = {
                "questionId": question_id,
                "content": content,
                "versionTitle": version_title,
                "setAsCurrent": set_as_current
            }

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/cover-letters/{coverletter_id}/essays",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                logger.info(f"Essay 저장 성공 (coverletter_id={coverletter_id}, question_id={question_id}, version={data.get('version')})")
                return data.get("data", data) if isinstance(data, dict) else data

        except httpx.HTTPStatusError as e:
            logger.error(f"Essay 저장 실패: {e.response.status_code} - {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Essay 저장 중 오류: {e}")
            return None

    # ==================== 토큰 사용량 추적 API ====================

    async def save_token_usage(
        self,
        account_id: int,
        model_name: str,
        request_type: str,
        input_tokens: int,
        output_tokens: int,
        auth_token: Optional[str] = None
    ) -> bool:
        """
        토큰 사용량 저장 (내부 호출)

        POST /api/ai/token-usage

        Args:
            account_id: 사용자 ID
            model_name: 모델명 (예: "gemini-flash", "gpt-4o", "claude")
            request_type: 요청 타입 (예: "SMART_GENERATION", "REFINE")
            input_tokens: 입력 토큰 수
            output_tokens: 출력 토큰 수
            auth_token: 인증 토큰 (선택)

        Returns:
            성공 여부
        """
        try:
            headers = self._build_headers(auth_token)
            payload = {
                "accountId": account_id,
                "modelName": model_name,
                "requestType": request_type,
                "inputTokens": input_tokens,
                "outputTokens": output_tokens,
                "totalTokens": input_tokens + output_tokens
            }

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/ai/token-usage",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                logger.info(f"토큰 사용량 저장 성공 (account_id={account_id}, model={model_name}, total={input_tokens + output_tokens})")
                return True

        except httpx.HTTPStatusError as e:
            logger.error(f"토큰 사용량 저장 실패: {e.response.status_code} - {e.response.text}")
            return False
        except Exception as e:
            logger.error(f"토큰 사용량 저장 중 오류: {e}")
            return False

    async def get_token_usage_summary(
        self,
        account_id: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        auth_token: Optional[str] = None
    ) -> Optional[Dict]:
        """
        사용자 토큰 사용량 조회

        GET /api/accounts/{accountId}/token-usage

        Args:
            account_id: 사용자 ID
            start_date: 시작 날짜 (ISO 8601, 선택)
            end_date: 종료 날짜 (ISO 8601, 선택)
            auth_token: 인증 토큰

        Returns:
            {"totalTokens", "byModel", "byRequestType"}
        """
        try:
            headers = self._build_headers(auth_token)
            params = {}
            if start_date:
                params["startDate"] = start_date
            if end_date:
                params["endDate"] = end_date

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/accounts/{account_id}/token-usage",
                    headers=headers,
                    params=params
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data

        except httpx.HTTPStatusError as e:
            logger.error(f"토큰 사용량 조회 실패: {e.response.status_code}")
            return None
        except Exception as e:
            logger.error(f"토큰 사용량 조회 중 오류: {e}")
            return None
