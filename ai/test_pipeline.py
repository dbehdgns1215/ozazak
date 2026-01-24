"""종합 테스트 파이프라인 - 녹십자웰빙 병의원영업 자소서 생성 테스트

테스트 항목:
1. 모든 모델 테스트 (GPT, Gemini, Gemini-Flash, Claude)
2. smart/stream과 selected/stream 두 가지 API 테스트
3. 실시간 스트리밍 시각화
4. 5개 문항에 대한 자기소개서 생성
5. 글자 수 검증 (CharacterCountValidator)
"""
import asyncio
import httpx
import json
import sys
from datetime import datetime

# 프로젝트 경로 추가
sys.path.insert(0, ".")
from src.adapters.outbound.tools.validator import CharacterCountValidator

# Validator 인스턴스
validator = CharacterCountValidator(min_ratio=0.7, max_ratio=1.15)


# ===== 녹십자웰빙 채용공고 정보 =====
JOB_POSTING = {
    "company_name": "녹십자웰빙",
    "position": "병의원영업",
    "poster_url": "https://jasoseol.com/recruit/101851",
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
    "questions": [
        {"question": "당사에 지원한 동기는 무엇인가요?", "char_limit": 1000},
        {"question": "당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?", "char_limit": 1000},
        {"question": "본인의 가치관 또는 생활신조에 대해 기술해주세요", "char_limit": 1000},
        {"question": "본인의 성격 및 대인관계에 대해 기술해주세요", "char_limit": 1000},
        {"question": "입사 후 각오에 대하여 기술해주세요", "char_limit": 1000},
    ]
}


# ===== 블록 데이터 (문항별로 적합한 블록 선택) =====
BLOCKS = [
    {
        "id": "block-1",
        "category": "협업/리더십",
        "content": """미래에셋증권 공모전에서 RAG와 VectorDB 기반 주식 추천 서비스를 개발하며 기술적 난관을 협업으로 극복한 경험이 있습니다. 
프로젝트의 핵심인 RAG 검색 성능이 예상보다 저조하여 팀 전체가 어려움을 겪었습니다. 
저는 PM으로서 RAG 담당자에게만 책임을 맡기지 않고, 다른 AI 팀원들과 함께 단기간 스터디를 조직하여 문제 해결에 동참했습니다.
스터디를 통해 하이브리드 서치와 메타 데이터 활용법을 빠르게 익혔고, 기존의 단순 뉴스 유사도 검색 로직에 주가 상승률 데이터를 결합한 새로운 검색 기준을 제안하여 정확도를 획기적으로 개선했습니다.""",
        "keywords": ["협업", "리더십", "문제해결", "PM"]
    },
    {
        "id": "block-2",
        "category": "도전/성장",
        "content": """AI 해커톤에 참여했을 때, 저는 익숙하지 않던 Vision(시각) 영역 AI 개발을 맡게 되었습니다. 
하지만 저는 새로운 기술을 배울 기회로 삼았고, 대회 전부터 OpenCV, YOLOv8, GPT-API 등을 독학하며 철저히 준비했습니다.
대회 당일, 팀의 유일한 AI 개발자로서 24시간 중 16시간 만에 데이터 전처리부터 모델 학습, 파이프라인 구축까지 핵심 기능을 모두 구현했습니다. 
그 결과 120개 참가팀 중 3위라는 우수한 성과를 거두었고, 새로운 분야에 대한 두려움을 극복하고 성공을 경험하며 큰 자신감을 얻었습니다.""",
        "keywords": ["도전", "성장", "학습", "해커톤"]
    },
    {
        "id": "block-3",
        "category": "데이터분석/AI",
        "content": """에어비앤비 매출 증대 프로젝트에서 신규 호스트의 낮은 참여도와 높은 이탈률이 플랫폼 성장의 핵심 병목임을 데이터 분석을 통해 발견했습니다.
이 문제를 해결하고자 YOLOv8, SAM, CLIP 등 다양한 모델을 결합하여 '숙소 품질 자동 진단 및 개선 가이드 툴'을 개발했습니다.
A/B 테스트 결과, 개선된 사진과 설명은 기존 대비 각각 75%, 72.5% 높은 선호도를 기록하며 실질적인 비즈니스 임팩트를 증명했습니다.""",
        "keywords": ["데이터분석", "AI", "문제해결", "비즈니스"]
    },
    {
        "id": "block-4",
        "category": "역량개발",
        "content": """금융권이 디지털 전환을 가속화하면서, 단순 금융 지식을 넘어 데이터와 IT를 결합한 역량이 필수라고 판단했습니다.
인공지능연구실 학부연구생으로 활동하며 파이썬 기반 데이터 전처리부터 머신러닝, 딥러닝까지 실전 경험을 쌓았습니다.
삼성 청년 SW·AI 아카데미에서 Vue.js, Django를 학습하며 프론트엔드부터 백엔드까지 풀스택 개발 역량을 갖췄습니다.
투자자산운용사 자격증을 취득하며 자산관리와 포트폴리오 이론을 학습했습니다.""",
        "keywords": ["역량개발", "자기계발", "학습", "자격증"]
    },
    {
        "id": "block-5",
        "category": "갈등해결",
        "content": """창업경진대회에서 무인점포용 지능형 CCTV를 개발하며, 개발 방향성을 두고 팀원과 의견이 갈린 경험이 있습니다.
개발 팀원들은 GPT API 기반 이상행동 탐지와 실시간 알림 등 고성능 AI 기능 추가를 원했고, 저는 시장 진입을 위해 비용 효율화가 우선이라고 생각했습니다.
이 객관적 근거를 바탕으로 함께 타협점을 찾았습니다. 핵심 보안 기능은 유지하되, 고사양 기능은 옵션화하기로 했습니다.
그 결과 기존 보안 솔루션 대비 50% 비용을 절감해 실용성을 확보했고, 대회에서 우승했습니다.""",
        "keywords": ["갈등해결", "협업", "타협", "소통"]
    }
]


