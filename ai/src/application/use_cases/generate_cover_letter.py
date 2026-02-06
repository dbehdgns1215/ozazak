from typing import List, Dict, Any, AsyncGenerator, Optional
import logging

from src.application.ports.llm_port import LLMPort
from src.application.ports.backend_port import BackendPort
from src.application.dtos.requests import SmartGenerationRequestDTO, SelectedGenerationRequestDTO
from src.application.dtos.events import (
    StepStartEvent, StepCompleteEvent, ContentEvent, DoneEvent, ErrorEvent, SelectionEvent, ValidationEvent
)
from src.domain.entities.block import Block
from src.domain.value_objects.job_analysis import JobAnalysis

logger = logging.getLogger(__name__)

class GenerateSmartCoverLetterUseCase:
    """Use Case for Smart Cover Letter Generation (Selection + Generation)"""
    
    def __init__(self, llm_port: LLMPort, backend_port: BackendPort):
        self._llm = llm_port
        self._backend = backend_port
        
        # Initialize pipeline once
        from src.adapters.outbound.llm.chains.pipelines.enhanced_pipeline import EnhancedCoverLetterPipeline
        from src.config.settings import settings
        self._pipeline = EnhancedCoverLetterPipeline(self._llm.llm, settings.serper_api_key)
    
    def _convert_pipeline_event(self, event: dict):
        """Convert LangGraph pipeline event to SSE event"""
        event_type = event.get("event")
        if event_type == "step_start":
            return StepStartEvent(step=event.get("step"), message=event.get("message"))
        elif event_type == "step_complete":
            return StepCompleteEvent(step=event.get("step"), data=event.get("data"))
        elif event_type == "validation":
            data = event.get("data", {})
            return ValidationEvent(
                status="validating",
                attempt=1,
                max_attempts=3,
                message=data.get("message", ""),
                char_count=data.get("char_count"),
                char_limit=data.get("char_limit")
            )
        elif event_type == "error":
            return ErrorEvent(message=event.get("message"))
        return event
        
    async def execute(self, request: SmartGenerationRequestDTO) -> AsyncGenerator[Any, None]:
        try:
            # Step 1: Loading Data
            yield StepStartEvent(step="loading", message="데이터를 불러오고 있습니다...")
            
            blocks = []
            cover_letters = []
            
            # Load Blocks
            if request.blocks:
                blocks = [
                    Block(
                        id=b.get("id"),
                        content=b.get("content", ""),
                        category=b.get("category", "기타"),
                        keywords=b.get("keywords", [])
                    ) for b in request.blocks
                ]
            elif request.user_id and request.auth_token:
                raw_blocks = await self._backend.get_all_blocks(request.user_id, request.auth_token)
                blocks = [
                    Block(
                        id=b.get("id"),
                        content=b.get("content", ""),
                        category=b.get("category", "기타"),
                        keywords=b.get("keywords", [])
                    ) for b in raw_blocks
                ]

            # Load Cover Letters
            if request.cover_letters:
                cover_letters = request.cover_letters
            elif request.user_id and request.auth_token:
                cover_letters = await self._backend.get_all_cover_letters(request.user_id, request.auth_token)
            
            yield StepCompleteEvent(step="loading", data={
                "blocks_count": len(blocks),
                "cover_letters_count": len(cover_letters)
            })
            
            # Step 2: Job Analysis (currently unused, can be passed to pipeline in future)
            
            # Step 3: Generation (LangGraph Pipeline)
            yield StepStartEvent(step="generating", message="자기소개서를 작성하고 있습니다...")
            
            # 참고 자소서 결합
            reference_letter = "\n\n".join([c.get("content", "") if isinstance(c, dict) else c for c in cover_letters]) if cover_letters else None
            
            content = ""
            async for event in self._pipeline.run_with_events(
                question=request.question,
                blocks=[b.content if hasattr(b, 'content') else b.get("content", "") for b in blocks],
                company_name=request.company_name,
                position=request.position,
                poster_url=request.poster_url,
                fallback_content=request.fallback_content,
                char_limit=request.char_limit or 800,
                reference_letter=reference_letter,
                user_prompt=request.user_prompt  # 사용자 지시사항 전달
            ):
                # 이벤트 변환 및 yield
                converted_event = self._convert_pipeline_event(event)
                yield converted_event
                
                if event.get("event") == "done":
                    content = event.get("content", "")
            
            validation = {"valid": True, "message": "Generated by LangGraph pipeline"}

            yield StepCompleteEvent(step="generating", data={
                "content": content,
                "validation": validation
            })
                
            # Step 4: Saving
            saved_id = None
            if request.save_to_backend and request.user_id and request.auth_token:
                 yield StepStartEvent(step="saving", message="작성된 내용을 저장하고 있습니다...")
                 
                 q_id = request.question_id or 0
                 if request.coverletter_id and q_id:
                     saved = await self._backend.save_essay(
                        coverletter_id=request.coverletter_id,
                        question_id=q_id,
                        content=content,
                        version_title="AI Smart Generation",
                        set_as_current=True,
                        auth_token=request.auth_token
                     )
                     if saved:
                         saved_id = saved.get("id")
                 
                 yield StepCompleteEvent(step="saving", data={"saved_id": saved_id})
            
            yield DoneEvent(success=True, saved_essay_id=saved_id)

        except Exception as e:
            logger.error(f"Smart Generation failed: {e}")
            yield ErrorEvent(message=str(e))


