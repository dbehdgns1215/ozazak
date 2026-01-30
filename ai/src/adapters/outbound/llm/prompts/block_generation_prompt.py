"""블록 생성용 프롬프트 템플릿"""
from langchain_core.prompts import PromptTemplate


# 백엔드와 동일한 카테고리 (15개)
BLOCK_CATEGORIES = """
   - 성장과정, 가치관 (code: 0)
   - 성격의 장점 (code: 1)
   - 성격의 단점 및 극복 (code: 2)
   - 팀워크, 협업 (code: 3)
   - 갈등 해결 (code: 4)
   - 리더십, 주도성 (code: 5)
   - 의사소통 능력 (code: 6)
   - 기술적 문제 해결 (code: 7)
   - 성능 최적화, 개선 (code: 8)
   - 신기술 습득, 학습 능력 (code: 9)
   - 설계 및 아키텍처 (code: 10)
   - 도전, 실패 극복 (code: 11)
   - 지원 동기 (code: 12)
   - 입사 후 포부 (code: 13)
   - 관심 분야, 트렌드 분석 (code: 14)
"""

# 프로젝트로부터 블록 추출 프롬프트
BLOCK_EXTRACTION_FROM_PROJECT_PROMPT = f"""당신은 자기소개서 작성을 돕는 전문 컨설턴트입니다.
주어진 프로젝트 정보를 분석하여 자기소개서 작성에 활용할 수 있는 블록들을 추출해주세요.

프로젝트 정보:
{{project_info}}

추출 규칙:
1. 각 블록은 재사용 가능한 독립적인 경험/성과 단위여야 합니다
2. 블록은 반드시 다음 카테고리 중 하나로 분류해야 합니다 (정확한 한글명 사용):
{BLOCK_CATEGORIES}
3. 각 블록은 구체적이고 정량적인 내용을 포함해야 합니다
4. 한 블록은 2-4문장으로 구성됩니다
5. category 필드에는 위의 카테고리명 중 하나를 정확히 사용하세요 (예: "팀워크, 협업")

다음 JSON 형식으로 응답해주세요:
{{{{
  "blocks": [
    {{{{
      "category": "카테고리명",
      "content": "블록 내용",
      "keywords": ["키워드1", "키워드2"]
    }}}}
  ]
}}}}
"""

# 자기소개서로부터 블록 추출 프롬프트
BLOCK_EXTRACTION_FROM_COVER_LETTER_PROMPT = f"""당신은 자기소개서 작성을 돕는 전문 컨설턴트입니다.
주어진 자기소개서를 분석하여 재사용 가능한 블록들을 추출해주세요.

자기소개서 내용:
문항: {{question}}
답변: {{essay}}

추출 규칙:
1. 각 블록은 재사용 가능한 독립적인 경험/성과 단위여야 합니다
2. 블록은 반드시 다음 카테고리 중 하나로 분류해야 합니다 (정확한 한글명 사용):
{BLOCK_CATEGORIES}
3. 각 블록은 구체적이고 정량적인 내용을 포함해야 합니다
4. 한 블록은 2-4문장으로 구성됩니다
5. category 필드에는 위의 카테고리명 중 하나를 정확히 사용하세요 (예: "리더십, 주도성")

다음 JSON 형식으로 응답해주세요:
{{{{
  "blocks": [
    {{{{
      "category": "카테고리명",
      "content": "블록 내용",
      "keywords": ["키워드1", "키워드2"]
    }}}}
  ]
}}}}
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

