import re
from ..state import QuestionState
import logging

logger = logging.getLogger(__name__)

class FormatFixerNode:
    """마크다운 및 서식 정리 노드"""
    
    async def __call__(self, state: QuestionState) -> dict:
        content = state["current_content"]
        
        # 1. 마크다운 헤더 제거 (# 제목)
        content = re.sub(r'^#+\s+', '', content, flags=re.MULTILINE)
        
        # 2. 볼드체 제거 (**텍스트**)
        content = re.sub(r'\*\*(.*?)\*\*', r'\1', content)
        
        # 3. 불필요한 공백 제거
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = content.strip()
        
        logger.info(f"Format fixing complete. Final length: {len(content)}")
        
        return {"final_content": content}
