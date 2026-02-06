"""Test Auto-Regeneration (Retry) Logic
Verifies that the generate method retries upon validation failure.
"""
import asyncio
import sys
import logging
from unittest.mock import MagicMock, patch, AsyncMock

# Add project root to path
sys.path.insert(0, ".")

from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.adapters.outbound.llm.chains.smart_generation_chain import SmartGenerationChain
from src.adapters.outbound.llm.chains.cover_letter_chain import CoverLetterGenerationChain

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_retry")

async def test_smart_chain_retry():
    print("\n[Test] SmartGenerationChain Retry Logic")
    
    # 1. Setup
    adapter = get_llm_adapter("gemini-flash")
    chain = SmartGenerationChain(adapter.llm)
    
    # 2. Mock Validation to fail twice then succeed
    # We patch the 'run' method of CharacterCountValidator class
    with patch("src.adapters.outbound.tools.validator.CharacterCountValidator.run") as mock_run:
        # Side effect: failures then success
        mock_run.side_effect = [
            {"valid": False, "message": "Too long (1)", "status": "TOO_LONG"},
            {"valid": False, "message": "Too long (2)", "status": "TOO_LONG"},
            {"valid": True, "message": "OK", "status": "OK", "content": "Valid content"}
        ]
        
        # 3. Execution (Using a mocked LLM call for speed would be better, but let's trust the real one works or mock ainvoke)
        # To make it fast and deterministic, let's also mock the chain.ainvoke
        from langchain_core.messages import AIMessage
        
        # Configure the mock to return an AIMessage (awaitable)
        # properly mocking the async method on the class
        with patch("src.adapters.outbound.llm.custom_llms.GeminiChatModel.ainvoke", new_callable=AsyncMock) as mock_llm:
            mock_llm.return_value = AIMessage(content="Valid content")
                
            # Let's NOT mock the LLM for now, just the validator. 
            # It will make real API calls, which is fine for a few calls.
            # But the content won't change based on feedback unless the model listens.
            # The VALIDATOR is mocked to return True eventually, so the loop will break.
            
            print("  Invoking generate (mocked LLM calls)...")
            result = await chain.generate(
                question="Test question",
                company_name="Test Company",
                position="Test Position",
                blocks=[],
                cover_letters=[],
                char_limit=100,
                max_retries=3
            )
            
            # 4. Verification
            print(f"  Validator Call count: {mock_run.call_count}")
            if mock_run.call_count == 3:
                print("  ✅ Retried 3 times (2 failures + 1 success)")
            else:
                print(f"  ❌ Expected 3 calls, got {mock_run.call_count}")
            
            # Check if result is returned
            if result:
                print("  ✅ Result returned")

async def test_cover_letter_chain_retry():
    print("\n[Test] CoverLetterGenerationChain Retry Logic")
    
    adapter = get_llm_adapter("gemini-flash")
    chain = CoverLetterGenerationChain(adapter.llm)
    
    with patch("src.adapters.outbound.tools.validator.CharacterCountValidator.run") as mock_run:
        mock_run.side_effect = [
            {"valid": False, "message": "Too short", "status": "TOO_SHORT"},
            {"valid": True, "message": "OK", "status": "OK"}
        ]
        
        print("  Invoking generate (real LLM calls)...")
        await chain.generate(
            question="Test question",
            blocks=["Block 1"],
            char_limit=100,
            max_retries=3
        )
        
        print(f"  Validator Call count: {mock_run.call_count}")
        if mock_run.call_count == 2:
            print("  ✅ Retried 2 times (1 failure + 1 success)")
        else:
            print(f"  ❌ Expected 2 calls, got {mock_run.call_count}")

if __name__ == "__main__":
    asyncio.run(test_smart_chain_retry())
    asyncio.run(test_cover_letter_chain_retry())
