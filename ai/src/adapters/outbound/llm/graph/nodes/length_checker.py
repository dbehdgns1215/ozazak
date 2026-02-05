from ..state import QuestionState
import logging

logger = logging.getLogger(__name__)

class LengthCheckerNode:
    """글자수 검사 노드"""

    async def __call__(self, state: QuestionState) -> dict:
        content = state.get("current_content", "")
        char_limit = state.get("char_limit", 800)
        char_count = len(content)
        attempt = state.get("attempt", 0)
        max_attempts = state.get("max_attempts", 3)

        # 오차 범위: 목표의 80% ~ 100% (strict upper limit)
        min_limit = int(char_limit * 0.8)
        max_limit = char_limit  # Strict upper limit

        # 최대 시도 횟수 초과 시 강제 통과
        if attempt >= max_attempts:
            logger.info(f"Length check: Force pass after {attempt} attempts ({char_count}/{char_limit})")
            return {"char_count": char_count, "char_diff": 0, "check_result": "pass"}

        if char_count > max_limit:
            logger.info(f"Length check: Too long ({char_count}/{max_limit}, diff={char_count - max_limit}, attempt={attempt})")
            return {"char_count": char_count, "char_diff": char_count - max_limit, "check_result": "too_long"}
        elif char_count < min_limit:
            logger.info(f"Length check: Too short ({char_count}/{char_limit}, diff={min_limit - char_count}, attempt={attempt})")
            return {"char_count": char_count, "char_diff": min_limit - char_count, "check_result": "too_short"}
        else:
            logger.info(f"Length check: Passed ({char_count}/{char_limit})")
            return {"char_count": char_count, "char_diff": 0, "check_result": "pass"}
