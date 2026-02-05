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
        
        # Key Mismatch Fix: 'companyName' -> 'company'
        if "company" in job_posting:
            company_name = job_posting["company"]
        else:
            company_name = job_posting.get("companyName", "지원 기업")
            
        position = job_posting.get("position", "지원 직무")
        
        # 채용공고 상세 정보 추출
        tasks = job_posting.get("tasks", [])
        requirements = job_posting.get("requirements", [])
        preferred = job_posting.get("preferred", [])
        
        # 리스트 포맷팅 함수
        def format_list(items, title):
            if not items:
                return ""
            return f"\n{title}:\n" + "\n".join([f"- {item}" for item in items])

        job_context = ""
        job_context += format_list(tasks, "## [참고] 주요 업무")
        job_context += format_list(requirements, "## [참고] 자격 요건")
        job_context += format_list(preferred, "## [참고] 우대 사항")
        
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
{job_context}

## [필수] 부정 제약조건 (Negative Constraints)
- 참고 자소서의 **기업명**은 절대로 그대로 사용하지 마세요. 현재 지원하는 **{company_name}** 기준으로 반드시 치환해야 합니다.
- **[중요]** 내 경험(Blocks)이 부족하다면, 참고 자소서의 스토리와 경험을 그대로 차용하여 작성해도 좋습니다. 단, **회사명과 직무명은 반드시 현재 지원 공고에 맞춰 수정**해야 합니다.

## 문항
{question}

## 글자수 목표
약 {target_chars}자 (최대 {char_limit}자)

## 활용할 나의 경험 (핵심 소재)
{blocks_text}

## [선택] 참고 자소서 내용
- 활용 가능 내용: {usable_content}
- 활용 힌트: {usage_hint}
{user_instruction_section}
## 작성 가이드
1. **자연스러운 흐름**: 제공된 경험 소재({blocks_text})를 바탕으로 자연스럽게 이야기를 구성하세요.
2. **소재 부족 시 대처**:
   - 내 경험(Blocks)이 없더라도, 참고 자소서 내용({usable_content})이 있다면 이를 적극 활용하여 완성된 초안을 작성하세요.
   - 단, 참고 자소서의 구체적인 에피소드를 가져올 때는 **현재 지원하는 기업({company_name})에 맞게 맥락을 수정(Re-contextualize)**해야 합니다.
3. **참고 내용 활용**: 참고 자소서 내용이 있다면 그 문체나 논리 구조를 참고하되, 문항 의도에 맞게 유연하게 각색하세요.
4. **빈 칸 지양**: '[ ]'와 같은 플레이스홀더를 남기지 말고, 문맥에 맞는 자연스러운 표현으로 완성된 문장을 만드세요.
5. **형식 자유**: 줄글 형태로 작성하되, 필요하다면 문단을 나누어 가독성을 높이세요.

## [중요] 출력 형식
- 반드시 **완전한 문장**으로 시작하세요. 첫 글자부터 의미가 있어야 합니다.
- 마크다운 헤더(#)나 볼드체(**)를 사용하지 마세요.

자기소개서 작성:
""")
        
        chain = prompt | self.llm | self.output_parser
        
        # 목표 글자수는 제한의 90%
        target_chars = int(char_limit * 0.9)
        
        # 재료 부족 체크 (Blocks도 없고, Reference Content도 없는 경우)
        usable_content = reference_hint.get("usable_content", "없음")
        matched_section = reference_hint.get("matched_section", "")
        
        # [Option A] 더 엄격한 검사: 블록과 참고 자소서 모두 없으면 에러
        has_blocks = bool(relevant_blocks)
        
        # reference_hint가 비어있거나, usable_content가 "없음"이면 참고 자소서 없음으로 판단
        has_reference = (
            reference_hint and  # reference_hint 자체가 존재
            usable_content and 
            usable_content not in ["없음", "", "없음.", "None", None] and
            usable_content.strip()  # 공백만 있는 경우도 제외
        )
        
        logger.info(f"[DEBUG] GeneratorNode: Material check - has_blocks={has_blocks}, has_reference={has_reference}")
        logger.info(f"[DEBUG] GeneratorNode: reference_hint={reference_hint}, usable_content='{usable_content}'")
        
        if not has_blocks and not has_reference:
            import random
            
            error_messages = [
                "[소재 부족] 작성 가능한 경험이 없습니다. 블록을 추가하거나 참고할 자소서를 연결해 주세요.",
                "[소재 부족] 경험 블록과 참고 자소서가 모두 비어있습니다. 소재를 추가해 주세요.",
                "[소재 부족] AI가 작성할 수 있는 소재가 없습니다. 경험 블록 또는 참고 자소서를 등록해 주세요."
            ]
            
            selected_msg = random.choice(error_messages)
            logger.warning(f"[OPTION A] No materials available. Returning error: '{selected_msg}'")
            
            return {
                "current_content": selected_msg,
                "char_count": len(selected_msg),
                "attempt": 1
            }


        try:
            logger.info("[DEBUG] GeneratorNode: Calling LLM...")
            content = await chain.ainvoke({
                "company_name": company_name,
                "position": position,
                "question": question,
                "target_chars": target_chars,
                "char_limit": char_limit,
                "char_limit": char_limit,
                "blocks_text": blocks_text,
                "job_context": job_context,
                "usable_content": usable_content,
                "usage_hint": reference_hint.get("usage_hint", "경험 소재를 중심으로 직관적으로 작성"),
                "user_instruction_section": user_instruction_section
            })

            logger.info(f"[DEBUG] GeneratorNode: LLM returned content length={len(content)}")

            return {
                "current_content": content,
                "char_count": len(content),
                "attempt": 1,
                "company_name": company_name,
                "position": position
            }

        except Exception as e:
            import traceback
            logger.error(f"[DEBUG] GeneratorNode: Generation failed: {e}")
            logger.error(traceback.format_exc())
            return {"current_content": "", "char_count": 0}
