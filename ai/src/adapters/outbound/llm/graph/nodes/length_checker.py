from ..state import QuestionState

from ..state import QuestionState
import logging

logger = logging.getLogger(__name__)

class LengthCheckerNode:
    """글자수 검사 노드"""
    
    async def __call__(self, state: QuestionState) -> dict:
        content = state["current_content"]
        char_limit = state["char_limit"]
        char_count = len(content)
        
        # 오차 범위: 목표의 ±10% 또는 최대치 초과
        min_limit = int(char_limit * 0.8)
        
        if char_count > char_limit:
            logger.info(f"Length check: Too long ({char_count}/{char_limit}, diff={char_count - char_limit})")
            return {"char_diff": char_count - char_limit, "check_result": "too_long"}
        elif char_count < min_limit:
            logger.info(f"Length check: Too short ({char_count}/{char_limit}, diff={min_limit - char_count})")
            return {"char_diff": min_limit - char_count, "check_result": "too_short"}
        else:
            logger.info(f"Length check: Passed ({char_count}/{char_limit})")
            return {"char_diff": 0, "check_result": "pass"}
