"""자기소개서 생성을 위한 LangChain Chain (고도화 버전)"""
from typing import List, Optional, Dict, Any
import logging
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from src.adapters.outbound.tools.validator import CharacterCountValidator

from ..prompts.cover_letter_prompt import (
    get_cover_letter_generation_prompt,
    format_reference_section,
    format_company_info,
    format_job_analysis_section
)

logger = logging.getLogger(__name__)


class CoverLetterGenerationChain:
    """자기소개서 생성 Chain - LangChain LCEL 방식 구현 (고도화 버전)"""
    
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm
        self.prompt = get_cover_letter_generation_prompt()
        self.output_parser = StrOutputParser()
    

    
    def _format_blocks(self, blocks: List[str]) -> str:
        if not blocks:
            return "사용 가능한 블록이 없습니다."
        
        formatted = []
        for i, block in enumerate(blocks, 1):
            formatted.append(f"[블록 {i}]\n{block}")
        
        return "\n\n".join(formatted)

    async def generate_with_validation(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]] = None,
        job_analysis: Optional[Dict] = None,
        char_limit: Optional[int] = None,
        company_name: Optional[str] = None,
        position: Optional[str] = None,
        user_prompt: Optional[str] = None,
        max_retries: int = 3,
        on_status: Optional[Any] = None
    ) -> Dict:
        """자기소개서 생성 (고도화 버전) - 검증 포함, 비스트리밍"""
        formatted_blocks = self._format_blocks(blocks)
        reference_section = format_reference_section(references or [])
        company_info = format_company_info(company_name, position)
        job_analysis_section = format_job_analysis_section(job_analysis)
        effective_char_limit = char_limit or 800
        
        chain = self.prompt | self.llm | self.output_parser
        validator = CharacterCountValidator()
        
        current_question = question
        last_result = ""
        
        for attempt in range(max_retries):
            try:
                # Status: Generating
                if on_status:
                   await on_status({
                       "status": "generating",
                       "message": f"생성 중... (시도 {attempt + 1}/{max_retries})",
                       "attempt": attempt + 1,
                       "max_retries": max_retries
                   })
                   
                result = await chain.ainvoke({
                    "question": current_question,
                    "blocks": formatted_blocks,
                    "reference_section": reference_section,
                    "company_info": company_info,
                    "char_limit": effective_char_limit,
                    "job_analysis_section": job_analysis_section,
                    "user_prompt": user_prompt or ""  # 사용자 추가 지시사항
                })
                
                last_result = result.strip()
                
                # Status: Validating
                if on_status:
                   await on_status({
                       "status": "validating",
                       "message": "글자 수 검증 중...",
                       "attempt": attempt + 1,
                       "max_retries": max_retries
                   })
                   
                # 글자 수 검증
                validation = validator.run(last_result, effective_char_limit)
                
                if validation["valid"]:
                    if attempt > 0:
                        logger.info(f"Generated text passed validation on attempt {attempt + 1}")
                    return {"content": last_result, "validation": validation}
                
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
                    
                    # 다음 시도를 위해 질문에 피드백 추가 (강력한 피드백)
                    current_question = (
                        f"{question}\n\n"
                        f"### 🚨 긴급 수정 요청 (반드시 준수)\n"
                        f"이전 생성 결과가 **글자 수 검증에 실패**했습니다: {validation['message']}\n"
                        f"**반드시 글자 수 제한({effective_char_limit}자)을 준수하여 다시 작성해주세요.**"
                    )
            
            except Exception as e:
                logger.error(f"Error during generation (Attempt {attempt + 1}): {e}")
                if attempt == max_retries - 1:
                    raise e
        
        logger.warning("Max retries reached. Returning last result despite validation failure.")
        return {"content": last_result, "validation": {"valid": False, "message": "Max retries reached"}}
