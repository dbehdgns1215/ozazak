"""자기소개서 수정을 위한 LangChain Chain"""
import logging
from typing import Optional, AsyncGenerator, Dict, Any
from langchain_core.output_parsers import StrOutputParser

from src.adapters.outbound.tools.validator import CharacterCountValidator
from ..prompts.refinement_prompt import get_refinement_prompt

logger = logging.getLogger(__name__)


class RefinementChain:
    """자기소개서 수정(재생성) Chain
    
    사용자 피드백을 반영하여 자기소개서를 재작성합니다.
    글자 수 검증 및 자동 재작성 기능을 포함합니다.
    """
    
    def __init__(self, llm):
        self.llm = llm
        self.prompt = get_refinement_prompt()
        self.output_parser = StrOutputParser()
    
    async def generate_with_validation(
        self,
        question: str,
        original_content: str,
        feedback: str,
        company_name: Optional[str] = None,
        position: Optional[str] = None,
        char_limit: int = 800,
        max_retries: int = 3,
        on_status: Optional[Any] = None
    ) -> Dict:
        """수정된 자기소개서 생성 (검증 및 자동 재작성 포함)"""
        
        company_name = company_name or "지원 기업"
        position = position or "지원 직무"
        
        chain = self.prompt | self.llm | self.output_parser
        validator = CharacterCountValidator()
        
        current_feedback = feedback
        last_result = ""
        
        # 최적 결과 추적 (글자수 차이가 가장 적은 결과)
        best_result = ""
        best_diff = float('inf')
        
        for attempt in range(max_retries):
            try:
                # Status: Generating
                if on_status:
                   await on_status({
                       "status": "generating",
                       "message": f"수정 중... (시도 {attempt + 1}/{max_retries})",
                       "attempt": attempt + 1,
                       "max_retries": max_retries
                   })
                
                # API 호출
                result = await chain.ainvoke({
                    "company_name": company_name,
                    "position": position,
                    "question": question,
                    "original_content": original_content,
                    "feedback": current_feedback,
                    "char_limit": char_limit
                })
                
                current_result = result.strip()
                last_result = current_result
                
                # 최적 결과 갱신 로직
                current_len = len(current_result)
                current_diff = abs(current_len - char_limit)
                
                if current_diff < best_diff:
                    best_diff = current_diff
                    best_result = current_result
                    logger.info(f"New best result found: length={current_len} (diff={current_diff})")
                
                if on_status:
                   await on_status({
                       "status": "validating",
                       "message": "글자 수 검증 중...",
                       "attempt": attempt + 1,
                       "max_retries": max_retries
                   })
                   
                # 글자 수 검증
                validation = validator.run(current_result, char_limit)
                
                if validation["valid"]:
                    if attempt > 0:
                        logger.info(f"Refined text passed validation on attempt {attempt + 1}")
                    return {"content": current_result, "validation": validation}
                
                # 검증 실패 시 로그 출력 및 재시도 준비
                logger.warning(
                    f"Validation failed (Attempt {attempt + 1}/{max_retries}): {validation['message']}"
                )
                
                if attempt < max_retries - 1:
                    if on_status:
                        await on_status({
                            "status": "retry",
                            "message": f"재시도 중: {validation['message']}",
                            "attempt": attempt + 1,
                            "max_retries": max_retries
                        })
                        
                    # 피드백 강화
                    current_feedback = (
                        f"{feedback}\n\n"
                        f"### 🚨 긴급 수정 요청 (반드시 준수)\n"
                        f"이전 수정 결과가 **글자 수 검증에 실패**했습니다: {validation['message']}\n"
                        f"**반드시 글자 수 제한({char_limit}자)을 준수하여 다시 작성해주세요.**"
                    )
            
            except Exception as e:
                logger.error(f"Error during refinement (Attempt {attempt + 1}): {e}")
                if attempt == max_retries - 1:
                    pass # 루프 종료 후 best_result 반환 시도
        
        logger.warning(f"Max retries reached. Returning best result (diff={best_diff}) despite validation failure.")
        return {
            "content": best_result if best_result else last_result, 
            "validation": {"valid": False, "message": f"Max retries reached. Closest result selected ({len(best_result)} chars)"}
        }
