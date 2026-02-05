import re
from ..state import QuestionState
import logging

logger = logging.getLogger(__name__)

class FormatFixerNode:
    """마크다운 및 서식 정리 노드"""
    
    async def __call__(self, state: QuestionState) -> dict:
        content = state["current_content"]
        
        # 1. 마크다운 헤더 제거 (# 제목, #제목 등)
        content = re.sub(r'^#+\s*', '', content, flags=re.MULTILINE)
        
        # 2. 볼드체 제거 (**텍스트**)
        content = re.sub(r'\*\*(.*?)\*\*', r'\1', content)
        
        # 3. 불필요한 공백 및 따옴표 제거
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = content.strip().strip('"').strip("'")
        
        # 4. 기업명 및 직무명 치환 Tool Application
        company_name = state.get("company_name", "").strip()
        position = state.get("position", "").strip()
        
        if company_name:
            placeholders = [
                r'\[지원\s*기업\]', r'\[회사명\]', r'\(지원\s*기업\)', r'\(회사명\)', 
                r'OOO', r'000', r'\[지원기업\]'
            ]
            for p in placeholders:
                content = re.sub(p, company_name, content, flags=re.IGNORECASE)
                
        if position:
            placeholders = [r'\[지원\s*직무\]', r'\[직무명\]', r'\(지원\s*직무\)', r'\(직무명\)']
            for p in placeholders:
                content = re.sub(p, position, content, flags=re.IGNORECASE)

        logger.info(f"Format fixing complete. Final length: {len(content)}")
        
        return {"final_content": content}
