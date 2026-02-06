"""간단한 API 테스트 스크립트

AI 서버의 각 엔드포인트를 빠르게 테스트합니다.
서버가 실행 중이어야 합니다: uvicorn src.adapters.inbound.rest.main:app --port 8000

사용법:
    python scripts/test/test_api_simple.py [엔드포인트]

엔드포인트:
    - smart: /api/ai/cover-letters/smart
    - selected: /api/ai/cover-letters/selected
    - refine: /api/ai/cover-letters/refine
    - health: /health
"""

import asyncio
import json
import sys


# 테스트 데이터
BASE_URL = "http://localhost:8000"

SAMPLE_QUESTION = "팀 프로젝트에서 어려움을 극복한 경험에 대해 작성해주세요."

SAMPLE_BLOCKS = [
    {
        "id": "1",
        "content": """AI 해커톤에서 Vision 분야 AI 개발을 맡게 되었습니다.
새로운 기술에 대한 도전을 두려워하지 않고 OpenCV, YOLOv8을 독학했습니다.
24시간 중 16시간 만에 핵심 기능을 구현하여 120개팀 중 3위를 달성했습니다.""",
        "category": "도전/성장"
    },
    {
        "id": "2",
        "content": """PM으로서 팀의 기술적 난관을 협업으로 해결했습니다.
RAG 성능 이슈 발생 시 스터디를 조직하여 하이브리드 서치 방식을 적용했고,
검색 정확도를 크게 개선하여 프로젝트를 성공적으로 완료했습니다.""",
        "category": "협업/리더십"
    }
]

SAMPLE_COVER_LETTERS = [
    {
        "id": "1",
        "content": """저는 준비하는 자세를 갖추고 있습니다.
해커톤 전 2주간 매일 4시간씩 YOLOv8 문서를 분석하며 철저히 준비했습니다.
이러한 준비성 덕분에 어려운 상황에서도 좋은 성과를 낼 수 있었습니다."""
    }
]


async def test_health():
    """헬스 체크"""
    import httpx

    print("🏥 Health Check...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/health")
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
        return response.status_code == 200


async def test_selected_endpoint():
    """Selected 엔드포인트 테스트"""
    import httpx

    print("\n📝 Testing /api/ai/cover-letters/selected...")

    request_data = {
        "user_id": "test_user",
        "question": SAMPLE_QUESTION,
        "company_name": "삼성전자",
        "position": "소프트웨어 엔지니어",
        "blocks": SAMPLE_BLOCKS,
        "cover_letters": SAMPLE_COVER_LETTERS,
        "char_limit": 800,
        "model_type": "gpt"
    }

    print(f"  Request:")
    print(f"    - question: {request_data['question'][:50]}...")
    print(f"    - blocks: {len(request_data['blocks'])}개")
    print(f"    - char_limit: {request_data['char_limit']}자")
    print()

    content = ""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                "POST",
                f"{BASE_URL}/api/ai/cover-letters/selected",
                json=request_data
            ) as response:
                print(f"  Response Status: {response.status_code}")

                if response.status_code != 200:
                    body = await response.aread()
                    print(f"  Error: {body.decode()}")
                    return False

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break

                        try:
                            event = json.loads(data)
                            event_type = event.get("event", "")

                            if event_type == "step_start":
                                print(f"    🔄 {event.get('message', '')}")
                            elif event_type == "step_complete":
                                step_data = event.get("data", {})
                                if "content" in step_data:
                                    content = step_data["content"]
                                print(f"    ✅ {event.get('step', '')} 완료")
                            elif event_type == "done":
                                content = event.get("content", content)
                                print(f"    🎉 완료! ({len(content)}자)")
                            elif event_type == "error":
                                print(f"    ❌ {event.get('message', '')}")
                        except json.JSONDecodeError:
                            pass

        print(f"\n  📏 결과: {len(content)}자 생성됨")
        if content:
            print(f"\n  📄 내용 (처음 300자):")
            print(f"  {content[:300]}...")
        return len(content) > 0

    except httpx.ConnectError:
        print("  ❌ 서버 연결 실패. 서버가 실행 중인지 확인하세요.")
        return False
    except Exception as e:
        print(f"  ❌ 에러: {e}")
        return False


