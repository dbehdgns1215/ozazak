"""LangGraph 파이프라인 독립 테스트 스크립트

백엔드 없이 AI 서버의 LangGraph 파이프라인을 직접 테스트합니다.

사용법:
    python scripts/test/test_langgraph_pipeline.py [테스트타입]

테스트 타입:
    - pipeline: LangGraph 파이프라인 직접 테스트 (기본값)
    - api: API 엔드포인트 테스트
    - all: 전체 테스트
"""

import asyncio
import sys
import logging
from pathlib import Path

# 프로젝트 루트를 path에 추가
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from src.config.settings import settings
from src.adapters.outbound.llm.llm_factory import get_llm_adapter
from src.adapters.outbound.tools.validator import CharacterCountValidator

# 로깅 설정 (WARNING으로 설정하여 불필요한 로그 숨김)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
# 테스트 스크립트 자체 로그는 INFO로 유지
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# httpx, faiss 등 외부 라이브러리 로그 숨김
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("faiss").setLevel(logging.WARNING)


# ==================== 테스트 데이터 ====================

TEST_QUESTION = "팀 프로젝트에서 어려움을 극복한 경험을 작성해주세요."

TEST_BLOCKS = [
    """미래에셋증권 공모전에서 RAG와 VectorDB 기반 주식 추천 서비스를 개발하며 기술적 난관을 협업으로 극복한 경험이 있습니다.
프로젝트의 핵심인 RAG 검색 성능이 예상보다 저조하여 팀 전체가 어려움을 겪었습니다.
저는 PM으로서 RAG 담당자에게만 책임을 맡기지 않고, 다른 AI 팀원들과 함께 단기간 스터디를 조직하여 문제 해결에 동참했습니다.
스터디를 통해 하이브리드 서치와 메타 데이터 활용법을 빠르게 익혔고, 기존의 단순 뉴스 유사도 검색 로직에 주가 상승률 데이터를 결합한 새로운 검색 기준을 제안하여 정확도를 획기적으로 개선했습니다.""",

    """AI 해커톤에 참여했을 때, 저는 익숙하지 않던 Vision(시각) 영역 AI 개발을 맡게 되었습니다.
하지만 저는 새로운 기술을 배울 기회로 삼았고, 대회 전부터 OpenCV, YOLOv8, GPT-API 등을 독학하며 철저히 준비했습니다.
대회 당일, 팀의 유일한 AI 개발자로서 24시간 중 16시간 만에 데이터 전처리부터 모델 학습, 파이프라인 구축까지 핵심 기능을 모두 구현했습니다.
그 결과 120개 참가팀 중 3위라는 우수한 성과를 거두었고, 새로운 분야에 대한 두려움을 극복하고 성공을 경험하며 큰 자신감을 얻었습니다.""",

    """에어비앤비 매출 증대 프로젝트에서 신규 호스트의 낮은 참여도와 높은 이탈률이 플랫폼 성장의 핵심 병목임을 데이터 분석을 통해 발견했습니다.
이 문제를 해결하고자 YOLOv8, SAM, CLIP 등 다양한 모델을 결합하여 '숙소 품질 자동 진단 및 개선 가이드 툴'을 개발했습니다.
A/B 테스트 결과, 개선된 사진과 설명은 기존 대비 각각 75%, 72.5% 높은 선호도를 기록하며 실질적인 비즈니스 임팩트를 증명했습니다."""
]

TEST_REFERENCE_LETTER = """저는 대학 시절 봉사활동으로 지역 노인복지관에서 어르신들의 금융업무를 도와드리며 은행업에 관심을 갖게 되었습니다.
디지털 기반으로 모든 고객에게 친근하게 다가가는 최고의 은행이 되겠다는 목표에 공감하여 지원하게 되었습니다.

저의 강점은 철저한 준비성입니다. 이전 해커톤에서 처음 맡은 객체 인식 분야였지만,
2주 준비기간 동안 매일 4시간씩 YOLOv8 문서를 분석하며 알고리즘 원리부터 파라미터 튜닝까지 기본기를 다졌습니다.
반면 완벽을 추구하다 일정 관리에 어려움을 겪은 경험이 있습니다.
이를 보완하기 위해, 이후 노션으로 '필수 요구사항'과 '추가 개선사항'을 구분하고 우선순위와 데드라인을 관리하며 개선했습니다."""

TEST_COMPANY_NAME = "삼성전자"
TEST_POSITION = "소프트웨어 엔지니어"
TEST_CHAR_LIMIT = 800


# ==================== 테스트 함수 ====================

def print_header(text: str, char: str = "="):
    """헤더 출력"""
    print(f"\n{char * 70}")
    print(f"  {text}")
    print(f"{char * 70}\n")


