import logging
from typing import List, Dict, Optional, Any
from langchain_core.language_models import BaseChatModel

from ..search.company_search_chain import CompanySearchChain
from ..scraper.job_posting_scraper import JobPostingScraperChain
from ..generation.cover_letter_generation import GenerationChain
from ..validation.validation_chain import ValidationChain
from ..cleanup.cleanup_chain import CleanupChain
from ..schemas import FinalOutput, CoverLetterOutput, ValidationResult

logger = logging.getLogger(__name__)

from src.adapters.outbound.llm.graph.pipeline_graph import PipelineGraph
from ..schemas import FinalOutput
from src.config.settings import settings

class EnhancedCoverLetterPipeline:
    def __init__(self, llm: BaseChatModel, serper_api_key: str, vision_llm: BaseChatModel = None):
        # 기존 체인들은 v3에서 일부만 사용하거나 대체됨
        self.search_chain = CompanySearchChain(llm, serper_api_key)
        self.scraper_chain = JobPostingScraperChain(llm, vision_llm=vision_llm)
        # PipelineGraph에는 OpenAI 임베딩 생성을 위해 GMS Key(OpenAI Key 역할)를 전달
        self.pipeline_graph = PipelineGraph(llm, settings.gms_api_key).create_graph()
        self.serper_api_key = serper_api_key
    
    async def run(
        self,
        question: str,
        blocks: List[str],
        company_name: str,
        position: str,
        poster_url: Optional[str] = None,
        fallback_content: Optional[str] = None,
        char_limit: int = 800,
        # v3 추가 파라미터
        questions: Optional[List[str]] = None, # 문항이 여러 개인 경우
        reference_letter: Optional[str] = None # 참고 자소서
    ) -> FinalOutput:
        
        # 1. Search (기업 정보 검색) - 기존 로직 유지
        try:
            company_info = await self.search_chain.search_company(company_name, position)
        except Exception as e:
            logger.error(f"Search failed: {e}")
            company_info = {"company_name": company_name} # Minimal fallback

        # 2. Scrape (채용 공고 분석) - 기존 로직 유지
        try:
            job_posting = await self.scraper_chain.scrape(url=poster_url, fallback=fallback_content)
        except Exception as e:
            logger.error(f"Scrape failed: {e}")
            job_posting = {"title": position, "company": company_name}

        # 3. LangGraph Pipeline Execution
        # === DEBUG LOGGING ===
        logger.info(f"[DEBUG] enhanced_pipeline.run() called with:")
        logger.info(f"[DEBUG]   question='{question}' (type={type(question).__name__})")
        logger.info(f"[DEBUG]   questions={questions}")
        logger.info(f"[DEBUG]   char_limit={char_limit}")
        logger.info(f"[DEBUG]   blocks count={len(blocks) if blocks else 0}")
        # 3. LangGraph Pipeline Execution
        # questions가 있으면 사용, 없으면 single question 사용. 단, 둘 다 없거나 빈 값인 경우 에러 처리
        final_questions = []
        if questions:
            final_questions = [q for q in questions if q and q.strip()]
        elif question and question.strip():
            final_questions = [question]
            
        if not final_questions:
             raise ValueError("Valid 'question' or 'questions' list is required.")

        char_limits = [char_limit] * len(final_questions)
        
        logger.info(f"[DEBUG] final_questions={final_questions}")
        logger.info(f"[DEBUG] char_limits={char_limits}")
        
        # job_posting을 dict로 변환하고 position 추가
        if hasattr(job_posting, "model_dump"):
            job_posting_dict = job_posting.model_dump()
        else:
            job_posting_dict = dict(job_posting) if job_posting else {}
        
        # Backend에서 받은 position 추가 (스크래퍼 결과에 없을 수 있음)
        job_posting_dict["position"] = position
        
        # PipelineState 초기값 구성
        inputs = {
            "questions": final_questions,
            "char_limits": char_limits,
            "blocks": blocks,
            "reference_letter": reference_letter,
            "job_posting": job_posting_dict,
            "company_info": company_info.model_dump() if hasattr(company_info, "model_dump") else company_info,
            "current_question_idx": 0,
            "final_answers": []
        }
        
        try:
            result = await self.pipeline_graph.ainvoke(inputs)
            final_answers = result.get("final_answers", [])
            
            # 단일 문항 요청인 경우 기존 포맷으로 반환 (하위 호환성)
            if len(final_answers) == 1:
                ans = final_answers[0]
                content_length = len(ans.get("answer", ""))
                return FinalOutput(
                    content=ans["answer"],
                    validation=ValidationResult(
                        valid=True,
                        char_count=content_length,
                        issues=[],
                        suggestions=[]
                    ),
                    metadata={
                        "length": content_length,
                        "company_info": inputs["company_info"],
                        "job_posting": inputs["job_posting"]
                    }
                )
            else:
                # 다중 문항의 경우 첫 번째 결과만 반환
                ans = final_answers[0] if final_answers else {"answer": "", "length": 0}
                content_length = len(ans.get("answer", ""))
                return FinalOutput(
                    content=ans.get("answer", ""),
                    validation=ValidationResult(
                        valid=True,
                        char_count=content_length,
                        issues=[],
                        suggestions=[]
                    ),
                    metadata={
                        "length": content_length,
                        "all_answers": final_answers
                    }
                )

        except Exception as e:
            logger.error(f"Graph execution failed: {e}")
            raise e

    async def run_with_events(
        self,
        question: str,
        blocks: List[str],
        company_name: str,
        position: str,
        poster_url: Optional[str] = None,
        fallback_content: Optional[str] = None,
        char_limit: int = 800,
        reference_letter: Optional[str] = None,
        user_prompt: Optional[str] = None  # 사용자 추가 지시사항
    ):
        """LangGraph 실행 + 노드별 이벤트 스트리밍"""
        from typing import AsyncGenerator
        
        # 1. Search (기업 정보 검색)
        yield {"event": "step_start", "step": "searching", "message": "기업 정보 검색 중..."}
        try:
            company_info = await self.search_chain.search_company(company_name, position)
        except Exception as e:
            logger.error(f"Search failed: {e}")
            company_info = {"company_name": company_name}
        yield {"event": "step_complete", "step": "searching", "data": {"company": company_name}}
        
        # 2. Scrape (채용 공고 분석)
        yield {"event": "step_start", "step": "scraping", "message": "채용 공고 분석 중..."}
        try:
            job_posting = await self.scraper_chain.scrape(url=poster_url, fallback=fallback_content)
        except Exception as e:
            logger.error(f"Scrape failed: {e}")
            job_posting = {"title": position, "company": company_name}
        yield {"event": "step_complete", "step": "scraping", "data": {"position": position}}
        
        # 3. LangGraph 스트리밍
        final_questions = [question] if question and question.strip() else []
        if not final_questions:
            yield {"event": "error", "message": "Valid question is required"}
            return
        
        # job_posting을 dict로 변환하고 position 추가
        if hasattr(job_posting, "model_dump"):
            job_posting_dict = job_posting.model_dump()
        else:
            job_posting_dict = dict(job_posting) if job_posting else {}
        job_posting_dict["position"] = position
            
        inputs = {
            "questions": final_questions,
            "char_limits": [char_limit],
            "blocks": blocks,
            "reference_letter": reference_letter,
            "job_posting": job_posting_dict,
            "company_info": company_info.model_dump() if hasattr(company_info, "model_dump") else company_info,
            "user_prompt": user_prompt,  # 사용자 추가 지시사항
            "current_question_idx": 0,
            "final_answers": []
        }
        
        try:
            final_content = ""  # 최종 결과 저장용
            
            async for event in self.pipeline_graph.astream_events(inputs, version="v2"):
                event_kind = event.get("event")
                event_name = event.get("name", "").lower()
                
                # 노드 이름: retrieve_blocks, generate_draft, check_length, enhance_content, fix_format
                if event_kind == "on_chain_start":
                    if "reference" in event_name:
                        yield {"event": "step_start", "step": "mapping", "message": "참고 자소서 분석 중..."}
                    elif "retrieve" in event_name:
                        yield {"event": "step_start", "step": "retrieving", "message": "관련 경험 검색 중..."}
                    elif "generate" in event_name:
                        yield {"event": "step_start", "step": "generating", "message": "자기소개서 작성 중..."}
                    elif "enhance" in event_name:
                        yield {"event": "step_start", "step": "enhancing", "message": "글자수 조정 중..."}

                elif event_kind == "on_chain_end":
                    output = event.get("data", {}).get("output", {})

                    # === DEBUG: 모든 이벤트 출력 ===
                    if output:
                        if isinstance(output, dict):
                            logger.info(f"[DEBUG] on_chain_end: name={event_name}, output_keys={list(output.keys())}")
                        else:
                            logger.info(f"[DEBUG] on_chain_end: name={event_name}, output_type={type(output)}")

                    if isinstance(output, dict):
                        if "reference" in event_name:
                            yield {"event": "step_complete", "step": "mapping", "data": {"mapped": True}}
                        elif "retrieve" in event_name:
                            yield {"event": "step_complete", "step": "retrieving", "data": {
                                "blocks_found": len(output.get("relevant_blocks", []))
                            }}
                        elif "check_length" in event_name:
                            yield {"event": "validation", "step": "checking", "data": output}
                        elif "generate" in event_name:
                            yield {"event": "step_complete", "step": "generating", "data": {
                                "char_count": output.get("char_count", 0)
                            }}
                        elif "fix_format" in event_name:
                            # 최종 결과 저장 (중복 실행 방지)
                            final_content = output.get("final_content", "")
                            logger.info(f"[DEBUG] fix_format completed: final_content length={len(final_content)}")
                            yield {"event": "step_complete", "step": "formatting", "data": {
                                "content": final_content,
                                "length": len(final_content)
                            }}
            
            # 4. 최종 결과 (이미 스트리밍에서 추출됨, 중복 실행 제거)
            if final_content:
                yield {
                    "event": "done",
                    "success": True,
                    "content": final_content,
                    "length": len(final_content)
                }
            else:
                yield {"event": "error", "message": "생성 실패"}
                
        except Exception as e:
            import traceback
            logger.error(f"Graph streaming failed: {e}")
            logger.error(traceback.format_exc())
            yield {"event": "error", "message": str(e)}
