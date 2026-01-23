"""
멀티 모델 테스트 스크립트
모든 AI 모델 (GPT, Gemini, Gemini Flash, Claude) 테스트
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.config.settings import settings


async def test_model(model_type: str):
    """단일 모델 테스트"""
    print(f"\n{'='*60}")
    print(f"[TEST] {model_type.upper()} 모델 테스트")
    print(f"{'='*60}")
    
    try:
        adapter = get_llm_adapter(model_type)
        print(f"[OK] 어댑터 생성 성공: {type(adapter).__name__}")
        
        # 간단한 채용공고 분석 테스트
        job_posting = """
        주요 업무: AI 모델 개발
        자격요건: Python, TensorFlow 경험
        우대사항: NLP 경험
        """
        
        print("[...] 채용공고 분석 중...")
        analysis = await adapter.analyze_job_posting(
            company_name="테스트 기업",
            position="AI 엔지니어",
            job_posting=job_posting
        )
        
        keywords = analysis.get("keywords", [])
        print(f"[OK] 분석 완료! 키워드: {', '.join(keywords[:3]) if keywords else '추출됨'}")
        
        # 간단한 자소서 생성 테스트
        print("[...] 자소서 생성 중...")
        cover_letter = await adapter.generate_cover_letter(
            question="자기소개를 해주세요.",
            blocks=["Python 개발 경험이 있습니다."],
            char_limit=200
        )
        
        print(f"[OK] 생성 완료! ({len(cover_letter)}자)")
        print(f"    미리보기: {cover_letter[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"[FAIL] 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    print("\n" + "="*60)
    print("    멀티 AI 모델 테스트")
    print(f"    기본 모델: {settings.default_model}")
    print("="*60)
    
    models = ["gemini-flash", "gemini", "gpt", "claude"]
    results = {}
    
    for model in models:
        results[model] = await test_model(model)
    
    # 결과 요약
    print("\n" + "="*60)
    print("    테스트 결과 요약")
    print("="*60)
    
    for model, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {model:15} : {status}")
    
    total = len(results)
    passed = sum(1 for s in results.values() if s)
    print(f"\n  총 {total}개 중 {passed}개 성공")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