# ===== 참고 자기소개서 =====
COVER_LETTERS = [
    {
        "id": "cl-1",
        "company": "수협은행",
        "question": "지원동기",
        "content": """저는 대학 시절 봉사활동으로 지역 노인복지관에서 어르신들의 금융업무를 도와드리며 은행업에 관심을 갖게 되었습니다. 
디지털 기반으로 모든 고객에게 친근하게 다가가는 최고의 은행이 수협은행이라 확신해 지원하게 되었습니다.
수협은행은 어업인과 지역사회를 위한 특화된 금융서비스로 사회적 가치를 실현해왔습니다."""
    },
    {
        "id": "cl-2",
        "company": "기아",
        "question": "가치관/도전",
        "content": """저는 '철저한 준비'를 통해 한계에 과감히 도전하고, 반드시 결과를 만들어내는 사람입니다.
이 경험을 통해 저는 준비가 동반된 도전이 얼마나 큰 성과를 낼 수 있는지 깨달았습니다."""
    },
    {
        "id": "cl-3",
        "company": "수협은행",
        "question": "성격/대인관계",
        "content": """저의 강점은 철저한 준비성입니다. 이전 해커톤에서 처음 맡은 객체 인식 분야였지만, 
2주 준비기간 동안 매일 4시간씩 YOLOv8 문서를 분석하며 알고리즘 원리부터 파라미터 튜닝까지 기본기를 다졌습니다.
반면 완벽을 추구하다 일정 관리에 어려움을 겪은 경험이 있습니다. 
이를 보완하기 위해, 이후 노션으로 '필수 요구사항'과 '추가 개선사항'을 구분하고 우선순위와 데드라인을 관리하며 개선했습니다."""
    }
]


# ===== 문항별 적합한 블록/자소서 매핑 =====
QUESTION_MAPPING = {
    0: {"blocks": [0, 2], "cover_letters": [0]},      # 지원동기: 협업, 데이터분석 + 수협 지원동기
    1: {"blocks": [3, 1], "cover_letters": []},       # 직무준비: 역량개발, 도전
    2: {"blocks": [1, 4], "cover_letters": [1]},      # 가치관: 도전, 갈등해결 + 기아 가치관
    3: {"blocks": [4, 0], "cover_letters": [2]},      # 성격/대인관계: 갈등해결, 협업 + 수협 성격
    4: {"blocks": [1, 2, 0], "cover_letters": []},    # 입사각오: 도전, 데이터분석, 협업
}


