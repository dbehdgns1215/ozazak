"""자기소개서 생성 품질 테스트 스크립트"""
import asyncio
import json
from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.adapters.outbound.llm.chains.smart_generation_chain import SmartGenerationChain

# 테스트 데이터
TEST_BLOCKS = [
    {
        "id": 1,
        "title": "SSAFY 공통프로젝트 - WebRTC 화상회의",
        "content": "6인 팀 프로젝트로 WebRTC를 활용한 화상회의 시스템을 개발했습니다. 저는 백엔드 팀장으로 Spring Boot와 Kurento Media Server를 연동하여 실시간 영상 스트리밍 기능을 구현했습니다. 초기에는 다중 사용자 연결 시 지연이 발생하는 문제가 있었으나, SFU 방식으로 아키텍처를 변경하고 Redis를 활용한 세션 관리를 도입하여 동시 접속자 100명 기준 지연율을 70%에서 15%로 개선했습니다.",
        "categories": ["PROJECT", "LEADERSHIP", "PROBLEM_SOLVING"]
    },
    {
        "id": 2,
        "title": "알고리즘 스터디 운영",
        "content": "3개월간 알고리즘 스터디를 주도적으로 운영하며 10명의 팀원과 함께 백준 골드 티어 달성을 목표로 학습했습니다. 매주 2회 온라인 모임을 진행하며 문제 풀이 공유 및 코드 리뷰를 실시했고, 노션으로 학습 자료를 체계적으로 정리하여 팀원들의 학습 효율을 높였습니다. 그 결과 스터디 종료 시점에 전원이 골드 티어를 달성했습니다.",
        "categories": ["TEAMWORK", "LEADERSHIP"]
    },
    {
        "id": 3,
        "title": "개인 프로젝트 - 맛집 추천 앱",
        "content": "Flutter와 Firebase를 활용하여 위치 기반 맛집 추천 모바일 앱을 개발했습니다. Google Maps API를 연동하여 사용자 위치 기반 주변 맛집 정보를 제공하고, Firebase Firestore를 활용한 실시간 리뷰 시스템을 구현했습니다. 앱 스토어에 배포 후 100+ 다운로드를 달성했습니다.",
        "categories": ["PROJECT", "SELF_DIRECTED"]
    }
]

TEST_COVER_LETTERS = [
    {
        "id": 1,
        "company": "네이버",
        "question": "지원동기",
        "content": "저는 사용자 중심의 서비스를 만드는 네이버의 철학에 깊이 공감하여 지원하게 되었습니다. SSAFY에서 다양한 프로젝트를 진행하며 사용자 경험의 중요성을 깨달았고, 특히 WebRTC 프로젝트에서 실시간 통신 기술을 다루며 네이버의 라인, 밴드와 같은 서비스에 기여하고 싶다는 목표를 갖게 되었습니다."
    }
]

TEST_JOB_ANALYSIS = {
    "responsibilities": [
        "웹 서비스 백엔드 개발",
        "마이크로서비스 아키텍처 설계 및 구현",
        "대용량 트래픽 처리"
    ],
    "requirements": [
        "Java/Spring Boot 프레임워크 경험",
        "REST API 설계 및 개발 경험",
        "데이터베이스 설계 경험"
    ],
    "preferred_qualifications": [
        "MSA 아키텍처 경험",
        "Redis, Kafka 등 오픈소스 활용 경험",
        "팀 프로젝트 리더 경험"
    ],
    "ideal_candidate": "능동적으로 문제를 해결하고 팀과 협업할 수 있는 인재",
    "yearly_goals": "글로벌 시장 확대 및 AI 기술 도입"
}

