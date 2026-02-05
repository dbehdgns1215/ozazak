import re
import logging

logger = logging.getLogger(__name__)

class CleanupChain:
    """
    텍스트 정제 체인 (마크다운 제거, 특수문자 정리 등)
    LLM을 사용하지 않고 Regex를 사용하여 빠르고 안정적으로 처리
    """
    
    async def clean(self, content: str) -> str:
        """
        텍스트 정제 수행
        """
        logger.info("Cleaning up content...")
        cleaned = content
        
        # 1. 마크다운 헤더 (# 제목) -> 제목 (여러개 겹친 경우 포함)
        cleaned = re.sub(r'^#+\s*', '', cleaned, flags=re.MULTILINE)
        
        # 2. 볼드체 (**텍스트**) -> 텍스트
        cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', cleaned)
        cleaned = re.sub(r'__(.*?)__', r'\1', cleaned)
        
        # 3. 이탤릭체 (*텍스트*) -> 텍스트
        cleaned = re.sub(r'\*(.*?)\*', r'\1', cleaned)
        
        # 4. 코드 블록/인라인 코드 제거
        # 코드 블록은 내용 자체를 제거 (보통 자소서에 코드가 그대로 들어가는 경우는 드묾)
        cleaned = re.sub(r'```.*?```', '', cleaned, flags=re.DOTALL) 
        cleaned = re.sub(r'`(.*?)`', r'\1', cleaned)
        
        # 5. 리스트 마커 제거 (새로운 개선사항)
        # - 항목, * 항목, 1. 항목 등 글머리 기호 제거하고 평문처럼 연결하거나 줄바꿈 유지
        # 자소서에서는 개조식보다는 서술식이 선호되므로 마커만 제거
        cleaned = re.sub(r'^[-*]\s+', '', cleaned, flags=re.MULTILINE)  # -, *
        cleaned = re.sub(r'^\d+\.\s+', '', cleaned, flags=re.MULTILINE)  # 1. 2.
        
        # 6. 불필요한 공백 정리
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        cleaned = cleaned.strip()
        
        return cleaned
