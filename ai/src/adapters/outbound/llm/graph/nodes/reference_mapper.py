import json
import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.language_models import BaseChatModel
import logging

from ..state import PipelineState

logger = logging.getLogger(__name__)

class ReferenceMapperNode:
    """참고 자소서를 분석하여 각 문항별 활용 가이드를 생성하는 노드"""
    
    def __init__(self, llm: BaseChatModel):
        self.llm = llm
        self.parser = JsonOutputParser()
        
    def _parse_sections(self, reference_letter: str) -> list[dict]:
        """참고 자소서를 [제목] 패턴으로 섹션 분리"""
        # [제목] 패턴으로 분리
        sections = re.split(r'\n(?=\[)', reference_letter)
        result = []
        for i, section in enumerate(sections):
            section = section.strip()
            if not section:
                continue
            # 제목 추출
            title_match = re.match(r'\[([^\]]+)\]', section)
            title = title_match.group(1) if title_match else f"Section {i+1}"
            result.append({"title": title, "content": section})
        return result
        
    def _clean_json_output(self, content: str) -> str:
        """Markdown 코드 블록 및 불필요한 공백 제거"""
        content = content.strip()
        if content.startswith("```"):
            # ```json ... ``` 형태 제거
            content = content.split("\n", 1)[1] if "\n" in content else content
            if content.endswith("```"):
                content = content.rsplit("```", 1)[0]
        return content.strip()

    async def __call__(self, state: PipelineState) -> dict:
        reference_letter = state.get("reference_letter")
        questions = state.get("questions")
        
        # 참고 자소서가 없으면 빈 맵핑 반환
        if not reference_letter or not reference_letter.strip():
            logger.info("[ReferenceMapper] No reference letter provided, returning empty mapping.")
            return {"reference_mapping": {f"Q{i+1}": {"usable_content": "없음", "usage_hint": "없음"} for i in range(len(questions))}}
        
        # 섹션 파싱
        sections = self._parse_sections(reference_letter)
        logger.info(f"[ReferenceMapper] Parsed {len(sections)} sections from reference letter.")
        
        # 섹션 목록 생성
        sections_str = "\n".join([f"- [{s['title']}]: {s['content'][:100]}..." for s in sections]) if sections else "섹션 구분 없음"
            
        prompt = ChatPromptTemplate.from_template("""
당신은 자기소개서 컨설턴트입니다.

## 참고 자기소개서 섹션 목록
{sections_str}

## 참고 자기소개서 전문
{reference_letter}

## 작성해야 할 문항
{questions_str}

## 지시사항
각 문항에 **가장 적합한 섹션**을 매핑해주세요.
- [중요] 각 문항에는 **서로 다른 섹션**을 우선 배정하세요 (중복 허용하되 다양성 우선).
- 해당 문항에 활용할 만한 내용이 없으면 "없음"으로 표시하세요.
- **반드시** 마크다운(```json) 없이 **순수 JSON 텍스트**만 출력하세요.

## 출력 형식 (JSON)
{{
    "Q1": {{
        "matched_section": "[섹션 제목]",
        "usable_content": "해당 섹션에서 활용 가능한 내용 요약",
        "usage_hint": "이렇게 변형해서 활용하세요"
    }},
    "Q2": {{ ... }}
}}
""")
        
        questions_formatted = "\n".join([f"Q{i+1}: {q}" for i, q in enumerate(questions)])
        
        chain = prompt | self.llm | StrOutputParser()
        
        try:
            raw_result = await chain.ainvoke({
                "reference_letter": reference_letter,
                "sections_str": sections_str,
                "questions_str": questions_formatted
            })
            
            # JSON 파싱 전처리 (마크다운 제거)
            cleaned_result = self._clean_json_output(raw_result)
            parsed_result = self.parser.parse(cleaned_result)
            
            logger.info(f"[ReferenceMapper] Mapping result: {list(parsed_result.keys())}")
            
            return {"reference_mapping": parsed_result}
        except Exception as e:
            logger.error(f"[ReferenceMapper] Reference mapping failed: {e}")
            # 실패 시 기본값 반환
            return {"reference_mapping": {f"Q{i+1}": {"usable_content": "없음", "usage_hint": "없음"} for i in range(len(questions))}}