async def test_smart_generation():
    """스마트 생성 테스트"""
    print("=" * 80)
    print("🤖 AI 자기소개서 생성 품질 테스트")
    print("=" * 80)
    print()

    # LLM 어댑터 생성
    print("📝 테스트 설정:")
    print(f"  - 모델: gemini-flash")
    print(f"  - 기업: 삼성전자")
    print(f"  - 직무: 소프트웨어 엔지니어")
    print(f"  - 문항: 팀 프로젝트에서 어려움을 극복한 경험을 작성해주세요")
    print(f"  - 글자수 제한: 800자")
    print()

    llm_adapter = get_llm_adapter("gemini-flash")
    smart_chain = SmartGenerationChain(llm_adapter.llm)

    question = "팀 프로젝트에서 어려움을 극복한 경험을 작성해주세요"
    company_name = "삼성전자"
    position = "소프트웨어 엔지니어"
    char_limit = 800

    print("🔄 생성 중...")
    print("-" * 80)

    # 스트리밍으로 생성
    full_response = ""
    async for chunk in smart_chain.stream(
        question=question,
        company_name=company_name,
        position=position,
        blocks=TEST_BLOCKS,
        cover_letters=TEST_COVER_LETTERS,
        job_analysis=TEST_JOB_ANALYSIS,
        char_limit=char_limit
    ):
        print(chunk, end='', flush=True)
        full_response += chunk

    print()
    print("-" * 80)
    print()

    # 응답 파싱
    parsed = smart_chain._parse_response(full_response)
    selected_blocks = parsed.get("selected_blocks", [])
    selected_cover_letters = parsed.get("selected_cover_letters", [])
    content = parsed.get("content", "")

    # 결과 분석
    print("📊 생성 결과 분석:")
    print(f"  - 선택된 블록: {selected_blocks}")
    print(f"  - 선택된 자소서: {selected_cover_letters}")
    print(f"  - 생성된 글자 수: {len(content)}자 (목표: {char_limit}자)")
    print(f"  - 글자 수 달성률: {len(content) / char_limit * 100:.1f}%")
    print()

    # 품질 평가
    print("✅ 품질 평가:")
    checks = {
        "글자 수 제한 준수": 0.8 * char_limit <= len(content) <= 1.2 * char_limit,
        "블록 선택 여부": len(selected_blocks) > 0,
        "내용 생성 완료": len(content) > 100,
        "구조화된 응답": "[선택된 자료]" in full_response and "[자기소개서]" in full_response
    }

    for check_name, passed in checks.items():
        status = "✓" if passed else "✗"
        print(f"  {status} {check_name}")

    print()
    print("=" * 80)
    print("✨ 테스트 완료!")
    print("=" * 80)


async def test_selected_generation():
    """선택 생성 테스트"""
    print()
    print("=" * 80)
    print("🎯 선택된 블록으로 생성 테스트")
    print("=" * 80)
    print()

    llm_adapter = get_llm_adapter("gemini-flash")

    question = "지원동기를 작성해주세요"
    company_name = "카카오"
    position = "백엔드 개발자"

    # 블록 1번만 사용
    selected_blocks = [TEST_BLOCKS[0]["content"]]

    print(f"📝 선택된 블록: {TEST_BLOCKS[0]['title']}")
    print()
    print("🔄 생성 중...")
    print("-" * 80)

    full_response = ""
    async for chunk in llm_adapter.stream_cover_letter(
        question=question,
        blocks=selected_blocks,
        company_name=company_name,
        position=position,
        char_limit=600
    ):
        print(chunk, end='', flush=True)
        full_response += chunk

    print()
    print("-" * 80)
    print()
    print(f"✅ 생성 완료 ({len(full_response)}자)")
    print()


if __name__ == "__main__":
    print()
    print("🚀 자기소개서 AI 생성 품질 테스트 시작")
    print()

    # 환경 변수 확인
    import os
    from src.config.settings import settings

    if not settings.gms_api_key:
        print("⚠️  경고: GMS_API_KEY가 설정되지 않았습니다.")
        print("   .env 파일에 GMS_API_KEY를 추가해주세요.")
        exit(1)

    # 테스트 실행
    asyncio.run(test_smart_generation())
    asyncio.run(test_selected_generation())