# ===== 테스트 모델 리스트 =====
MODELS = ["gemini-flash", "gemini", "gpt", "claude"]


def print_header(text: str, char: str = "="):
    """헤더 출력"""
    print(f"\n{char * 70}")
    print(f"  {text}")
    print(f"{char * 70}\n")


def print_subheader(text: str):
    """서브헤더 출력"""
    print(f"\n{'─' * 50}")
    print(f"  {text}")
    print(f"{'─' * 50}\n")


async def test_smart_stream(question_idx: int, model: str):
    """Smart Stream API 테스트 (LLM이 알아서 선택)"""
    question_data = JOB_POSTING["questions"][question_idx]
    
    request_data = {
        "user_id": "test_user",
        "question": question_data["question"],
        "company_name": JOB_POSTING["company_name"],
        "position": JOB_POSTING["position"],
        "poster_url": JOB_POSTING["poster_url"],
        "fallback_content": JOB_POSTING["fallback_content"],
        "blocks": BLOCKS,
        "cover_letters": COVER_LETTERS,
        "char_limit": question_data["char_limit"],
        "model_type": model
    }
    
    print_subheader(f"🤖 Smart Stream - {model.upper()} - 문항 {question_idx + 1}")
    print(f"📝 문항: {question_data['question'][:50]}...")
    print()
    
    content = ""
    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream(
            "POST",
            "http://localhost:8000/api/ai/cover-letters/generate/smart/stream",
            json=request_data
        ) as response:
            if response.status_code != 200:
                print(f"❌ Error: {response.status_code}")
                return None
            
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    
                    try:
                        event = json.loads(data)
                        event_type = event.get("event", "")
                        
                        if event_type == "step_start":
                            print(f"  🔄 {event.get('message', '')}")
                        elif event_type == "step_complete":
                            step = event.get("step", "")
                            data_info = event.get("data", {})
                            success = data_info.get("success", True)
                            print(f"  {'✅' if success else '⚠️'} {step} 완료")
                        elif event_type == "content":
                            chunk = event.get("chunk", "")
                            print(chunk, end="", flush=True)
                            content += chunk
                        elif event_type == "selection":
                            sel = event.get("data", {})
                            print(f"\n  📋 선택됨: 블록 {sel.get('selected_blocks')}, 자소서 {sel.get('selected_cover_letters')}")
                        elif event_type == "done":
                            print(f"\n  ✅ 생성 완료!")
                    except json.JSONDecodeError:
                        pass
    
    print(f"\n  📏 생성된 글자 수: {len(content)}자")
    
    # 글자 수 검증
    char_limit = question_data["char_limit"]
    validation = validator.run(content, char_limit)
    print(f"  {validator.format_report(validation)}")
    
    return content, validation


async def test_selected_stream(question_idx: int, model: str):
    """Selected Stream API 테스트 (사용자가 직접 선택)"""
    question_data = JOB_POSTING["questions"][question_idx]
    mapping = QUESTION_MAPPING[question_idx]
    
    # 선택된 블록과 자소서
    selected_blocks = [BLOCKS[i] for i in mapping["blocks"]]
    selected_cover_letters = [COVER_LETTERS[i] for i in mapping["cover_letters"]] if mapping["cover_letters"] else []
    
    request_data = {
        "user_id": "test_user",
        "question": question_data["question"],
        "company_name": JOB_POSTING["company_name"],
        "position": JOB_POSTING["position"],
        "poster_url": JOB_POSTING["poster_url"],
        "fallback_content": JOB_POSTING["fallback_content"],
        "blocks": selected_blocks,
        "cover_letters": selected_cover_letters,
        "char_limit": question_data["char_limit"],
        "model_type": model
    }
    
    print_subheader(f"✋ Selected Stream - {model.upper()} - 문항 {question_idx + 1}")
    print(f"📝 문항: {question_data['question'][:50]}...")
    print(f"📦 선택된 블록: {[BLOCKS[i]['category'] for i in mapping['blocks']]}")
    if selected_cover_letters:
        print(f"📄 참고 자소서: {[cl['company'] + '-' + cl['question'] for cl in selected_cover_letters]}")
    print()
    
    content = ""
    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream(
            "POST",
            "http://localhost:8000/api/ai/cover-letters/generate/selected/stream",
            json=request_data
        ) as response:
            if response.status_code != 200:
                print(f"❌ Error: {response.status_code}")
                return None
            
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    
                    try:
                        event = json.loads(data)
                        event_type = event.get("event", "")
                        
                        if event_type == "step_start":
                            print(f"  🔄 {event.get('message', '')}")
                        elif event_type == "step_complete":
                            step = event.get("step", "")
                            data_info = event.get("data", {})
                            print(f"  ✅ {step} 완료")
                        elif event_type == "content":
                            chunk = event.get("chunk", "")
                            print(chunk, end="", flush=True)
                            content += chunk
                        elif event_type == "done":
                            print(f"\n  ✅ 생성 완료!")
                    except json.JSONDecodeError:
                        pass
    
    print(f"\n  📏 생성된 글자 수: {len(content)}자")
    
    # 글자 수 검증
    char_limit = question_data["char_limit"]
    validation = validator.run(content, char_limit)
    print(f"  {validator.format_report(validation)}")
    
    return content, validation


