# AI-Backend 연동 테스트 가이드

## 📚 개요
AI 서비스와 Spring Backend 연동 기능을 테스트하기 위한 가이드입니다.

---

## 🎯 추가된 기능

### 1. 저장 관련 스키마 필드
모든 생성 API 요청에 다음 필드가 추가되었습니다:

```json
{
  "coverletter_id": 123,         // 저장할 자소서 ID (선택)
  "question_id": 456,             // 문항 ID (선택)
  "save_to_backend": true,        // 백엔드 저장 여부 (기본값: false)
  "auth_token": "Bearer eyJhb..."  // JWT 토큰
}
```

### 2. 자동 저장 로직
- `save_to_backend=true`일 때만 저장 수행
- 생성 완료 후 자동으로 Spring Backend에 저장
- SSE 이벤트로 저장 상태 알림

---

## 🧪 테스트 시나리오

### Scenario 1: 저장 없이 생성만 (기본)

**요청**
```bash
curl -X POST http://localhost:8000/api/ai/cover-letters/smart \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question": "지원동기를 작성해주세요",
    "company_name": "삼성전자",
    "position": "소프트웨어 엔지니어",
    "char_limit": 800,
    "model_type": "gemini-flash"
  }'
```

**동작**: 생성만 수행, 저장하지 않음

---

### Scenario 2: 생성 + 자동 저장

**요청**
```bash
curl -X POST http://localhost:8000/api/ai/cover-letters/smart \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question": "지원동기를 작성해주세요",
    "company_name": "삼성전자",
    "position": "소프트웨어 엔지니어",
    "coverletter_id": 1,
    "question_id": 5,
    "save_to_backend": true,
    "auth_token": "Bearer your_jwt_token_here",
    "char_limit": 800,
    "model_type": "gemini-flash"
  }'
```

**SSE 이벤트 흐름**
```
data: {"event":"step_start","step":"loading","message":"📂 사용자 블록 및 자기소개서 데이터 로딩 중..."}

data: {"event":"step_complete","step":"loading","data":{"blocks_count":5,"cover_letters_count":3}}

data: {"event":"step_start","step":"generating","message":"✍️ 선택된 경험을 바탕으로 자기소개서 작성 중..."}

data: {"event":"content","chunk":"저는 귀사의 비전에 깊이 공감하며..."}

data: {"event":"step_start","step":"saving","message":"💾 생성된 자소서를 저장 중..."}

data: {"event":"step_complete","step":"saving","data":{"essay_id":20,"version":4}}

data: {"event":"done","data":{"success":true,"saved_essay_id":20}}
```

---

## 🔌 백엔드 API Mock 서버

백엔드가 아직 구현되지 않았을 때 테스트용 Mock 서버를 사용할 수 있습니다.

### Mock 서버 실행 (Python)

