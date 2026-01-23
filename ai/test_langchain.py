"""
간단한 테스트 스크립트
실제 OpenAI API를 호출하여 LangChain 연동을 테스트합니다.
"""
import asyncio
import sys
import os

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from dotenv import load_dotenv
load_dotenv()

from src.adapters.outbound.llm.openai_adapter import OpenAILLMAdapter


async def test_block_extraction():
    """블록 추출 테스트"""
    print("=" * 60)
    print("블록 추출 테스트")
    print("=" * 60)
    
    adapter = OpenAILLMAdapter()
    
    # 샘플 프로젝트 정보
    project_info = """
    프로젝트명: AI 자기소개서 작성 보조 도구
    
    기술 스택: Python, FastAPI, LangChain, OpenAI GPT-4, Docker
    
    담당 역할: 백엔드 개발 및 LangChain 통합
    - FastAPI를 사용한 RESTful API 설계 및 구현
    - LangChain을 활용한 GPT-4 연동 및 프롬프트 엔지니어링
    - 헥사고날 아키텍처 적용으로 유지보수성 향상
    
    주요 성과:
    - 자기소개서 작성 시간 80% 단축
    - 사용자 만족도 4.5/5.0
    - 블록 재사용률 70% 달성
    """
    
    blocks = await adapter.extract_blocks_from_project(project_info)
    
    print(f"\n추출된 블록 수: {len(blocks)}\n")
    for i, block in enumerate(blocks, 1):
        print(f"블록 {i}:")
        print(f"  카테고리: {block.get('category')}")
        print(f"  내용: {block.get('content')}")
        print(f"  키워드: {', '.join(block.get('keywords', []))}")
        print()


async def test_cover_letter_generation():
    """자기소개서 생성 테스트"""
    print("=" * 60)
    print("자기소개서 생성 테스트")
    print("=" * 60)
    
    adapter = OpenAILLMAdapter()
    
    # 샘플 문항
    question = "지원 동기와 입사 후 포부를 작성해주세요. (500-800자)"
    
    # 샘플 블록들
    blocks = [
        "Python과 FastAPI를 활용하여 RESTful API를 설계하고 구현한 경험이 있습니다. 특히 헥사고날 아키텍처를 적용하여 유지보수성을 크게 향상시켰습니다.",
        "LangChain 프레임워크를 도입하여 GPT-4와의 효율적인 통합을 구현했습니다. 프롬프트 엔지니어링을 통해 응답 품질을 개선하고 사용자 만족도를 4.5/5.0까지 높였습니다.",
        "팀 프로젝트에서 백엔드 개발을 주도하며 협업 능력을 발휘했습니다. Docker를 활용한 컨테이너화로 배포 효율성을 30% 향상시켰습니다."
    ]
    
    # 참고 자료 (선택)
    references = [
        "저는 항상 새로운 기술을 학습하고 프로젝트에 적용하는 것을 즐깁니다. 특히 AI 기술의 실용적인 활용에 관심이 많아 다양한 프로젝트를 진행해왔습니다."
    ]
    
    cover_letter = await adapter.generate_cover_letter(
        question=question,
        blocks=blocks,
        references=references
    )
    
    print(f"\n생성된 자기소개서:\n")
    print(cover_letter)
    print(f"\n글자 수: {len(cover_letter)}")


async def main():
    """메인 함수"""
    try:
        # 블록 추출 테스트
        await test_block_extraction()
        
        print("\n" + "=" * 60 + "\n")
        
        # 자기소개서 생성 테스트
        await test_cover_letter_generation()
        
        print("\n" + "=" * 60)
        print("✅ 모든 테스트 완료!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
