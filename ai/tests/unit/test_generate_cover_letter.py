import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from src.application.use_cases.generate_cover_letter import GenerateSmartCoverLetterUseCase, GenerateSelectedCoverLetterUseCase
from src.application.dtos.requests import SmartGenerationRequestDTO, SelectedGenerationRequestDTO
from src.application.dtos.events import StepStartEvent, StepCompleteEvent, DoneEvent, ErrorEvent, ValidationEvent

class TestGenerateSmartCoverLetterUseCase:
    @pytest.mark.asyncio
    async def test_execute_success(self):
        """1. Smart: 정상 흐름 (Loading -> Generating -> Done)"""
        # Mock Ports
        llm_port = AsyncMock()
        backend_port = AsyncMock()
        
        use_case = GenerateSmartCoverLetterUseCase(llm_port, backend_port)
        
        # Mock Request
        request = SmartGenerationRequestDTO(
            question="My Question",
            company_name="My Company",
            position="My Position",
            blocks=[{"content": "Block 1"}],
            cover_letters=[{"content": "Ref 1"}]
        )
        
        # Mock LLM generation result
        async def mock_generate_with_validation(*args, **kwargs):
            on_status = kwargs.get("on_status")
            if on_status:
                await on_status({"status": "generating", "message": "Gen"})
            return {"content": "Generated Content", "validation": {"valid": True}}
            
        llm_port.generate_cover_letter_with_validation.side_effect = mock_generate_with_validation
        
        # Run UseCase
        events = []
        async for event in use_case.execute(request):
            events.append(event)
            
        # Verify Flow
        # Expected: 
        # 1. StepStart(loading)
        # 2. StepComplete(loading)
        # 3. StepStart(generating)
        # 4. ValidationEvent(generating)
        # 5. StepComplete(generating)
        # 6. DoneEvent
        
        assert any(isinstance(e, StepStartEvent) and e.step == "loading" for e in events)
        assert any(isinstance(e, StepStartEvent) and e.step == "generating" for e in events)
        assert any(isinstance(e, ValidationEvent) for e in events)
        assert any(isinstance(e, DoneEvent) for e in events)
        
        # Check Result
        done_event = next(e for e in events if isinstance(e, DoneEvent))
        assert done_event.success is True
        
        # Check LLM call
        llm_port.generate_cover_letter_with_validation.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_execute_backend_loading(self):
        """2. Smart: blocks가 비어있을 때 backend에서 로드"""
        llm_port = AsyncMock()
        backend_port = AsyncMock()
        
        # Mock Backend logic
        backend_port.get_all_blocks.return_value = [{"id": 1, "content": "Backend Block"}]
        backend_port.get_all_cover_letters.return_value = []
        
        # Mock LLM to avoid crash
        llm_port.generate_cover_letter_with_validation.return_value = {"content": "Res", "validation": {}}
        
        use_case = GenerateSmartCoverLetterUseCase(llm_port, backend_port)
        
        request = SmartGenerationRequestDTO(
            question="Q", company_name="C", position="P",
            user_id=123, auth_token="token",
            blocks=[] # Empty, should trigger backend fetch
        )
        
        async for _ in use_case.execute(request):
            pass
            
        backend_port.get_all_blocks.assert_called_with(123, "token")

    @pytest.mark.asyncio
    async def test_error_handling(self):
        """4. 에러 발생 시 ErrorEvent yield"""
        llm_port = AsyncMock()
        backend_port = AsyncMock()
        
        llm_port.generate_cover_letter_with_validation.side_effect = Exception("LLM Crash")
        
        use_case = GenerateSmartCoverLetterUseCase(llm_port, backend_port)
        request = SmartGenerationRequestDTO(question="Q", company_name="C", position="P", blocks=[{}])
        
        events = []
        async for event in use_case.execute(request):
            events.append(event)
            
        assert any(isinstance(e, ErrorEvent) and "LLM Crash" in e.message for e in events)

class TestGenerateSelectedCoverLetterUseCase:
    @pytest.mark.asyncio
    async def test_execute_success(self):
        """3. Selected: 정상 흐름"""
        llm_port = AsyncMock()
        backend_port = AsyncMock()
        
        use_case = GenerateSelectedCoverLetterUseCase(llm_port, backend_port)
        
        request = SelectedGenerationRequestDTO(
            question="Q", company_name="C", position="P",
            blocks=["Block A"], cover_letters=["Ref A"]
        )
        
        async def mock_gen(*args, **kwargs):
            return {"content": "Selected Content", "validation": {}}
        llm_port.generate_selected_cover_letter_with_validation.side_effect = mock_gen
        
        events = []
        async for event in use_case.execute(request):
            events.append(event)
            
        assert any(isinstance(e, DoneEvent) for e in events)
