from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.language_models import BaseChatModel
import logging

from ..state import QuestionState

logger = logging.getLogger(__name__)

class EnhancerNode:
    """글자수 조정 및 내용 보강 노드"""

    def __init__(self, llm: BaseChatModel):
        self.llm = llm
        self.output_parser = StrOutputParser()

    async def __call__(self, state: QuestionState) -> dict:
        content = state.get("current_content", "")
        check_result = state.get("check_result", "pass")
        char_limit = state.get("char_limit", 800)
        attempt = state.get("attempt", 0)

        # 디버그 로깅
        logger.info(f"Enhancer: state keys={list(state.keys())}")
        logger.info(f"Enhancer: check_result={check_result}, content_len={len(content)}, attempt={attempt}")

        # 이미 통과했으면 스킵
        if check_result == "pass":
            logger.info("Enhancer: Skipping (check_result is pass)")
            return {"attempt": attempt + 1}

        # 내용이 없으면 스킵
        if not content:
            logger.warning("Enhancer: Skipping (content is empty)")
            return {"attempt": attempt + 1, "check_result": "pass"}

        prompt_template = ""
        if check_result == "too_long":
            prompt_template = """
다음 자기소개서 내용을 요약하여 글자수를 줄여주세요.

## 원문
{content}

## 목표
현재 {current_len}자 → {target_len}자 이내로 축소 (핵심 내용은 유지)

## 규칙
- 불필요한 수식어나 반복을 제거하세요.
- 핵심 성과와 경험은 유지하세요.
- 문장을 간결하게 다듬으세요.
- 마크다운 서식(#, *, - 등)을 사용하지 마세요.
"""
        else:  # too_short
            prompt_template = """
다음 자기소개서 내용을 보강하여 글자수를 늘려주세요.

## 원문
{content}

## 목표
현재 {current_len}자 → {target_len}자 이상으로 확장

## 규칙
- 경험의 구체적인 상황(Context)과 행동(Action)을 더 자세히 묘사하세요.
- 성과(Result)의 의미나 배운 점을 덧붙이세요.
- 전체적인 흐름을 유지하며 살을 붙이세요.
- 마크다운 서식(#, *, - 등)을 사용하지 마세요.
"""

        prompt = ChatPromptTemplate.from_template(prompt_template)
        chain = prompt | self.llm | self.output_parser

        target_len = int(char_limit * 0.95)

        try:
            logger.info(f"Enhancer: Refining content (attempt {attempt + 1}, {check_result})")
            refined_content = await chain.ainvoke({
                "content": content,
                "current_len": len(content),
                "target_len": target_len
            })

            refined_content = refined_content.strip()
            logger.info(f"Enhancer: Refined {len(content)} -> {len(refined_content)} chars")

            return {
                "current_content": refined_content,
                "char_count": len(refined_content),
                "attempt": attempt + 1
            }
        except Exception as e:
            logger.error(f"Enhancement failed: {e}")
            # 실패 시에도 attempt 증가 + 강제 pass 설정하여 무한 루프 방지
            return {
                "attempt": attempt + 1,
                "check_result": "pass"  # 실패 시 강제 통과
            }
