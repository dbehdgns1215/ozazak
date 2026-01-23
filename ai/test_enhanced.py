"""
LangChain 고도화 테스트 스크립트
채용공고 분석 + 고도화된 자소서 생성 테스트
"""
import asyncio
import sys
import os
from pathlib import Path

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

from src.adapters.outbound.llm.openai_adapter import OpenAILLMAdapter


def load_test_data(filename: str) -> str:
    filepath = Path(__file__).parent / "test_data" / filename
    if not filepath.exists():
        return ""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read().strip()


async def test_job_posting_analysis():
    """채용공고 분석 테스트"""
    print("=" * 70)
    print("[TEST 1] 채용공고 분석")
    print("=" * 70)
    
    job_posting = """
    [삼성전자 AI/ML 엔지니어 채용]
    
    주요 업무:
    - AI/ML 모델 개발 및 최적화
    - 데이터 파이프라인 구축
    - 딥러닝 기반 서비스 개발
    
    자격요건:
    - Python, TensorFlow/PyTorch 경험
    - 3년 이상의 ML 관련 경험
    
    우대사항:
    - NLP, Computer Vision 경험
    - AWS, GCP 클라우드 경험
    
    인재상:
    - 끊임없는 도전 정신
    - 팀워크와 협업 능력
    """
    
    adapter = OpenAILLMAdapter()
    analysis = await adapter.analyze_job_posting(
        company_name="삼성전자",
        position="AI/ML 엔지니어",
        job_posting=job_posting
    )
    
    print("\n[OK] 채용공고 분석 완료")
    print(f"키워드: {', '.join(analysis.get('keywords', []))}")
    
    return analysis


async def test_cover_letter_generation(job_analysis: dict):
    """고도화된 자소서 생성 테스트"""
    print("\n" + "=" * 70)
    print("[TEST 2] 고도화된 자소서 생성")
    print("=" * 70)
    
    coverletter = load_test_data("my_coverletter.txt")
    if not coverletter:
        print("[SKIP] my_coverletter.txt 없음")
        return
    
    adapter = OpenAILLMAdapter()
    blocks = await adapter.extract_blocks_from_cover_letter(
        question="자기소개서",
        essay=coverletter[:5000]
    )
    
    block_contents = [b.get("content", "") for b in blocks]
    print(f"\n[INFO] 추출된 블록 수: {len(block_contents)}")
    
    cover_letter = await adapter.generate_cover_letter(
        question="지원 동기와 입사 후 포부를 작성해주세요.",
        blocks=block_contents,
        job_analysis=job_analysis,
        char_limit=800,
        company_name="삼성전자",
        position="AI/ML 엔지니어"
    )
    
    print(f"\n[OK] 생성된 자기소개서:\n")
    print("-" * 50)
    print(cover_letter)
    print("-" * 50)
    print(f"\n글자 수: {len(cover_letter)}자")
    
    # 결과 저장
    output_path = Path(__file__).parent / "test_data" / "generated_enhanced.txt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"문항: 지원 동기와 입사 후 포부\n글자수: {len(cover_letter)}자\n\n{cover_letter}")
    print(f"[SAVED] {output_path}")


async def main():
    print("\n" + "=" * 70)
    print("    LangChain 고도화 테스트")
    print("=" * 70 + "\n")
    
    try:
        analysis = await test_job_posting_analysis()
        await test_cover_letter_generation(analysis)
        print("\n[SUCCESS] 모든 테스트 완료!")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
