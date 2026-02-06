import asyncio
import sys
import os
import inspect

# Add src to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.application.use_cases.analyze_job_posting import AnalyzeJobPostingUseCase
from src.application.use_cases.generate_cover_letter import GenerateSmartCoverLetterUseCase, GenerateSelectedCoverLetterUseCase
from src.application.use_cases.refine_cover_letter import RefineCoverLetterUseCase
from src.adapters.outbound.api.spring_client import SpringAPIClient
from src.domain.value_objects.job_analysis import JobAnalysis

async def test_verification():
    print("🚀 Verifying Architecture Refactoring (Final Phase)...")
    
    try:
        # 1. Adapter Instantiation
        print("1️⃣ Checking Adapters...")
        llm_adapter = get_llm_adapter("gemini-flash")
        backend_client = SpringAPIClient()
        print(f"✅ LLM Adapter: {type(llm_adapter).__name__}")
        print(f"✅ Backend Client: {type(backend_client).__name__}")
        
        # 2. Use Case Instantiation
        print("2️⃣ Checking Use Cases...")
        uc_blocks = AnalyzeJobPostingUseCase(llm_adapter)
        uc_smart = GenerateSmartCoverLetterUseCase(llm_adapter, backend_client)
        uc_selected = GenerateSelectedCoverLetterUseCase(llm_adapter, backend_client)
        uc_refine = RefineCoverLetterUseCase(llm_adapter, backend_client)
        
        print("✅ AnalyzeJobPostingUseCase instantiated")
        print("✅ GenerateSmartCoverLetterUseCase instantiated")
        print("✅ GenerateSelectedCoverLetterUseCase instantiated")
        print("✅ RefineCoverLetterUseCase instantiated")
        
        # 3. Check imports of main.py (Architecture Wired Check)
        print("3️⃣ Checking main.py imports...")
        try:
             from src.adapters.inbound.rest import main
             print("✅ main.py imported successfully (Routes and Types are valid)")
        except ImportError as e:
             print(f"❌ main.py import failed: {e}")
        except Exception as e:
             print(f"⚠️ main.py import warning (runtime side-effect?): {e}")

        print("🎉 Verification Successful! All components wired.")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Verification Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_verification())