def print_result(success: bool, content: str, char_limit: int):
    """결과 출력"""
    validator = CharacterCountValidator()
    validation = validator.run(content, char_limit)

    print(f"\n{'─' * 50}")
    print(f"결과:")
    print(f"  - 성공 여부: {'✅ 성공' if success else '❌ 실패'}")
    print(f"  - 생성된 글자 수: {len(content)}자 (목표: {char_limit}자)")
    print(f"  - 검증: {validation['status']} ({validation['message']})")
    print(f"{'─' * 50}")

    if content:
        print(f"\n생성된 내용 (처음 500자):")
        print(f"{content[:500]}...")

    return validation


async def test_pipeline_direct():
    """LangGraph 파이프라인 직접 테스트"""
    print_header("1. LangGraph 파이프라인 직접 테스트")

    # 환경 변수 확인
    if not settings.gms_api_key:
        print("❌ GMS_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.")
        return False

    print(f"📝 테스트 설정:")
    print(f"  - 기업: {TEST_COMPANY_NAME}")
    print(f"  - 직무: {TEST_POSITION}")
    print(f"  - 문항: {TEST_QUESTION}")
    print(f"  - 글자수 제한: {TEST_CHAR_LIMIT}자")
    print(f"  - 블록 수: {len(TEST_BLOCKS)}개")
    print()

    # LLM 어댑터 가져오기
    llm_adapter = get_llm_adapter("gpt")  # 또는 "gemini", "gemini-flash"

    # 파이프라인 가져오기
    from src.adapters.outbound.llm.chains.pipelines.enhanced_pipeline import EnhancedCoverLetterPipeline
    pipeline = EnhancedCoverLetterPipeline(llm_adapter.llm, settings.serper_api_key)

    print("🔄 파이프라인 실행 중...")

    try:
        # run() 메서드로 직접 실행
        result = await pipeline.run(
            question=TEST_QUESTION,
            blocks=TEST_BLOCKS,
            company_name=TEST_COMPANY_NAME,
            position=TEST_POSITION,
            poster_url=None,
            fallback_content="소프트웨어 엔지니어 채용",
            char_limit=TEST_CHAR_LIMIT,
            reference_letter=TEST_REFERENCE_LETTER
        )

        content = result.content
        print_result(True, content, TEST_CHAR_LIMIT)
        return True

    except Exception as e:
        logger.error(f"파이프라인 실행 실패: {e}")
        print(f"❌ 에러: {e}")
        return False


async def test_pipeline_with_events():
    """LangGraph 파이프라인 이벤트 스트리밍 테스트"""
    print_header("2. LangGraph 파이프라인 이벤트 스트리밍 테스트")

    if not settings.gms_api_key:
        print("❌ GMS_API_KEY가 설정되지 않았습니다.")
        return False

    llm_adapter = get_llm_adapter("gpt")

    from src.adapters.outbound.llm.chains.pipelines.enhanced_pipeline import EnhancedCoverLetterPipeline
    pipeline = EnhancedCoverLetterPipeline(llm_adapter.llm, settings.serper_api_key)

    print("🔄 이벤트 스트리밍 실행 중...")
    print()

    content = ""
    try:
        async for event in pipeline.run_with_events(
            question=TEST_QUESTION,
            blocks=TEST_BLOCKS,
            company_name=TEST_COMPANY_NAME,
            position=TEST_POSITION,
            poster_url=None,
            fallback_content="소프트웨어 엔지니어 채용",
            char_limit=TEST_CHAR_LIMIT,
            reference_letter=TEST_REFERENCE_LETTER
        ):
            event_type = event.get("event")
            step = event.get("step", "")
            message = event.get("message", "")

            if event_type == "step_start":
                print(f"  🔄 [{step}] {message}")
            elif event_type == "step_complete":
                data = event.get("data", {})
                print(f"  ✅ [{step}] 완료 - {data}")
            elif event_type == "validation":
                data = event.get("data", {})
                print(f"  📊 [검증] {data}")
            elif event_type == "done":
                content = event.get("content", "")
                print(f"  🎉 완료! 글자 수: {len(content)}자")
            elif event_type == "error":
                print(f"  ❌ 에러: {event.get('message')}")

        if content:
            print_result(True, content, TEST_CHAR_LIMIT)
            return True
        else:
            print("❌ 내용이 생성되지 않았습니다.")
            return False

    except Exception as e:
        logger.error(f"이벤트 스트리밍 실패: {e}")
        print(f"❌ 에러: {e}")
        return False