```python
# mock_backend.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI()

class SaveEssayRequest(BaseModel):
    questionId: int
    content: str
    versionTitle: str
    setAsCurrent: bool = True

@app.post("/api/cover-letters/{coverletter_id}/essays")
async def save_essay(coverletter_id: int, request: SaveEssayRequest):
    return {
        "id": 999,
        "questionId": request.questionId,
        "content": request.content,
        "version": 1,
        "versionTitle": request.versionTitle,
        "isCurrent": True
    }

@app.get("/api/cover-letters/blocks")
async def get_blocks(accountId: int):
    return [
        {
            "id": 1,
            "title": "SSAFY 프로젝트",
            "content": "WebRTC 화상회의 시스템 개발...",
            "categories": ["PROJECT", "TEAMWORK"]
        }
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

**실행**
```bash
python mock_backend.py
```

---

## 📝 Spring Backend 연동 확인 체크리스트

### 필수 구현 사항 (백엔드 팀)
- [ ] `GET /api/cover-letters/blocks?accountId={id}` - 블록 조회
- [ ] `POST /api/cover-letters/{id}/essays` - Essay 저장
- [ ] `GET /api/cover-letters/{id}/essays` - Essay 조회
- [ ] JWT 인증 처리

### AI 서비스 연동 확인
- [x] `spring_client.py` 메서드 추가
  - [x] `save_essay()`
  - [x] `get_essays_by_coverletter()`
  - [x] `save_token_usage()`
- [x] Request 스키마 필드 추가
  - [x] `coverletter_id`
  - [x] `question_id`
  - [x] `save_to_backend`
- [x] SSE 엔드포인트 저장 로직 통합
  - [x] `/api/ai/cover-letters/smart`
  - [x] `/api/ai/cover-letters/selected`
  - [x] `/api/ai/cover-letters/refine`

---

## 🐛 트러블슈팅

### 1. 저장 실패 (401 Unauthorized)
**원인**: JWT 토큰 누락 또는 만료
**해결**: `auth_token` 필드에 유효한 JWT 전달

### 2. 저장 실패 (404 Not Found)
**원인**: `coverletter_id` 또는 `question_id` 존재하지 않음
**해결**: DB에 실제 존재하는 ID 사용

### 3. 저장되지 않음 (200 OK 응답)
**원인**: `save_to_backend=false` 또는 필드 누락
**해결**:
- `save_to_backend: true` 설정
- `coverletter_id`, `question_id` 필수 전달

### 4. Backend 연결 실패
**원인**: Spring Backend가 실행 중이지 않음
**해결**:
```bash
# Docker로 실행 중인지 확인
docker ps | grep ozazak-back

# 백엔드 로그 확인
docker logs ozazak-back-local

# 또는 Mock 서버 사용
python mock_backend.py
```

---

## 📊 로그 확인

### AI 서비스 로그
```bash
# Docker 로그
docker logs -f ozazak-ai-local

# 로컬 실행 시
python -m uvicorn src.adapters.inbound.rest.main:app --reload
```

**저장 성공 로그**
```
INFO:src.adapters.outbound.api.spring_client:Essay 저장 성공 (coverletter_id=1, question_id=5, version=4)
```

**저장 실패 로그**
```
ERROR:src.adapters.outbound.api.spring_client:Essay 저장 실패: 404 - {"error":"NOT_FOUND"}
```

---

## 🎬 통합 테스트 예시 (Python)

```python
import httpx
import json
import asyncio

async def test_smart_generation_with_save():
    """스마트 생성 + 저장 통합 테스트"""

    request_data = {
        "user_id": "user123",
        "question": "지원동기를 작성해주세요",
        "company_name": "삼성전자",
        "position": "SW 엔지니어",
        "coverletter_id": 1,
        "question_id": 5,
        "save_to_backend": True,
        "auth_token": "Bearer test_token",
        "char_limit": 800,
        "model_type": "gemini-flash"
    }

    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            "http://localhost:8000/api/ai/cover-letters/smart",
            json=request_data,
            timeout=120.0
        ) as response:
            saved_essay_id = None

            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:]
                    if data_str == "[DONE]":
                        break

                    event = json.loads(data_str)
                    print(f"Event: {event.get('event')} - {event.get('message', '')}")

                    # 저장 완료 이벤트 확인
                    if event.get("event") == "step_complete" and event.get("step") == "saving":
                        saved_essay_id = event.get("data", {}).get("essay_id")
                        print(f"✅ 저장 성공! Essay ID: {saved_essay_id}")

            return saved_essay_id

if __name__ == "__main__":
    essay_id = asyncio.run(test_smart_generation_with_save())
    print(f"Final Essay ID: {essay_id}")
```

---

## ✅ 최종 확인 사항

연동 작업 완료 전 확인:
1. [ ] Mock 서버로 저장 API 동작 확인
2. [ ] 실제 Backend API 연동 후 전체 흐름 테스트
3. [ ] JWT 인증 정상 작동 확인
4. [ ] SSE 이벤트 순서 확인 (loading → generating → saving → done)
5. [ ] 에러 처리 확인 (저장 실패 시에도 done 이벤트 전송)
