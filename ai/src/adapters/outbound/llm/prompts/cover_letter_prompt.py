"""자기소개서 생성용 프롬프트 템플릿"""
from langchain_core.prompts import PromptTemplate


# 자기소개서 생성 프롬프트
COVER_LETTER_GENERATION_PROMPT = """당신은 자기소개서 작성을 돕는 전문 컨설턴트입니다.
주어진 블록들과 참고 자료를 활용하여 문항에 맞는 자기소개서를 작성해주세요.

문항:
{question}

활용 가능한 블록들:
{blocks}

{reference_section}

작성 가이드:
1. 문항의 의도를 정확히 파악하고 답변하세요
2. 제공된 블록들을 적절히 조합하고 재구성하세요
3. STAR 기법을 활용하세요:
   - Situation (상황): 어떤 상황이었는지
   - Task (과제): 무엇을 해결해야 했는지
   - Action (행동): 어떻게 해결했는지
   - Result (결과): 어떤 결과를 얻었는지
4. 구체적인 수치와 사실을 포함하세요
5. 글자 수는 500-800자로 작성하세요
6. 자연스럽고 진정성 있는 문체를 사용하세요

자기소개서를 작성해주세요:
"""

REFERENCE_SECTION_TEMPLATE = """참고 자기소개서 (문체와 구조 참고용):
{references}
"""


def get_cover_letter_generation_prompt() -> PromptTemplate:
    """자기소개서 생성 프롬프트 반환"""
    return PromptTemplate(
        input_variables=["question", "blocks", "reference_section"],
        template=COVER_LETTER_GENERATION_PROMPT
    )


def format_reference_section(references: list[str]) -> str:
    """참고 자료 섹션 포맷팅"""
    if not references:
        return ""
    
    formatted_refs = "\n\n".join([
        f"[참고 {i+1}]\n{ref}" 
        for i, ref in enumerate(references)
    ])
    
    return REFERENCE_SECTION_TEMPLATE.format(references=formatted_refs)
