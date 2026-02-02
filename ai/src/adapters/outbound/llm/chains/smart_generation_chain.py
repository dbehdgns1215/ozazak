"""스마트 선택 + 자기소개서 생성 Chain"""
import re
import logging
from typing import List, Dict, Optional, AsyncGenerator, Any
from langchain_core.output_parsers import StrOutputParser

from src.adapters.outbound.tools.validator import CharacterCountValidator

from ..prompts.smart_selection_prompt import (
    get_smart_generation_prompt,
    format_blocks_section,
    format_cover_letters_section
)
from ..prompts.cover_letter_prompt import format_job_analysis_section

logger = logging.getLogger(__name__)


class SmartGenerationChain:
    """스마트 선택 + 자기소개서 생성 Chain
    
    문항에 가장 적합한 블록/자소서를 LLM이 선택하고,
    선택된 자료를 바탕으로 자기소개서를 생성합니다.
    """
    
    def __init__(self, llm):
        self.llm = llm
        self.prompt = get_smart_generation_prompt()
        self.output_parser = StrOutputParser()
    
    async def generate_with_validation(
        self,
        question: str,
        company_name: str,
        position: str,
        blocks: List[Dict],
        cover_letters: List[Dict],
        job_analysis: Optional[Dict] = None,
        char_limit: int = 800,
        max_retries: int = 3,
        on_status: Optional[Any] = None
    ) -> Dict:
        """
        스마트 선택 + 자기소개서 생성 (자동 재시도 포함)
        """
        blocks_section = format_blocks_section(blocks)
        cover_letters_section = format_cover_letters_section(cover_letters)
        job_analysis_section = format_job_analysis_section(job_analysis)
        
        chain = self.prompt | self.llm | self.output_parser
        validator = CharacterCountValidator()
        
        current_question = question
        last_result = None
        
        for attempt in range(max_retries):
            try:
                # API 호출
                if on_status:
                   await on_status({
                       "status": "generating",
                       "message": f"생성 중... (시도 {attempt + 1}/{max_retries})",
                       "attempt": attempt + 1,
                       "max_retries": max_retries
                   })
                
                response = await chain.ainvoke({
                    "company_name": company_name,
                    "position": position,
                    "question": current_question,
                    "char_limit": char_limit,
                    "job_analysis_section": job_analysis_section,
                    "blocks_section": blocks_section,
                    "cover_letters_section": cover_letters_section
                })
                
                # 응답 파싱
                last_result = self._parse_response(response)
                content = last_result.get("content", "")
                
                if on_status:
                   await on_status({
                       "status": "validating",
                       "message": "글자 수 검증 중...",
                       "attempt": attempt + 1,
                       "max_retries": max_retries
                   })
                   
                # 글자 수 검증
                validation = validator.run(content, char_limit)
                
                if validation["valid"]:
                    if attempt > 0:
                        logger.info(f"Generated text passed validation on attempt {attempt + 1}")
                    last_result["validation"] = validation
                    return last_result
                
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
                        
                    # 다음 시도를 위해 질문에 피드백 추가
                    current_question = (
                        f"{question}\n\n"
                        f"### 🚨 긴급 수정 요청 (반드시 준수)\n"
                        f"이전 생성 결과가 **글자 수 검증에 실패**했습니다: {validation['message']}\n"
                        f"**반드시 글자 수 제한({char_limit}자)을 준수하여 다시 작성해주세요.**"
                    )
            
            except Exception as e:
                logger.error(f"Error during generation (Attempt {attempt + 1}): {e}")
                if attempt == max_retries - 1:
                    raise e
        
        logger.warning("Max retries reached. Returning last result despite validation failure.")
        if last_result:
             last_result["validation"] = {"valid": False, "message": "Max retries reached"}
             return last_result
        return {"content": "Generation failed.", "validation": {"valid": False, "message": "Generation failed"}}
    

    
    def _parse_response(self, response: str) -> Dict:
        """LLM 응답 파싱"""
        result = {
            "selected_blocks": [],
            "selected_cover_letters": [],
            "content": "",
            "raw_response": response
        }
        
        # [선택된 자료] 섹션 파싱
        selection_match = re.search(
            r'\[선택된 자료\](.*?)\[자기소개서\]',
            response,
            re.DOTALL
        )
        
        if selection_match:
            selection_text = selection_match.group(1)
            
            # 블록 번호 추출
            block_match = re.search(r'블록[:\s]*(.+)', selection_text)
            if block_match:
                block_nums = re.findall(r'블록(\d+)', block_match.group(1))
                result["selected_blocks"] = [int(n) for n in block_nums]
            
            # 자소서 번호 추출
            cl_match = re.search(r'자소서[:\s]*(.+)', selection_text)
            if cl_match:
                cl_nums = re.findall(r'자소서(\d+)', cl_match.group(1))
                result["selected_cover_letters"] = [int(n) for n in cl_nums]
        
        # [자기소개서] 섹션 추출
        content_match = re.search(r'\[자기소개서\]\s*(.*)', response, re.DOTALL)
        if content_match:
            result["content"] = content_match.group(1).strip()
        else:
            # 형식이 맞지 않으면 전체를 content로
            result["content"] = response.strip()
        
        return result
