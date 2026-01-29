"""자기소개서 생성을 위한 LangChain Chain (고도화 버전)"""
from typing import List, Optional, Dict
import logging
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from ...tools.validator import CharacterCountValidator

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
    
    async def generate(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]] = None,
        job_analysis: Optional[Dict] = None,
        char_limit: Optional[int] = None,
        company_name: Optional[str] = None,
        position: Optional[str] = None,
        max_retries: int = 3
    ) -> str:
        """자기소개서 생성 (고도화 버전) - 자동 재시도 포함"""
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
                result = await chain.ainvoke({
                    "question": current_question,
                    "blocks": formatted_blocks,
                    "reference_section": reference_section,
                    "company_info": company_info,
                    "char_limit": effective_char_limit,
                    "job_analysis_section": job_analysis_section
                })
                
                last_result = result.strip()
                
                # 글자 수 검증
                validation = validator.run(last_result, effective_char_limit)
                
                if validation["valid"]:
                    if attempt > 0:
                        logger.info(f"Generated text passed validation on attempt {attempt + 1}")
                    return last_result
                
                # 검증 실패 시 로그 출력 및 재시도 준비
                logger.warning(
                    f"Validation failed (Attempt {attempt + 1}/{max_retries}): {validation['message']}"
                )
                
                if attempt < max_retries - 1:
                    # 다음 시도를 위해 질문에 피드백 추가
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
        return last_result if last_result else "Generation failed."
    
    def _format_blocks(self, blocks: List[str]) -> str:
        if not blocks:
            return "사용 가능한 블록이 없습니다."
        
        formatted = []
        for i, block in enumerate(blocks, 1):
            formatted.append(f"[블록 {i}]\n{block}")
        
        return "\n\n".join(formatted)

    async def stream(
        self,
        question: str,
        blocks: List[str],
        references: Optional[List[str]] = None,
        job_analysis: Optional[Dict] = None,
        char_limit: Optional[int] = None,
        company_name: Optional[str] = None,
        position: Optional[str] = None
    ):
        """자기소개서 생성 스트리밍 (고도화 버전)"""
        formatted_blocks = self._format_blocks(blocks)
        reference_section = format_reference_section(references or [])
        company_info = format_company_info(company_name, position)
        job_analysis_section = format_job_analysis_section(job_analysis)
        effective_char_limit = char_limit or 800
        
        chain = self.prompt | self.llm | self.output_parser
        validator = CharacterCountValidator()
        
        # Token Callback (임시 생성, 실제로는 Adapter 레벨에서 관리하는 것이 좋음/싱글톤 등)
        from ..callbacks.token_usage_callback import TokenUsageCallbackHandler
        # token_handler = TokenUsageCallbackHandler()
        # chain = self.prompt | self.llm.with_config(callbacks=[token_handler]) | self.output_parser
        # TODO: Callback 통합 (현재는 구조상 Adapter에서 주입받거나 해야 함. 우선 로직만 구현)
        
        current_question = question
        max_retries = 3
        
        for attempt in range(max_retries):
            full_response = ""
            async for chunk in chain.astream({
                "question": current_question,
                "blocks": formatted_blocks,
                "reference_section": reference_section,
                "company_info": company_info,
                "char_limit": effective_char_limit,
                "job_analysis_section": job_analysis_section
            }):
                full_response += chunk
                yield chunk
            
            # 글자 수 검증
            validation = validator.run(full_response, effective_char_limit)
            
            if validation["valid"]:
                if attempt > 0:
                    logger.info(f"Generated text passed validation on attempt {attempt + 1}")
                break
            
            # 검증 실패 시 로그 출력 및 사용자 알림
            logger.warning(
                f"Validation failed (Attempt {attempt + 1}/{max_retries}): {validation['message']}"
            )
            
            if attempt < max_retries - 1:
                # 재시도 알림
                yield f"\n\n[SYSTEM: 글자 수 검증 실패 ({validation['message']}). 피드백을 강화하여 {attempt + 2}번째 시도를 진행합니다...]\n\n"
                
                # 프롬프트 강화 (강력한 피드백)
                current_question = (
                    f"{question}\n\n"
                    f"### 🚨 긴급 수정 요청 (반드시 준수)\n"
                    f"이전 생성 결과가 **글자 수 검증에 실패**했습니다: {validation['message']}\n"
                    f"**반드시 글자 수 제한({effective_char_limit}자)을 준수하여 다시 작성해주세요.**\n"
                    f"(현재 내용이 너무 짧거나 깁니다. 분량을 조절해주세요.)"
                )
            else:
                yield f"\n\n[SYSTEM: 최대 재시도 횟수({max_retries}) 초과. 마지막 생성을 유지합니다.]"