async def test_smart_endpoint():
    """Smart 엔드포인트 테스트"""
    import httpx

    print("\n🤖 Testing /api/ai/cover-letters/smart...")

    request_data = {
        "user_id": "test_user",
        "question": SAMPLE_QUESTION,
        "company_name": "카카오",
        "position": "백엔드 개발자",
        "blocks": SAMPLE_BLOCKS,
        "cover_letters": SAMPLE_COVER_LETTERS,
        "char_limit": 800,
        "model_type": "gpt"
    }

    content = ""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                "POST",
                f"{BASE_URL}/api/ai/cover-letters/smart",
                json=request_data
            ) as response:
                print(f"  Response Status: {response.status_code}")

                if response.status_code != 200:
                    return False

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        try:
                            event = json.loads(data)
                            if event.get("event") == "done":
                                content = event.get("content", "")
                        except:
                            pass

        print(f"  📏 결과: {len(content)}자 생성됨")
        return len(content) > 0

    except httpx.ConnectError:
        print("  ❌ 서버 연결 실패")
        return False
    except Exception as e:
        print(f"  ❌ 에러: {e}")
        return False


async def test_refine_endpoint():
    """Refine 엔드포인트 테스트"""
    import httpx

    print("\n🔧 Testing /api/ai/cover-letters/refine...")

    request_data = {
        "user_id": "test_user",
        "question": "본인의 강점에 대해 작성해주세요.",
        "original_content": """저는 도전적인 사람입니다. 해커톤에서 3등을 했습니다.
열심히 노력해서 좋은 결과를 얻었습니다. 앞으로도 열심히 하겠습니다.""",
        "feedback": "너무 짧고 구체적이지 않습니다. 어떤 해커톤인지, 구체적인 기술 스택과 역할을 언급하며 500자 이상으로 늘려주세요.",
        "company_name": "네이버",
        "position": "프론트엔드 개발자",
        "char_limit": 600,
        "model_type": "gpt"
    }

    content = ""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                "POST",
                f"{BASE_URL}/api/ai/cover-letters/refine",
                json=request_data
            ) as response:
                print(f"  Response Status: {response.status_code}")

                if response.status_code != 200:
                    return False

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        try:
                            event = json.loads(data)
                            if event.get("event") == "done":
                                content = event.get("content", "")
                        except:
                            pass

        print(f"  📏 결과: {len(content)}자 생성됨 (원본: {len(request_data['original_content'])}자)")
        return len(content) > 0

    except httpx.ConnectError:
        print("  ❌ 서버 연결 실패")
        return False
    except Exception as e:
        print(f"  ❌ 에러: {e}")
        return False


async def main():
    """메인 함수"""
    print("=" * 60)
    print("  AI 서버 API 테스트")
    print("=" * 60)

    endpoint = sys.argv[1] if len(sys.argv) > 1 else "all"

    results = {}

    if endpoint in ["health", "all"]:
        results["health"] = await test_health()

    if endpoint in ["selected", "all"]:
        results["selected"] = await test_selected_endpoint()

    if endpoint in ["smart", "all"]:
        results["smart"] = await test_smart_endpoint()

    if endpoint in ["refine", "all"]:
        results["refine"] = await test_refine_endpoint()

    # 결과 요약
    print("\n" + "=" * 60)
    print("  테스트 결과 요약")
    print("=" * 60)

    for name, passed in results.items():
        status = "✅ 통과" if passed else "❌ 실패"
        print(f"  {name}: {status}")


if __name__ == "__main__":
    try:
        import httpx
    except ImportError:
        print("httpx 패키지가 필요합니다.")
        print("설치: pip install httpx")
        sys.exit(1)

    asyncio.run(main())
