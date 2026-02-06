import pytest
import asyncio
import json
import os
import sys
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient

# Adjust path to include 'ai' root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

# Handle AsyncClient
from httpx import ASGITransport
from fastapi.responses import StreamingResponse
from unittest.mock import MagicMock

# Mock sse_starlette
sys.modules["sse_starlette"] = MagicMock()
sys.modules["sse_starlette.sse"] = MagicMock()

# Mock sse_starlette.sse.EventSourceResponse
class MockEventSourceResponse(StreamingResponse):
    def __init__(self, content):
        async def sse_serializer():
            async for item in content:
                # Manual SSE serialization for test
                if isinstance(item, dict):
                    event = item.get("event", "message")
                    data = item.get("data", "")
                    yield f"event: {event}\ndata: {data}\n\n"
                else:
                    yield str(item)
                    
        super().__init__(sse_serializer(), media_type="text/event-stream")

sys.modules["sse_starlette.sse"].EventSourceResponse = MockEventSourceResponse

from src.adapters.inbound.rest.main import app

# Handle AsyncClient
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_smart_generation_validation_flow():
    # Mock Data
    mock_adapter = AsyncMock()
    
    async def mock_generate(*args, **kwargs):
        on_status = kwargs.get("on_status")
        if on_status:
            # Simulate Generating
            await on_status({
                "status": "generating",
                "message": "Generating...",
                "attempt": 1,
                "max_retries": 3
            })
            # Simulate Retry
            await on_status({
                "status": "retry", 
                "message": "Too long", 
                "attempt": 1, 
                "max_retries": 3
            })
            # Simulate Validating
            await on_status({
                "status": "validating", 
                "message": "Valid", 
                "attempt": 2, 
                "max_retries": 3
            })
        
        return {
            "content": "Final Content",
            "validation": {"valid": True, "message": "OK"}
        }

    mock_adapter.generate_cover_letter_with_validation = AsyncMock(side_effect=mock_generate)
    
    # Patch get_llm_adapter to return our mock_adapter
    with patch("src.adapters.inbound.rest.main.get_llm_adapter", return_value=mock_adapter):
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post("/api/ai/cover-letters/smart", json={
                "user_id": "test",
                "question": "Q",
                "company_name": "C",
                "position": "P",
                "blocks": [{"content": "B"}],
                "cover_letters": [],
                "model_type": "gpt"
            })
            
            assert response.status_code == 200
            
            events = []
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:].strip()
                    if not data_str: continue
                    try:
                        event_wrap = json.loads(data_str)
                        events.append(event_wrap)
                    except json.JSONDecodeError:
                        pass

            print("\nCaptured Events:")
            for e in events:
                print(e)
            
            # assertions
            # assertions
            generating_event = next((e for e in events if e.get("event") == "validation" and e.get("status") == "generating"), None)
            retry_event = next((e for e in events if e.get("event") == "validation" and e.get("status") == "retry"), None)
            validating_event = next((e for e in events if e.get("event") == "validation" and e.get("status") == "validating"), None)
            
            complete_event = next((e for e in events if e.get("event") == "step_complete"), None)
            done_event = next((e for e in events if e.get("event") == "done"), None)
            
            assert generating_event is not None, "Generating event missing"
            assert retry_event is not None, f"Retry event missing. Events: {events}"
            assert validating_event is not None, "Validating event missing"
            assert complete_event is not None, "Step Complete event missing"
            assert done_event is not None, "Done event missing"
            print("Validation flow verified successfully!")

if __name__ == "__main__":
    asyncio.run(test_smart_generation_validation_flow())
