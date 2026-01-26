"""자기소개서 수정을 위한 LangChain Chain"""
import logging
from typing import Optional, AsyncGenerator
from langchain_core.output_parsers import StrOutputParser

from ...tools.validator import CharacterCountValidator
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
    
    async def stream(
        self,
        question: str,
        original_content: str,
        feedback: str,
        company_name: Optional[str] = None,
        position: Optional[str] = None,
        char_limit: int = 800
    ) -> AsyncGenerator[str, None]:
        """수정된 자기소개서 스트리밍 생성"""
        
        # None 처리
        company_name = company_name or "지원 기업"
        position = position or "지원 직무"
        
        chain = self.prompt | self.llm | self.output_parser
        validator = CharacterCountValidator()
        
        current_feedback = feedback
        max_retries = 3
        
        for attempt in range(max_retries):
            # 스트리밍 생성
            full_response = ""
            async for chunk in chain.astream({
                "company_name": company_name,
                "position": position,
                "question": question,
                "original_content": original_content,
                "feedback": current_feedback,
                "char_limit": char_limit
            }):
                full_response += chunk
                yield chunk
            
            # 글자 수 검증
            validation = validator.run(full_response, char_limit)
            
            if validation["valid"]:
                if attempt > 0:
                    logger.info(f"Refined text passed validation on attempt {attempt + 1}")
                break
            
            # 검증 실패 시 로그 출력 및 사용자 알림
            logger.warning(
                f"Validation failed (Attempt {attempt + 1}/{max_retries}): {validation['message']}"
            )
            
            if attempt < max_retries - 1:
                # 재시도 알림 이벤트 (구분자)
                yield f"\n\n[SYSTEM: 글자 수 검증 실패 ({validation['message']}). 피드백을 강화하여 {attempt + 2}번째 시도를 진행합니다...]\n\n"
                
                # 피드백 강화
                current_feedback = (
                    f"{feedback}\n\n"
                    f"### 🚨 긴급 수정 요청 (반드시 준수)\n"
                    f"이전 수정 결과(Attempt {attempt + 1})가 **글자 수 검증에 실패**했습니다: {validation['message']}\n"
                    f"**반드시 글자 수 제한({char_limit}자)을 준수하여 다시 작성해주세요.**\n"
                    f"(현재 내용이 너무 짧거나 깁니다. 분량을 조절해주세요.)"
                )
            else:
                yield f"\n\n[SYSTEM: 최대 재시도 횟수({max_retries}) 초과. 마지막 생성을 유지합니다.]"
            
    async def generate_validated(
        self,
        question: str,
        original_content: str,
        feedback: str,
        company_name: Optional[str] = None,
        position: Optional[str] = None,
        char_limit: int = 800,
        max_retries: int = 3
    ) -> str:
        """수정된 자기소개서 생성 (검증 및 자동 재작성 포함)"""
        
        company_name = company_name or "지원 기업"
        position = position or "지원 직무"
        
        chain = self.prompt | self.llm | self.output_parser
        validator = CharacterCountValidator()
        
        current_feedback = feedback
        last_result = ""
        
        for attempt in range(max_retries):
            try:
                # API 호출
                result = await chain.ainvoke({
                    "company_name": company_name,
                    "position": position,
                    "question": question,
                    "original_content": original_content,
                    "feedback": current_feedback,
                    "char_limit": char_limit
                })
                
                last_result = result.strip()
                
                # 글자 수 검증
                validation = validator.run(last_result, char_limit)
                
                if validation["valid"]:
                    if attempt > 0:
                        logger.info(f"Refined text passed validation on attempt {attempt + 1}")
                    return last_result
                
                # 검증 실패 시 로그 출력 및 재시도 준비
                logger.warning(
                    f"Validation failed (Attempt {attempt + 1}/{max_retries}): {validation['message']}"
                )
                
                if attempt < max_retries - 1:
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
                    raise e
        
        logger.warning("Max retries reached. Returning last result despite validation failure.")
        return last_result if last_result else "Refinement failed."
