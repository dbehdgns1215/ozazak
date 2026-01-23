"""블록 생성용 프롬프트 템플릿"""
from langchain_core.prompts import PromptTemplate


# 프로젝트로부터 블록 추출 프롬프트
BLOCK_EXTRACTION_FROM_PROJECT_PROMPT = """당신은 자기소개서 작성을 돕는 전문 컨설턴트입니다.
주어진 프로젝트 정보를 분석하여 자기소개서 작성에 활용할 수 있는 블록들을 추출해주세요.

프로젝트 정보:
{project_info}

추출 규칙:
1. 각 블록은 재사용 가능한 독립적인 경험/성과 단위여야 합니다
2. 블록은 다음 카테고리로 분류됩니다:
   - TECHNICAL_SKILL: 기술적 역량 (사용 기술, 개발 경험)
   - PROBLEM_SOLVING: 문제 해결 경험
   - TEAMWORK: 협업 및 팀워크 경험
   - LEADERSHIP: 리더십 경험
   - ACHIEVEMENT: 성과 및 결과
   - LEARNING: 학습 및 성장 경험
3. 각 블록은 구체적이고 정량적인 내용을 포함해야 합니다
4. 한 블록은 2-4문장으로 구성됩니다

다음 JSON 형식으로 응답해주세요:
{{
  "blocks": [
    {{
      "category": "카테고리명",
      "content": "블록 내용",
      "keywords": ["키워드1", "키워드2"]
    }}
  ]
}}
"""

# 자기소개서로부터 블록 추출 프롬프트
BLOCK_EXTRACTION_FROM_COVER_LETTER_PROMPT = """당신은 자기소개서 작성을 돕는 전문 컨설턴트입니다.
주어진 자기소개서를 분석하여 재사용 가능한 블록들을 추출해주세요.

자기소개서 내용:
문항: {question}
답변: {essay}

추출 규칙:
1. 각 블록은 재사용 가능한 독립적인 경험/성과 단위여야 합니다
2. 블록은 다음 카테고리로 분류됩니다:
   - TECHNICAL_SKILL: 기술적 역량
   - PROBLEM_SOLVING: 문제 해결 경험
   - TEAMWORK: 협업 및 팀워크 경험
   - LEADERSHIP: 리더십 경험
   - ACHIEVEMENT: 성과 및 결과
   - LEARNING: 학습 및 성장 경험
3. 각 블록은 구체적이고 정량적인 내용을 포함해야 합니다
4. 한 블록은 2-4문장으로 구성됩니다

다음 JSON 형식으로 응답해주세요:
{{
  "blocks": [
    {{
      "category": "카테고리명",
      "content": "블록 내용",
      "keywords": ["키워드1", "키워드2"]
    }}
  ]
}}
"""


def get_project_block_extraction_prompt() -> PromptTemplate:
    """프로젝트 블록 추출 프롬프트 반환"""
    return PromptTemplate(
        input_variables=["project_info"],
        template=BLOCK_EXTRACTION_FROM_PROJECT_PROMPT
    )


def get_cover_letter_block_extraction_prompt() -> PromptTemplate:
    """자기소개서 블록 추출 프롬프트 반환"""
    return PromptTemplate(
        input_variables=["question", "essay"],
        template=BLOCK_EXTRACTION_FROM_COVER_LETTER_PROMPT
    )
