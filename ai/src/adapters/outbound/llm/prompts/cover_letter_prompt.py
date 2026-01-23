"""자기소개서 생성용 프롬프트 템플릿 (고도화 버전)"""
from typing import Optional, Dict, List
from langchain_core.prompts import PromptTemplate


# 고도화된 자기소개서 생성 프롬프트
COVER_LETTER_GENERATION_PROMPT = """당신은 자기소개서 작성을 돕는 전문 컨설턴트입니다.
자연스러우면서도 최근 채용 트렌드에 맞는 자기소개서를 작성해주세요.

## 기본 정보
문항: {question}
{company_info}
글자수 제한: {char_limit}자

## 채용공고 분석 결과
{job_analysis_section}

## 활용 가능한 경험/블록
{blocks}

{reference_section}

## 작성 구조 (자연스러운 문단 흐름으로 작성)

1. **요약 (Hook)**: 억지스럽지 않은 후킹으로 시작. 핵심 역량과 직무 적합성을 간결하게 제시

2. **배경 (Background)**: 경험이 발생하게 된 배경과 상황 설명

3. **역할 (Role)**: 해당 경험에서 나의 구체적인 역할과 책임

4. **행동 (Action)**: 문제 상황과 이를 해결하기 위한 나의 구체적인 대처 방법

5. **결과 (Result)**: 측정 가능한 수치와 피드백을 포함한 구체적인 결과

6. **연결 (Connection)**: 경험이 지원 직무에 어떻게 연결되는지, 입사 후 어떻게 기여할 수 있는지

## 작성 가이드라인

✅ 해야 할 것:
- 직무 적합성을 중심으로, 경험과 직무를 자연스럽게 연결
- 나열식이 아닌, 스토리텔링 형식으로 작성
- 구체적인 수치와 사실 포함 (예: 30% 향상, 2주 단축 등)
- 채용공고의 핵심 키워드를 자연스럽게 포함
- 진정성 있고 현실적인 어조 사용
- 적절한 문단 나눔으로 가독성 확보

❌ 피해야 할 것:
- 형식적이고 딱딱한 문체
- 뻔한 시작 (예: "저는 ~입니다")
- 근거 없는 추상적 표현
- 과도한 미사여구

자기소개서를 작성해주세요:
"""

# 기업 정보 섹션 템플릿
COMPANY_INFO_TEMPLATE = """기업명: {company_name}
직무명: {position}"""

# 채용공고 분석 결과 섹션 템플릿
JOB_ANALYSIS_SECTION_TEMPLATE = """
**인재상**: {ideal_candidate}
**핵심 업무**: {key_responsibilities}
**우대사항**: {requirements}
**핵심역량**: {core_competencies}
**강조할 키워드**: {keywords}
"""

REFERENCE_SECTION_TEMPLATE = """## 참고 자기소개서 (문체와 구조 참고용)
{references}
"""


def get_cover_letter_generation_prompt() -> PromptTemplate:
    """자기소개서 생성 프롬프트 반환"""
    return PromptTemplate(
        input_variables=[
            "question", 
            "blocks", 
            "reference_section", 
            "company_info",
            "char_limit",
            "job_analysis_section"
        ],
        template=COVER_LETTER_GENERATION_PROMPT
    )


def format_company_info(company_name: Optional[str], position: Optional[str]) -> str:
    """기업 정보 섹션 포맷팅"""
    if not company_name and not position:
        return ""
    return COMPANY_INFO_TEMPLATE.format(
        company_name=company_name or "미지정",
        position=position or "미지정"
    )


def format_job_analysis_section(job_analysis: Optional[Dict]) -> str:
    """채용공고 분석 결과 섹션 포맷팅"""
    if not job_analysis:
        return "채용공고 분석 정보 없음 - 일반적인 자기소개서로 작성"
    
    ideal = job_analysis.get("ideal_candidate", {})
    ideal_text = ", ".join(
        ideal.get("characteristics", []) + ideal.get("core_values", [])
    ) or "정보 없음"
    
    resp = job_analysis.get("key_responsibilities", {})
    resp_text = ", ".join(resp.get("main_tasks", [])) or "정보 없음"
    
    reqs = job_analysis.get("requirements", {})
    reqs_text = ", ".join(
        reqs.get("must_have", []) + reqs.get("nice_to_have", [])
    ) or "정보 없음"
    
    comp = job_analysis.get("core_competencies", {})
    comp_text = ", ".join(
        comp.get("technical", []) + comp.get("soft_skills", [])
    ) or "정보 없음"
    
    keywords = ", ".join(job_analysis.get("keywords", [])) or "정보 없음"
    
    return JOB_ANALYSIS_SECTION_TEMPLATE.format(
        ideal_candidate=ideal_text,
        key_responsibilities=resp_text,
        requirements=reqs_text,
        core_competencies=comp_text,
        keywords=keywords
    )


def format_reference_section(references: List[str]) -> str:
    """참고 자료 섹션 포맷팅"""
    if not references:
        return ""
    
    formatted_refs = "\n\n".join([
        f"[참고 {i+1}]\n{ref}" 
        for i, ref in enumerate(references)
    ])
    
    return REFERENCE_SECTION_TEMPLATE.format(references=formatted_refs)
