"""채용공고 분석용 프롬프트 템플릿"""
from langchain_core.prompts import PromptTemplate


# 채용공고 분석 프롬프트
JOB_POSTING_ANALYSIS_PROMPT = """당신은 채용 전문가이자 HR 컨설턴트입니다.
주어진 채용공고를 분석하여 지원자가 자기소개서를 작성하는 데 필요한 핵심 정보를 추출해주세요.

기업명: {company_name}
직무명: {position}

채용공고 내용:
{job_posting}

{requirements_section}

다음 4가지 항목을 분석해주세요:

1. 인재상 (Ideal Candidate)
   - 기업이 추구하는 인재의 특성
   - 핵심 가치관 및 태도

2. 주요 업무 및 KPI (Key Responsibilities)
   - 해당 직무의 핵심 업무
   - 기대되는 성과 지표

3. 우대사항 및 필수지식 (Requirements)
   - 필수 자격요건
   - 우대 사항 (기술, 경험, 자격증 등)

4. 핵심역량 (Core Competencies)
   - 직무 수행에 필요한 역량
   - 기술적/비기술적 역량

반드시 아래 JSON 형식으로 응답해주세요:
```json
{{
    "company_name": "{company_name}",
    "position": "{position}",
    "ideal_candidate": {{
        "characteristics": ["특성1", "특성2", ...],
        "core_values": ["가치관1", "가치관2", ...]
    }},
    "key_responsibilities": {{
        "main_tasks": ["업무1", "업무2", ...],
        "kpis": ["KPI1", "KPI2", ...]
    }},
    "requirements": {{
        "must_have": ["필수사항1", "필수사항2", ...],
        "nice_to_have": ["우대사항1", "우대사항2", ...]
    }},
    "core_competencies": {{
        "technical": ["기술역량1", "기술역량2", ...],
        "soft_skills": ["소프트스킬1", "소프트스킬2", ...]
    }},
    "keywords": ["자소서에서 강조해야 할 키워드1", "키워드2", ...],
    "tips": ["자소서 작성 팁1", "팁2", ...]
}}
```
"""

REQUIREMENTS_SECTION_TEMPLATE = """
추가 우대사항:
{requirements}
"""


def get_job_posting_analysis_prompt() -> PromptTemplate:
    """채용공고 분석 프롬프트 반환"""
    return PromptTemplate(
        input_variables=["company_name", "position", "job_posting", "requirements_section"],
        template=JOB_POSTING_ANALYSIS_PROMPT
    )


def format_requirements_section(requirements: str | None) -> str:
    """우대사항 섹션 포맷팅"""
    if not requirements:
        return ""
    return REQUIREMENTS_SECTION_TEMPLATE.format(requirements=requirements)
