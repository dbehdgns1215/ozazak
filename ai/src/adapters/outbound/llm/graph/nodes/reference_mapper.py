import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.language_models import BaseChatModel

from ..state import PipelineState

class ReferenceMapperNode:
    """참고 자소서를 분석하여 각 문항별 활용 가이드를 생성하는 노드"""
    
    def __init__(self, llm: BaseChatModel):
        self.llm = llm
        self.parser = JsonOutputParser()
        
    async def __call__(self, state: PipelineState) -> dict:
        reference_letter = state.get("reference_letter")
        questions = state.get("questions")
        
        # 참고 자소서가 없으면 빈 맵핑 반환
        if not reference_letter or not reference_letter.strip():
            return {"reference_mapping": {f"Q{i+1}": {"usable_content": "없음", "usage_hint": "없음"} for i in range(len(questions))}}
            
        prompt = ChatPromptTemplate.from_template("""
당신은 자기소개서 컨설턴트입니다.

## 참고 자기소개서
{reference_letter}

## 작성해야 할 문항
{questions_str}

## 지시사항
각 문항에 활용할 수 있는 참고 자소서의 내용을 매핑해주세요.
- [필수] 참고 자소서의 내용을 **반드시** 활용해야 합니다.
- 단순 참고가 아니라, 참고 자소서의 소재와 스토리를 기반으로 작성해야 함을 명심하세요.
- 같은 내용이 여러 문항에 활용되어도 됩니다.
- 해당 문항에 활용할 만한 내용이 없으면 "없음"으로 표시하세요.

## 출력 형식 (JSON)
{{
    "Q1": {{
        "question": "문항 내용",
        "usable_content": "활용 가능한 내용 요약",
        "usage_hint": "이렇게 변형해서 활용하세요"
    }},
    "Q2": {{ ... }},
    ...
}}
""")
        
        questions_formatted = "\n".join([f"Q{i+1}: {q}" for i, q in enumerate(questions)])
        
        chain = prompt | self.llm | self.parser
        
        try:
            result = await chain.ainvoke({
                "reference_letter": reference_letter,
                "questions_str": questions_formatted
            })
            return {"reference_mapping": result}
        except Exception as e:
            print(f"Reference mapping failed: {e}")
            # 실패 시 기본값 반환
            return {"reference_mapping": {f"Q{i+1}": {"usable_content": "없음", "usage_hint": "분석 실패, 경험 블록 위주로 작성하세요."} for i in range(len(questions))}}