async def test_api_endpoint():
    """API 엔드포인트 테스트 (서버가 실행 중이어야 함)"""
    print_header("3. API 엔드포인트 테스트")

    try:
        import httpx
    except ImportError:
        print("❌ httpx가 설치되지 않았습니다. pip install httpx")
        return False

    request_data = {
        "user_id": "test_user",
        "question": TEST_QUESTION,
        "company_name": TEST_COMPANY_NAME,
        "position": TEST_POSITION,
        "poster_url": None,
        "fallback_content": "소프트웨어 엔지니어 채용",
        "blocks": [{"content": b, "category": "경험"} for b in TEST_BLOCKS],
        "cover_letters": [{"content": TEST_REFERENCE_LETTER}],
        "char_limit": TEST_CHAR_LIMIT,
        "model_type": "gpt"
    }

    print(f"📡 API 요청 (localhost:8000)")
    print(f"  - 엔드포인트: /api/ai/cover-letters/selected")
    print()

    content = ""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                "POST",
                "http://localhost:8000/api/ai/cover-letters/selected",
                json=request_data
            ) as response:
                if response.status_code != 200:
                    print(f"❌ HTTP Error: {response.status_code}")
                    return False

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break

                        try:
                            import json
                            event = json.loads(data)
                            event_type = event.get("event", "")

                            if event_type == "step_start":
                                print(f"  🔄 {event.get('message', '')}")
                            elif event_type == "step_complete":
                                print(f"  ✅ {event.get('step', '')} 완료")
                            elif event_type == "done":
                                print(f"  🎉 완료!")
                                content = event.get("content", "")
                        except:
                            pass

        if content:
            print_result(True, content, TEST_CHAR_LIMIT)
            return True
        else:
            print("❌ 내용이 생성되지 않았습니다.")
            return False

    except httpx.ConnectError:
        print("❌ 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.")
        print("   실행 명령: uvicorn src.adapters.inbound.rest.main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"❌ 에러: {e}")
        return False


async def test_use_case():
    """Use Case 레벨 테스트"""
    print_header("4. Use Case 레벨 테스트")

    from src.application.use_cases.generate_cover_letter import GenerateSelectedCoverLetterUseCase
    from src.application.dtos.requests import SelectedGenerationRequestDTO
    from src.adapters.outbound.api.spring_client import SpringBackendAdapter

    llm_adapter = get_llm_adapter("gpt")
    backend_adapter = SpringBackendAdapter()

    use_case = GenerateSelectedCoverLetterUseCase(llm_adapter, backend_adapter)

    request = SelectedGenerationRequestDTO(
        user_id="test_user",
        question=TEST_QUESTION,
        company_name=TEST_COMPANY_NAME,
        position=TEST_POSITION,
        blocks=[{"content": b} for b in TEST_BLOCKS],
        cover_letters=[{"content": TEST_REFERENCE_LETTER}],
        char_limit=TEST_CHAR_LIMIT,
        save_to_backend=False
    )

    print("🔄 Use Case 실행 중...")

    content = ""
    try:
        async for event in use_case.execute(request):
            event_type = getattr(event, 'event', None) or event.__class__.__name__

            if hasattr(event, 'step'):
                print(f"  [{event_type}] {event.step}: {getattr(event, 'message', '')}")
            elif hasattr(event, 'success'):
                print(f"  [{event_type}] 완료!")

            # step_complete에서 content 추출
            if hasattr(event, 'data') and isinstance(event.data, dict):
                if 'content' in event.data:
                    content = event.data['content']

        if content:
            print_result(True, content, TEST_CHAR_LIMIT)
            return True
        else:
            print("❌ 내용이 생성되지 않았습니다.")
            return False

    except Exception as e:
        logger.error(f"Use Case 실행 실패: {e}")
        print(f"❌ 에러: {e}")
        return False


async def run_all_tests():
    """전체 테스트 실행"""
    print_header("🧪 LangGraph 파이프라인 테스트", "▓")

    results = {}

    # 1. 파이프라인 직접 테스트
    results["pipeline_direct"] = await test_pipeline_direct()

    await asyncio.sleep(1)

    # 2. 이벤트 스트리밍 테스트
    results["pipeline_events"] = await test_pipeline_with_events()

    await asyncio.sleep(1)

    # 3. Use Case 테스트
    results["use_case"] = await test_use_case()

    await asyncio.sleep(1)

    # 4. API 테스트 (서버 실행 여부에 따라)
    results["api"] = await test_api_endpoint()

    # 결과 요약
    print_header("📊 테스트 결과 요약")

    for test_name, passed in results.items():
        status = "✅ 통과" if passed else "❌ 실패"
        print(f"  {test_name}: {status}")

    total = len(results)
    passed = sum(1 for v in results.values() if v)
    print(f"\n총 {total}개 중 {passed}개 통과")


# ==================== 메인 ====================

if __name__ == "__main__":
    test_type = sys.argv[1] if len(sys.argv) > 1 else "pipeline"

    if test_type == "pipeline":
        asyncio.run(test_pipeline_direct())
    elif test_type == "events":
        asyncio.run(test_pipeline_with_events())
    elif test_type == "api":
        asyncio.run(test_api_endpoint())
    elif test_type == "usecase":
        asyncio.run(test_use_case())
    elif test_type == "all":
        asyncio.run(run_all_tests())
    else:
        print(f"알 수 없는 테스트 타입: {test_type}")
        print("사용 가능한 옵션: pipeline, events, api, usecase, all")
