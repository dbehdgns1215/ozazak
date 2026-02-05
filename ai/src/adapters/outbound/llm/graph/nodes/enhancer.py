from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.language_models import BaseChatModel

from ..state import QuestionState

class EnhancerNode:
    """글자수 조정 및 내용 보강 노드"""
    
    def __init__(self, llm: BaseChatModel):
        self.llm = llm
        self.output_parser = StrOutputParser()
        
    async def __call__(self, state: QuestionState) -> dict:
        content = state["current_content"]
        check_result = state.get("check_result", "pass")
        char_limit = state["char_limit"]
        
        if check_result == "pass":
            return {"current_content": content}
            
        prompt_template = ""
        if check_result == "too_long":
            prompt_template = """
다음 자기소개서 내용을 요약하여 글자수를 줄여주세요.

## 원문
{content}

## 목표
현재 {current_len}자 → {target_len}자 이내로 축소 (핵심 내용은 유지)

## 규칙
- 불필요한 수식어나 반복을 제거하세요.
- 핵심 성과와 경험은 유지하세요.
- 문장을 간결하게 다듬으세요.
"""
        else: # too_short
            prompt_template = """
다음 자기소개서 내용을 보강하여 글자수를 늘려주세요.

## 원문
{content}

## 목표
현재 {current_len}자 → {target_len}자 이상으로 확장

## 규칙
- 경험의 구체적인 상황(Context)과 행동(Action)을 더 자세히 묘사하세요.
- 성과(Result)의 의미나 배운 점을 덧붙이세요.
- 전체적인 흐름을 유지하며 살을 붙이세요.
"""

        prompt = ChatPromptTemplate.from_template(prompt_template)
        chain = prompt | self.llm | self.output_parser
        
        target_len = int(char_limit * 0.95)
        
        try:
            refined_content = await chain.ainvoke({
                "content": content,
                "current_len": len(content),
                "target_len": target_len
            })
            
            return {
                "current_content": refined_content,
                "char_count": len(refined_content),
                "attempt": state["attempt"] + 1
            }
        except Exception as e:
            print(f"Enhancement failed: {e}")
            return {"attempt": state["attempt"] + 1}
