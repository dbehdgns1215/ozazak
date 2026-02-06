"""Redis 캐시 클라이언트"""
import json
import logging
from typing import Optional, Any
from datetime import datetime

import redis.asyncio as redis

from src.config.settings import settings

logger = logging.getLogger(__name__)


class RedisCache:
    """비동기 Redis 캐시 클라이언트"""
    
    _instance: Optional["RedisCache"] = None
    _client: Optional[redis.Redis] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    async def _get_client(self) -> redis.Redis:
        """Redis 클라이언트 lazy initialization"""
        if self._client is None:
            try:
                self._client = redis.from_url(
                    settings.redis_url,
                    encoding="utf-8",
                    decode_responses=True
                )
                # 연결 테스트
                await self._client.ping()
                logger.info(f"[REDIS] Connected to {settings.redis_url}")
            except Exception as e:
                logger.warning(f"[REDIS] Connection failed: {e}. Caching disabled.")
                self._client = None
        return self._client
    
    async def get(self, key: str) -> Optional[dict]:
        """캐시에서 값 조회"""
        try:
            client = await self._get_client()
            if client is None:
                return None
            
            data = await client.get(key)
            if data:
                logger.info(f"[REDIS] Cache HIT: {key}")
                return json.loads(data)
            logger.debug(f"[REDIS] Cache MISS: {key}")
            return None
        except Exception as e:
            logger.warning(f"[REDIS] Get failed for {key}: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl_seconds: int = 86400) -> bool:
        """캐시에 값 저장 (기본 TTL: 24시간)"""
        try:
            client = await self._get_client()
            if client is None:
                return False
            
            await client.setex(key, ttl_seconds, json.dumps(value, ensure_ascii=False))
            logger.info(f"[REDIS] Cache SET: {key} (TTL: {ttl_seconds}s)")
            return True
        except Exception as e:
            logger.warning(f"[REDIS] Set failed for {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """캐시에서 값 삭제"""
        try:
            client = await self._get_client()
            if client is None:
                return False
            
            await client.delete(key)
            return True
        except Exception as e:
            logger.warning(f"[REDIS] Delete failed for {key}: {e}")
            return False
    
    @staticmethod
    def calculate_ttl_from_end_date(end_date: Optional[str]) -> int:
        """공고 마감일 기반 동적 TTL 계산"""
        if not end_date:
            return 86400  # 기본 24시간
        
        try:
            # ISO 형식 또는 일반 날짜 형식 파싱
            if "T" in end_date:
                end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
            else:
                end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            
            now = datetime.now(end_dt.tzinfo) if end_dt.tzinfo else datetime.now()
            ttl_seconds = int((end_dt - now).total_seconds())
            
            # 최소 1시간, 최대 30일 범위 제한
            return max(3600, min(ttl_seconds, 2592000))
        except Exception as e:
            logger.warning(f"[REDIS] TTL calculation failed for {end_date}: {e}")
            return 86400  # 파싱 실패 시 24시간


# 싱글톤 인스턴스
redis_cache = RedisCache()
