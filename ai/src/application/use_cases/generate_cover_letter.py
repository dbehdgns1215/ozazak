from typing import List, Dict, Any, AsyncGenerator, Optional
import logging

from src.application.ports.llm_port import LLMPort
from src.application.ports.backend_port import BackendPort
from src.application.dtos.requests import SmartGenerationRequestDTO, SelectedGenerationRequestDTO
from src.application.dtos.events import (
    StepStartEvent, StepCompleteEvent, ContentEvent, DoneEvent, ErrorEvent, SelectionEvent
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
                # Assuming request.blocks are already in correct format or need validation
                # If they are dicts, we need to convert to Block entities
                blocks = [
                    Block(
                        id=b.get("id"),
                        content=b.get("content", ""),
                        category=b.get("category", "UNKNOWN"),
                        keywords=b.get("keywords", [])
                    ) for b in request.blocks
                ]
            elif request.user_id and request.auth_token:
                raw_blocks = await self._backend.get_all_blocks(request.user_id, request.auth_token)
                blocks = [
                    Block(
                        id=b.get("id"),
                        content=b.get("content", ""),
                        category=b.get("category", "UNKNOWN"),
                        keywords=b.get("keywords", [])
                    ) for b in raw_blocks
                ]
            else:
                 # No data source
                 pass

            # Load Cover Letters
            if request.cover_letters:
                cover_letters = request.cover_letters
            elif request.user_id and request.auth_token:
                cover_letters = await self._backend.get_all_cover_letters(request.user_id, request.auth_token)
            
            if not blocks and not cover_letters:
                 # Warning or Error? Smart generation needs some data usually.
                 pass

            yield StepCompleteEvent(step="loading", data={
                "blocks_count": len(blocks),
                "cover_letters_count": len(cover_letters)
            })
            
            # Step 2: Job Analysis (If not provided)
            # Logic: If job_analysis is not in request but we have info to analyze?
            # Or assume job_analysis is mandatory or optional?
            # Request DTO has job_analysis: Optional[Dict]
            # LLMPort expects JobAnalysis VO.
            
            job_analysis_vo = None
            if request.job_analysis:
                job_analysis_vo = JobAnalysis.from_dict(
                    request.job_analysis, 
                    request.company_name, 
                    request.position
                )
            
            # If no job analysis logic here (e.g. call analyze_job_posting), LLM chain might handle it essentially or fallback.
            # We will proceed with what we have.
            
            # Step 3: Generation (Streaming)
            yield StepStartEvent(step="generating", message="자기소개서를 작성하고 있습니다...")
            
            full_content = ""
            # Note: stream_cover_letter_generation returns AsyncGenerator[str]
            # It internally handles selection and generation.
            # We process chunks.
            
            async for chunk in self._llm.stream_cover_letter_generation(
                question=request.question,
                company_name=request.company_name,
                position=request.position,
                blocks=blocks,
                cover_letters=cover_letters,
                job_analysis=job_analysis_vo,
                char_limit=request.char_limit or 800
            ):
                full_content += chunk
                yield ContentEvent(chunk=chunk)
                
            # Step 4: Saving
            saved_id = None
            if request.save_to_backend and request.user_id and request.auth_token:
                 yield StepStartEvent(step="saving", message="작성된 내용을 저장하고 있습니다...")
                 
                 # Look up question_id or use provided
                 q_id = request.question_id or 0 # 0 or validation needed?
                 # Assuming 0 is not valid usually, but logic depends on backend. 
                 # If no question_id, maybe we can't save linked to a question?
                 # For now, proceed if we have valid ids.
                 
                 if request.coverletter_id and q_id:
                     saved = await self._backend.save_essay(
                        coverletter_id=request.coverletter_id,
                        question_id=q_id,
                        content=full_content,
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
                # Provided directly as text or objects
                 # stream_selected_cover_letter expects List[str] for blocks content?
                 # Let's check LLMPort signature: blocks: List[str]
                 # So we extract content.
                 blocks = [b if isinstance(b, str) else b.get("content", "") for b in request.blocks]
            elif request.block_ids and request.auth_token:
                # Fetch by IDs
                # Note: block_ids in DTO is List[int], backend expects List[str] maybe? 
                # SpringClient: get_blocks_by_ids(block_ids: List[str])
                
                # Convert ints to strings for backend
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
            
            full_content = ""
            async for chunk in self._llm.stream_selected_cover_letter(
                question=request.question,
                blocks=blocks,
                references=references,
                job_analysis=job_analysis_vo,
                char_limit=request.char_limit or 800,
                company_name=request.company_name,
                position=request.position
            ):
                full_content += chunk
                yield ContentEvent(chunk=chunk)
            
            # Step 4: Saving
            saved_id = None
            if request.save_to_backend and request.auth_token:
                yield StepStartEvent(step="saving", message="작성된 내용을 저장하고 있습니다...")
                q_id = request.question_id or 0
                if request.coverletter_id and q_id:
                     saved = await self._backend.save_essay(
                        coverletter_id=request.coverletter_id,
                        question_id=q_id,
                        content=full_content,
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