async def run_full_test():
    """전체 테스트 실행"""
    print_header("🧪 녹십자웰빙 병의원영업 자기소개서 생성 테스트")
    print(f"📅 테스트 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🏢 기업: {JOB_POSTING['company_name']}")
    print(f"💼 직무: {JOB_POSTING['position']}")
    print(f"📋 문항 수: {len(JOB_POSTING['questions'])}개")
    print(f"🤖 테스트 모델: {', '.join(MODELS)}")
    
    results = {}
    
    # 모든 모델과 문항 조합 테스트
    for model in MODELS:
        print_header(f"🔥 {model.upper()} 모델 테스트", "▓")
        results[model] = {}
        
        # 문항 1개씩 테스트 (전체 테스트는 시간이 오래 걸리므로 첫 문항만)
        question_idx = 0
        
        # Smart Stream 테스트
        try:
            result = await test_smart_stream(question_idx, model)
            if result:
                content, validation = result
                results[model]["smart"] = {
                    "success": True,
                    "length": len(content),
                    "valid": validation["valid"],
                    "status": validation["status"]
                }
            else:
                results[model]["smart"] = {"success": False}
        except Exception as e:
            print(f"  ❌ Smart Stream 에러: {e}")
            results[model]["smart"] = {"success": False, "error": str(e)}
        
        await asyncio.sleep(1)  # API 호출 간격
        
        # Selected Stream 테스트
        try:
            result = await test_selected_stream(question_idx, model)
            if result:
                content, validation = result
                results[model]["selected"] = {
                    "success": True,
                    "length": len(content),
                    "valid": validation["valid"],
                    "status": validation["status"]
                }
            else:
                results[model]["selected"] = {"success": False}
        except Exception as e:
            print(f"  ❌ Selected Stream 에러: {e}")
            results[model]["selected"] = {"success": False, "error": str(e)}
        
        await asyncio.sleep(1)
    
    # 결과 요약
    print_header("📊 테스트 결과 요약")
    print(f"{'모델':<15} {'Smart':<25} {'Selected':<25}")
    print("-" * 65)
    for model, data in results.items():
        smart = data.get("smart", {})
        selected = data.get("selected", {})
        
        def format_result(r):
            if not r.get("success"):
                return "❌ 실패"
            status_icon = "✅" if r.get("valid", False) else "⚠️"
            return f"{status_icon} {r.get('length', 0)}자 ({r.get('status', 'N/A')})"
        
        print(f"{model:<15} {format_result(smart):<25} {format_result(selected):<25}")
    
    print("\n" + "=" * 70)
    print("  테스트 완료!")
    print("=" * 70)


async def run_single_question_all_models():
    """단일 문항으로 모든 모델 테스트 (빠른 테스트용)"""
    print_header("⚡ 빠른 테스트 - 문항 1 + 모든 모델")
    
    for model in MODELS:
        print_header(f"🤖 {model.upper()}", "─")
        try:
            await test_selected_stream(0, model)
        except Exception as e:
            print(f"❌ {model} 에러: {e}")
        
        print()
        await asyncio.sleep(2)


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "quick":
        # 빠른 테스트: python test_pipeline.py quick
        asyncio.run(run_single_question_all_models())
    else:
        # 전체 테스트: python test_pipeline.py
        asyncio.run(run_full_test())
