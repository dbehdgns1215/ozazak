import pytest
from unittest.mock import AsyncMock
from src.application.use_cases.refine_cover_letter import RefineCoverLetterUseCase
from src.application.dtos.requests import CoverLetterRefinementRequestDTO
from src.application.dtos.events import StepStartEvent, DoneEvent, ErrorEvent, ValidationEvent

class TestRefineCoverLetterUseCase:
    @pytest.mark.asyncio
    async def test_execute_success(self):
        """Refinement: 정상 흐름"""
        llm_port = AsyncMock()
        backend_port = AsyncMock()
        
        use_case = RefineCoverLetterUseCase(llm_port, backend_port)
        
        request = CoverLetterRefinementRequestDTO(
            question="Q", 
            original_content="Old Content",
            feedback="Make it better",
            company_name="C", 
            position="P"
        )
        
        async def mock_refine(*args, **kwargs):
            on_status = kwargs.get("on_status")
            if on_status:
                await on_status({"status": "generating", "message": "Refining"})
            return {"content": "New Content", "validation": {}}
        
        llm_port.refine_with_validation.side_effect = mock_refine
        
        events = []
        async for event in use_case.execute(request):
            events.append(event)
            
        assert any(isinstance(e, StepStartEvent) and e.step == "refining" for e in events)
        assert any(isinstance(e, ValidationEvent) for e in events)
        assert any(isinstance(e, DoneEvent) for e in events)

    @pytest.mark.asyncio
    async def test_empty_content_error(self):
        """Refinement: 내용 없음 에러"""
        llm_port = AsyncMock()
        backend_port = AsyncMock()
        use_case = RefineCoverLetterUseCase(llm_port, backend_port)
        
        # Empty content
        request = CoverLetterRefinementRequestDTO(
            question="Q", original_content="", feedback="Fix"
        )
        
        events = []
        async for event in use_case.execute(request):
            events.append(event)
            
        assert any(isinstance(e, ErrorEvent) and "없습니다" in e.message for e in events)
