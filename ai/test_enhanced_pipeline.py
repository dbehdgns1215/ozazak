"""Enhanced Pipeline 통합 테스트"""
import asyncio
import httpx
import json


async def test_enhanced_stream():
    """Enhanced 자기소개서 생성 스트리밍 테스트"""
    
    # 테스트 데이터
    request_data = {
        "user_id": "test_user",
        "question": "귀사에 지원하게 된 동기와 입사 후 어떻게 기여하고 싶은지 작성해주세요.",
        "blocks": [
            "삼성전자 소프트웨어 개발팀에서 6개월간 인턴 경험을 통해 AI 기반 추천 시스템 개발에 참여했습니다. Python과 TensorFlow를 활용해 사용자 행동 분석 모델을 구현하여 클릭률 15% 향상에 기여했습니다.",
            "대학교 졸업 프로젝트로 자연어 처리 기반 채용 공고 매칭 시스템을 개발했습니다. KoBERT 모델을 fine-tuning하여 이력서와 채용공고 간의 적합도를 분석하는 시스템을 구현했습니다."
        ],
        "company_name": "녹십자웰빙",
        "position": "병의원영업",
        "poster_url": None,  # URL이 없는 경우
        "fallback_content": """
        [담당업무]
        - 병/의원 대상 자사 건강기능식품 및 의약외품 영업
        - 거래처 관리 및 신규 거래처 개발
        - 영업 실적 분석 및 리포트 작성
        
        [자격요건]
        - 학력: 대졸 이상
        - 경력: 신입/경력
        - 운전면허 소지자
        
        [우대사항]
        - 영양사, 운동처방사 등 관련 자격증 소지자
        - 건강기능식품 영업 경험자
        - 병의원 영업 경험자
        """,
        "char_limit": 500,
        "model_type": "gemini-flash"
    }
    
    print("=" * 60)
    print("Enhanced 자기소개서 생성 스트리밍 테스트")
    print("=" * 60)
    print(f"기업: {request_data['company_name']}")
    print(f"직무: {request_data['position']}")
    print(f"문항: {request_data['question'][:50]}...")
    print("=" * 60)
    print()
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream(
            "POST",
            "http://localhost:8000/api/ai/cover-letters/generate/enhanced/stream",
            json=request_data
        ) as response:
            if response.status_code != 200:
                print(f"Error: {response.status_code}")
                print(await response.aread())
                return
            
            full_content = ""
            
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    
                    if data == "[DONE]":
                        print("\n" + "=" * 60)
                        print("✅ 생성 완료!")
                        break
                    
                    try:
                        event = json.loads(data)
                        event_type = event.get("event", "")
                        
                        if event_type == "step_start":
                            print(f"\n🔄 {event.get('message', '')}")
                        
                        elif event_type == "step_complete":
                            step = event.get("step", "")
                            step_data = event.get("data", {})
                            success = step_data.get("success", False)
                            print(f"   {'✅' if success else '⚠️'} {step} 완료: {step_data}")
                        
                        elif event_type == "thinking":
                            print(f"   {event.get('message', '')}")
                        
                        elif event_type == "content":
                            chunk = event.get("chunk", "")
                            print(chunk, end="", flush=True)
                            full_content += chunk
                        
                        elif event_type == "done":
                            print(f"\n\n📊 최종 결과: {event.get('data', {})}")
                        
                        elif event_type == "error":
                            print(f"\n❌ 에러: {event.get('message', '')}")
                    
                    except json.JSONDecodeError:
                        pass
    
    print()
    print("=" * 60)
    print(f"생성된 내용 길이: {len(full_content)}자")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_enhanced_stream())
