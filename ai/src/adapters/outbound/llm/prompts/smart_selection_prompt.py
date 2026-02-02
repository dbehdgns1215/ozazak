"""스마트 블록/자소서 선택용 프롬프트 템플릿"""
from langchain_core.prompts import PromptTemplate


# 스마트 선택 + 자기소개서 생성 통합 프롬프트
SMART_GENERATION_PROMPT = """당신은 자기소개서 작성을 돕는 전문 컨설턴트입니다.
주어진 문항에 가장 적합한 경험과 자료를 선택하고, 이를 바탕으로 자기소개서를 작성해주세요.

## 기본 정보
기업명: {company_name}
직무명: {position}
문항: {question}
글자수 제한: {char_limit}자

## 채용공고 분석 결과
{job_analysis_section}

## 사용 가능한 경험 블록
{blocks_section}

## 참고 가능한 기존 자기소개서
{cover_letters_section}

---

## 작성 지침

### 1단계: 자료 선택 (반드시 수행)
위 문항에 가장 적합한 자료를 선택하세요:
- 경험 블록: 문항과 관련된 핵심 경험 2~3개 선택
- 기존 자소서: 문항 유형이 비슷하거나 문체/구조를 참고할 수 있는 것 1~2개 선택

### 2단계: 자기소개서 작성
선택한 자료를 바탕으로 자기소개서를 작성하세요.

작성 구조:
1. 요약 (Hook): 핵심 역량과 직무 적합성을 간결하게 제시
2. 배경 (Background): 경험이 발생하게 된 배경과 상황
3. 역할 (Role): 나의 구체적인 역할과 책임
4. 행동 (Action): 문제 해결을 위한 구체적인 대처
5. 결과 (Result): 수치와 피드백을 포함한 구체적인 결과
6. 연결 (Connection): 경험이 지원 직무에 어떻게 연결되는지

작성 가이드라인:
✅ 해야 할 것:
- 직무 적합성 중심으로 경험과 직무를 자연스럽게 연결
- 스토리텔링 형식으로 작성
- 구체적인 수치와 사실 포함
- 채용공고의 핵심 키워드를 자연스럽게 포함
- 적절한 문단 나눔

❌ 피해야 할 것:
- 형식적이고 딱딱한 문체
- 뻔한 시작 (예: "저는 ~입니다")
- 마크다운 포맷팅 절대 금지 (**, ##, -, * 등)
- 글머리 기호나 번호 매기기 금지
- 제목이나 소제목 형식 금지

---

## 응답 형식 (반드시 아래 형식으로)

[선택된 자료]
- 블록: (선택한 블록 번호들, 예: 블록1, 블록3)
- 참고 자소서: (선택한 자소서 번호들, 예: 자소서2)

[자기소개서]
(여기에 자기소개서 본문 작성)
"""


def get_smart_generation_prompt() -> PromptTemplate:
    """스마트 선택 + 생성 통합 프롬프트 반환"""
    return PromptTemplate(
        input_variables=[
            "company_name",
            "position",
            "question",
            "char_limit",
            "job_analysis_section",
            "blocks_section",
            "cover_letters_section"
        ],
        template=SMART_GENERATION_PROMPT
    )


def format_blocks_section(blocks: list) -> str:
    """블록 리스트를 프롬프트용 텍스트로 포맷팅"""
    if not blocks:
        return "사용 가능한 블록이 없습니다."
    
    formatted = []
    for i, block in enumerate(blocks, 1):
        if isinstance(block, dict):
            category = block.get("category", "기타")
            content = block.get("content", str(block))
            keywords = block.get("keywords", [])
            keyword_str = f" (키워드: {', '.join(keywords)})" if keywords else ""
            formatted.append(f"[블록{i}] [{category}]{keyword_str}\n{content}")
        else:
            formatted.append(f"[블록{i}]\n{block}")
    
    return "\n\n".join(formatted)


def format_cover_letters_section(cover_letters: list) -> str:
    """기존 자소서 리스트를 프롬프트용 텍스트로 포맷팅"""
    if not cover_letters:
        return "참고 가능한 기존 자기소개서가 없습니다."
    
    formatted = []
    for i, cl in enumerate(cover_letters, 1):
        if isinstance(cl, dict):
            company = cl.get("company", "")
            question = cl.get("question", "")
            content = cl.get("content", str(cl))
            header = f"[자소서{i}] {company} - {question}" if company or question else f"[자소서{i}]"
            # 너무 길면 앞부분만
            if len(content) > 500:
                content = content[:500] + "..."
            formatted.append(f"{header}\n{content}")
        else:
            formatted.append(f"[자소서{i}]\n{cl}")
    
    return "\n\n".join(formatted)
