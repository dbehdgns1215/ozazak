from typing import AsyncGenerator, Any
import logging

from src.application.ports.llm_port import LLMPort
from src.application.ports.backend_port import BackendPort
from src.application.dtos.requests import CoverLetterRefinementRequestDTO
from src.application.dtos.events import (
    StepStartEvent, StepCompleteEvent, ContentEvent, DoneEvent, ErrorEvent, ValidationEvent
)

logger = logging.getLogger(__name__)

class RefineCoverLetterUseCase:
    """Use Case for Refining Cover Letter"""
    
    def __init__(self, llm_port: LLMPort, backend_port: BackendPort):
        self._llm = llm_port
        self._backend = backend_port
        
    async def execute(self, request: CoverLetterRefinementRequestDTO) -> AsyncGenerator[Any, None]:
        try:
            # Step 1: Loading (Optional - currently request has content)
            yield StepStartEvent(step="loading", message="데이터 확인 중...")
            
            # If original content is empty/missing, maybe fetch from ID? 
            # DTO has cover_letter_id, question_id, but usually content is sent from frontend editor.
            content = request.original_content
            if not content and request.cover_letter_id and request.question_id and request.auth_token:
                 # Fetch existing essay logic if needed, but usually refinement starts from editor state.
                 pass

            if not content:
                yield ErrorEvent(message="수정할 내용이 없습니다.")
                return

            yield StepCompleteEvent(step="loading", data={"length": len(content)})
            
            # Step 2: Refinement
            yield StepStartEvent(step="refining", message="피드백을 반영하여 수정 중입니다...")
            
            import asyncio
            from typing import Dict
            queue = asyncio.Queue()
            
            async def on_status(data: Dict):
                # data: {status, message, attempt, max_retries}
                event = ValidationEvent(
                    status=data.get("status", "validating"),
                    message=data.get("message", ""),
                    attempt=data.get("attempt", 1),
                    max_attempts=data.get("max_retries", 3)
                )
                await queue.put(event)

            # Start refinement task
            gen_task = asyncio.create_task(self._llm.refine_with_validation(
                question=request.question,
                original_content=content,
                feedback=request.feedback,
                company_name=request.company_name or "",
                position=request.position or "",
                char_limit=request.char_limit or 800,
                on_status=on_status
            ))
            
            while not gen_task.done():
                try:
                    # Wait for event or task completion
                    get_event_task = asyncio.create_task(queue.get())
                    done, pending = await asyncio.wait(
                        [gen_task, get_event_task], 
                        return_when=asyncio.FIRST_COMPLETED
                    )
                    
                    if get_event_task in done:
                        event = get_event_task.result()
                        yield event
                    else:
                        get_event_task.cancel()
                except Exception:
                    break
            
            # Retrieve result
            result = await gen_task
            full_content = result.get("content", "")
            validation = result.get("validation", {})
            
            # Flush remaining events
            while not queue.empty():
                yield await queue.get()

            yield StepCompleteEvent(step="refining", data={
                "content": full_content,
                "validation": validation
            })
            
            # Step 3: Saving
            saved_id = None
            if request.save_to_backend and request.cover_letter_id and request.question_id and request.auth_token:
                 yield StepStartEvent(step="saving", message="수정된 내용을 저장하고 있습니다...")
                 
                 saved = await self._backend.save_essay(
                    coverletter_id=request.cover_letter_id,
                    question_id=request.question_id,
                    content=full_content,
                    version_title="AI 수정 (리파인)",
                    set_as_current=True,
                    auth_token=request.auth_token
                 )
                 if saved:
                     saved_id = saved.get("id")
                     
                 yield StepCompleteEvent(step="saving", data={"saved_id": saved_id})
            
            yield DoneEvent(success=True, saved_essay_id=saved_id)

        except Exception as e:
            logger.error(f"Refinement failed: {e}")
            yield ErrorEvent(message=str(e))
