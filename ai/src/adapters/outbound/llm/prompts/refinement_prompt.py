"""자기소개서 수정을 위한 프롬프트 템플릿"""
from langchain_core.prompts import PromptTemplate


# 자기소개서 수정(재생성) 프롬프트
REFINEMENT_PROMPT = """당신은 자기소개서 첨삭 전문 컨설턴트입니다.
사용자가 작성한 자기소개서를 피드백에 맞춰 수정해주세요.

## 기본 정보
기업명: {company_name}
직무명: {position}
문항: {question}
글자수 제한: {char_limit}자

## 기존 자기소개서
{original_content}

## 사용자 피드백 (수정 요청사항)
"{feedback}"

---

## 수정 지침
1. **[중요] 사용자의 피드백을 최우선으로 반영하세요.** 기존 내용의 스타일이나 형식이 피드백과 충돌하면, 무조건 피드백을 따르세요.
    - 예: 피드백이 "-해요체 사용"을 요청하면, 기존이 "-다"체라도 전면 수정해야 합니다.
2. 기존 내용의 핵심 사실(경험, 성과 등)은 유지하되, 표현 방식은 자유롭게 변경하세요.
3. 글자 수 제한({char_limit}자)을 준수하세요.
4. 마크다운 포맷팅(**, ##, -, * 등)을 사용하지 마세요. (Plain Text)
5. 제목이나 소제목을 붙이지 말고 본문만 작성하세요.

## 수정된 자기소개서 작성
(여기에 수정된 자기소개서 본문을 작성)
"""


def get_refinement_prompt() -> PromptTemplate:
    """자기소개서 수정 프롬프트 반환"""
    return PromptTemplate(
        input_variables=[
            "company_name",
            "position",
            "question",
            "char_limit",
            "original_content",
            "feedback"
        ],
        template=REFINEMENT_PROMPT
    )