class GenerateSelectedCoverLetterUseCase:
    """Use Case for Selected Blocks Cover Letter Generation"""
    
    def __init__(self, llm_port: LLMPort, backend_port: BackendPort):
        self._llm = llm_port
        self._backend = backend_port
        
        # Initialize pipeline once
        from src.adapters.outbound.llm.chains.pipelines.enhanced_pipeline import EnhancedCoverLetterPipeline
        from src.config.settings import settings
        self._pipeline = EnhancedCoverLetterPipeline(self._llm.llm, settings.serper_api_key)
    
    # Reuse the same helper method from GenerateSmartCoverLetterUseCase
    _convert_pipeline_event = GenerateSmartCoverLetterUseCase._convert_pipeline_event
        
    async def execute(self, request: SelectedGenerationRequestDTO) -> AsyncGenerator[Any, None]:
        try:
             # Step 1: Loading Data (Selected Blocks/CoverLetters)
            yield StepStartEvent(step="loading", message="선택된 데이터를 불러오고 있습니다...")
            
            blocks = []
            references = [] # Selected Cover Letters are treated as references
            
            # Load Blocks
            if request.blocks:
                 blocks = [b if isinstance(b, str) else b.get("content", "") for b in request.blocks]
            elif request.block_ids and request.auth_token:
                b_ids_str = [str(bid) for bid in request.block_ids]
                raw_blocks = await self._backend.get_blocks_by_ids(b_ids_str, request.auth_token)
                blocks = [b.get("content", "") for b in raw_blocks]
            
            # Load Cover Letters (References)
            if request.cover_letters:
                 references = [c if isinstance(c, str) else c.get("content", "") for c in request.cover_letters]
            elif request.cover_letter_ids and request.auth_token:
                c_ids_str = [str(cid) for cid in request.cover_letter_ids]
                raw_cls = await self._backend.get_cover_letters_by_ids(c_ids_str, request.auth_token)
                references = [c.get("content", "") for c in raw_cls]

            yield StepCompleteEvent(step="loading", data={
                "blocks_count": len(blocks),
                "references_count": len(references)
            })

            # Step 2: Job Analysis (currently unused, can be passed to pipeline in future)

            # Step 3: Generation (LangGraph Pipeline)
            yield StepStartEvent(step="generating", message="자기소개서를 작성하고 있습니다...")
            
            # Fallback Logic: 재료(Block)와 참고자료(Reference) 상호 보완
            final_blocks = blocks
            final_references = references

            # 1. 블록이 없고 참고자료만 있는 경우 -> 참고자료를 블록(경험 소재)으로 사용
            if not final_blocks and final_references:
                logger.info("[Fallback] No blocks provided. Using references as blocks.")
                final_blocks = final_references
            
            # 2. 참고자료가 없고 블록만 있는 경우 -> 블록을 참고자료(스타일/내용)로도 활용
            if not final_references and final_blocks:
                logger.info("[Fallback] No references provided. Using blocks as references.")
                final_references = final_blocks
            
            # [Validation] 둘 다 없는 경우 에러 처리
            if not final_blocks and not final_references:
                err_msg = "경험 블록이나 참고할 자소서가 없습니다. 최소 하나는 입력해야 합니다."
                logger.warning(f"[Validation Failed] {err_msg}")
                yield ErrorEvent(message=err_msg)
                return

            # 참고 자소서 결합
            reference_letter = "\n\n".join(final_references) if final_references else None
            
            content = ""
            logger.info(f"[DEBUG] Starting pipeline with blocks={len(blocks)}, question={request.question[:30]}...")
            async for event in self._pipeline.run_with_events(
                question=request.question,
                blocks=final_blocks,
                company_name=request.company_name,
                position=request.position,
                poster_url=request.poster_url,
                fallback_content=request.fallback_content,
                char_limit=request.char_limit or 800,
                reference_letter=reference_letter,
                user_prompt=request.user_prompt,  # 사용자 지시사항 전달
                job_analysis=request.job_analysis,  # 캐시된 분석 결과
                recruitment_end_date=request.recruitment_end_date  # 동적 TTL
            ):
                # 디버깅: 이벤트 로깅
                logger.info(f"[DEBUG] Pipeline event: {event.get('event')}, step={event.get('step')}")

                # 이벤트 변환 및 yield
                converted_event = self._convert_pipeline_event(event)
                yield converted_event

                if event.get("event") == "done":
                    content = event.get("content", "")
                    logger.info(f"[DEBUG] Done event received, content length={len(content)}")
            
            validation = {"valid": True, "message": "Generated by LangGraph pipeline"}

            yield StepCompleteEvent(step="generating", data={
                "content": content,
                "validation": validation
            })
            
            # Step 4: Saving
            saved_id = None
            if request.save_to_backend and request.auth_token:
                yield StepStartEvent(step="saving", message="작성된 내용을 저장하고 있습니다...")
                q_id = request.question_id or 0
                if request.coverletter_id and q_id:
                     saved = await self._backend.save_essay(
                        coverletter_id=request.coverletter_id,
                        question_id=q_id,
                        content=content,
                        version_title="AI Selected Generation",
                        set_as_current=True,
                        auth_token=request.auth_token
                     )
                     if saved:
                         saved_id = saved.get("id")
                yield StepCompleteEvent(step="saving", data={"saved_id": saved_id})

            yield DoneEvent(success=True, saved_essay_id=saved_id)

        except Exception as e:
            logger.error(f"Selected Generation failed: {e}")
            yield ErrorEvent(message=str(e))
