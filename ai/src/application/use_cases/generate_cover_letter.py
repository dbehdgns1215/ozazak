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
            
            # Step 2: Job Analysis
            job_analysis_vo = None
            if request.job_analysis:
                job_analysis_vo = JobAnalysis.from_dict(
                    request.job_analysis, 
                    request.company_name, 
                    request.position
                )
            
            # Step 3: Generation (Event-based Validation)
            yield StepStartEvent(step="generating", message="자기소개서를 작성하고 있습니다...")
            

            
            from src.application.utils.event_runner import EventRunner
            
            # Wrapper for the generation call to match EventRunner signature
            async def generation_task(on_status):
                return await self._llm.generate_cover_letter_with_validation(
                    question=request.question,
                    company_name=request.company_name,
                    position=request.position,
                    blocks=blocks,
                    cover_letters=cover_letters,
                    job_analysis=job_analysis_vo,
                    char_limit=request.char_limit or 800,
                    on_status=on_status
                )

            # Execute via EventRunner
            runner = EventRunner(generation_task, logger=logger)
            async for event in runner.stream():
                yield event
            
            # Retrieve result
            result = runner.get_result()
            content = result.get("content", "")
            validation = result.get("validation", {})

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

            # Step 2: Job Analysis (VO conversion)
            job_analysis_vo = None
            if request.job_analysis:
                 job_analysis_vo = JobAnalysis.from_dict(
                    request.job_analysis,
                    request.company_name,
                    request.position
                 )

            # Step 3: Generation
            yield StepStartEvent(step="generating", message="자기소개서를 작성하고 있습니다...")
            

            
            from src.application.utils.event_runner import EventRunner
            
            # Wrapper for the generation call
            async def generation_task(on_status):
                return await self._llm.generate_selected_cover_letter_with_validation(
                    question=request.question,
                    blocks=blocks,
                    references=references,
                    job_analysis=job_analysis_vo,
                    char_limit=request.char_limit or 800,
                    company_name=request.company_name,
                    position=request.position,
                    user_prompt=request.user_prompt,  # 사용자 지시사항 전달
                    on_status=on_status
                )

            # Execute via EventRunner
            runner = EventRunner(generation_task, logger=logger)
            async for event in runner.stream():
                yield event
            
            # Retrieve result
            result = runner.get_result()
            content = result.get("content", "")
            validation = result.get("validation", {})

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
