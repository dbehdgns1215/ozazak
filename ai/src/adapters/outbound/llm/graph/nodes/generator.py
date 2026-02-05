import logging
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.language_models import BaseChatModel

from ..state import QuestionState

logger = logging.getLogger(__name__)

class GeneratorNode:
    """단일 문항 초안 생성 노드"""

    def __init__(self, llm: BaseChatModel):
        self.llm = llm
        self.output_parser = StrOutputParser()

    async def __call__(self, state: QuestionState) -> dict:
        pipeline_state = state["pipeline_state"]
        question = state["question"]
        char_limit = state["char_limit"]
        relevant_blocks = state["relevant_blocks"]
        reference_hint = state.get("reference_hint", {})

        # === DEBUG LOGGING ===
        logger.info(f"[DEBUG] GeneratorNode: question='{question[:30]}...', char_limit={char_limit}")
        logger.info(f"[DEBUG] GeneratorNode: relevant_blocks count={len(relevant_blocks)}")
        
        job_posting = pipeline_state.get("job_posting", {})
        company_name = job_posting.get("companyName", "지원 기업")
        position = job_posting.get("position", "지원 직무")
        user_prompt = pipeline_state.get("user_prompt", "")  # 사용자 지시사항
        
        # 블록 내용 포맷팅
        blocks_text = "\n\n".join([f"- {b}" for b in relevant_blocks]) if relevant_blocks else "없음"
        
        # 사용자 지시사항 섹션 (있을 경우에만 추가)
        user_instruction_section = ""
        if user_prompt:
            user_instruction_section = f"""
## 사용자 추가 지시사항 (최우선 반영)
{user_prompt}
"""
        
        prompt = ChatPromptTemplate.from_template("""
당신은 취업 전문가입니다. 다음 정보를 바탕으로 자기소개서의 한 문항을 작성해주세요.

## 지원 정보
- 기업명: {company_name}
- 지원 직무: {position}

## 문항
{question}

## 글자수 목표
약 {target_chars}자 (최대 {char_limit}자)

## 활용할 나의 경험 (핵심 소재)
{blocks_text}

## [필수] 참고 자소서 내용 (반드시 이 내용을 기반으로 작성)
- 아래 내용을 반드시 포함하여 작성하세요
- 새로운 내용을 창작하지 말고, 제공된 내용만 활용하세요
- 활용 가능 내용: {usable_content}
- 활용 힌트: {usage_hint}
{user_instruction_section}
## 작성 규칙
1. **두괄식 작성**: 핵심 성과나 주장을 첫 문장에 제시하세요.
2. **구체적 근거**: 경험 블록의 수치와 성과를 반드시 포함하세요.
3. **스토리텔링**: 참고 자소서의 내용을 필수로 반영하여 작성하세요.
4. **마크다운 미사용**: 제목이나 볼드체 없이 줄글로만 작성하세요.
5. **소제목 없음**: 소제목을 달지 마세요.

자기소개서 작성:
""")
        
        chain = prompt | self.llm | self.output_parser
        
        # 목표 글자수는 제한의 90%
        target_chars = int(char_limit * 0.9)
        
        try:
            logger.info("[DEBUG] GeneratorNode: Calling LLM...")
            content = await chain.ainvoke({
                "company_name": company_name,
                "position": position,
                "question": question,
                "target_chars": target_chars,
                "char_limit": char_limit,
                "blocks_text": blocks_text,
                "usable_content": reference_hint.get("usable_content", "없음"),
                "usage_hint": reference_hint.get("usage_hint", "경험 소재를 중심으로 직관적으로 작성"),
                "user_instruction_section": user_instruction_section
            })

            logger.info(f"[DEBUG] GeneratorNode: LLM returned content length={len(content)}")

            return {
                "current_content": content,
                "char_count": len(content),
                "attempt": 1
            }

        except Exception as e:
            logger.error(f"[DEBUG] GeneratorNode: Generation failed: {e}")
            return {"current_content": "", "char_count": 0}
