# Backend API 명세서 (AI 연동용)

## 개요
AI 자기소개서 생성 서비스와 Spring Backend 연동을 위한 API 명세입니다.

---

## 📌 필요한 API 목록

### 1. Block 조회 API

#### `GET /api/cover-letters/blocks`
사용자의 모든 경험 블록 조회

**Request**
```http
GET /api/cover-letters/blocks?accountId={accountId}
Authorization: Bearer {token}
```

**Response**
```json
[
  {
    "id": 1,
    "title": "SSAFY 공통프로젝트",
    "content": "WebRTC를 활용한 화상회의 시스템 개발...",
    "categories": ["PROJECT", "TEAMWORK"]
  }
]
```

**Field 설명**
| Field | Type | 설명 |
|-------|------|------|
| id | Long | 블록 ID |
| title | String | 블록 제목 |
| content | String | 블록 내용 (TEXT) |
| categories | String[] | 카테고리 코드 리스트 |

---

#### `GET /api/cover-letters/blocks/{blockId}`
특정 블록 조회

**Response**
```json
{
  "id": 1,
  "title": "SSAFY 공통프로젝트",
  "content": "...",
  "categories": ["PROJECT"]
}
```

---

### 2. Essay (기존 자소서) 조회 API

#### `GET /api/cover-letters/{coverletterId}/essays`
특정 자소서의 모든 문항 답변 조회

**Response**
```json
[
  {
    "id": 10,
    "questionId": 5,
    "questionContent": "지원동기를 작성해주세요",
    "content": "저는 귀사의 비전에 공감하여...",
    "charMax": 800,
    "version": 3,
    "versionTitle": "피드백 반영 v3",
    "isCurrent": true
  }
]
```

**Field 설명**
| Field | Type | 설명 |
|-------|------|------|
| id | Long | Essay ID |
| questionId | Long | 문항 ID |
| questionContent | String | 문항 내용 |
| content | String | 답변 내용 |
| charMax | Integer | 글자수 제한 |
| version | Integer | 버전 번호 |
| versionTitle | String | 버전 타이틀 |
| isCurrent | Boolean | 현재 버전 여부 |

---

#### `GET /api/cover-letters`
사용자의 모든 자소서 목록 조회

**Request**
```http
GET /api/cover-letters?accountId={accountId}
```

**Response**
```json
[
  {
    "id": 1,
    "title": "삼성전자 SW 직군",
    "companyName": "삼성전자",
    "isComplete": false,
    "createdAt": "2026-01-20T10:00:00"
  }
]
```

---

### 3. Essay 저장 API (AI 생성 결과)

#### `POST /api/cover-letters/{coverletterId}/essays`
AI 생성 자소서를 새 버전으로 저장

**Request**
```json
{
  "questionId": 5,
  "content": "AI가 생성한 자기소개서 내용...",
  "versionTitle": "AI 생성 v1",
  "setAsCurrent": true
}
```

**Request Body 설명**
| Field | Type | Required | 설명 |
|-------|------|----------|------|
| questionId | Long | Y | 문항 ID |
| content | String | Y | 생성된 자소서 내용 |
| versionTitle | String | Y | 버전 타이틀 (예: "AI 생성 v1") |
| setAsCurrent | Boolean | N | true면 기존 버전 isCurrent=false 처리 (기본값: true) |

**Response**
```json
{
  "id": 15,
  "questionId": 5,
  "content": "...",
  "version": 4,
  "versionTitle": "AI 생성 v1",
  "isCurrent": true
}
```

**비즈니스 로직 요구사항**
1. 현재 최신 버전 번호 조회
2. setAsCurrent=true면 기존 모든 버전 isCurrent=false 업데이트
3. 새 버전 = 최신 버전 + 1
4. 새 Essay 엔티티 생성 및 저장

---

### 4. 토큰 사용량 추적 API

#### `POST /api/ai/token-usage`
AI 모델 토큰 사용량 저장 (내부 호출)

**Request**
```json
{
  "accountId": 123,
  "modelName": "gemini-flash",
  "requestType": "SMART_GENERATION",
  "inputTokens": 1500,
  "outputTokens": 800,
  "totalTokens": 2300
}
```

**Field 설명**
| Field | Type | 설명 |
|-------|------|------|
| accountId | Long | 사용자 ID |
| modelName | String | 모델명 (gpt-4o, gemini-flash, claude) |
| requestType | String | 요청 타입 (SMART, SELECTED, REFINE, BLOCK) |
| inputTokens | Integer | 입력 토큰 수 |
| outputTokens | Integer | 출력 토큰 수 |
| totalTokens | Integer | 총 토큰 수 |

**Response**
```json
{
  "id": 456,
  "createdAt": "2026-01-26T12:00:00"
}
```

---

#### `GET /api/accounts/{accountId}/token-usage`
사용자 토큰 사용량 조회

**Query Parameters**
- `startDate` (optional): ISO 8601 날짜
- `endDate` (optional): ISO 8601 날짜

**Response**
```json
{
  "totalTokens": 50000,
  "byModel": {
    "gpt-4o": 20000,
    "gemini-flash": 30000
  },
  "byRequestType": {
    "SMART_GENERATION": 35000,
    "REFINE": 15000
  }
}
```

---

## 🗄️ 추가 필요한 DB 작업

### Token Usage 테이블 생성
```sql
-- Flyway Migration: V20260127__add_token_usage.sql
CREATE TABLE token_usage (
    token_usage_id bigserial PRIMARY KEY,
    account_id     bigint       NOT NULL,
    model_name     varchar(50)  NOT NULL,
    request_type   varchar(30)  NOT NULL,
    input_tokens   int          NOT NULL,
    output_tokens  int          NOT NULL,
    total_tokens   int          NOT NULL,
    created_at     timestamp    NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_account_TO_token_usage
        FOREIGN KEY (account_id) REFERENCES account(account_id)
);

CREATE INDEX idx_token_usage_account ON token_usage(account_id);
CREATE INDEX idx_token_usage_created ON token_usage(created_at);
```

---

## 🔐 인증 처리
모든 API는 JWT Bearer Token 인증 필요
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ 에러 응답
```json
{
  "error": "NOT_FOUND",
  "message": "Block with id 999 not found"
}
```

**HTTP Status Codes**
- 200: 성공
- 400: 잘못된 요청
- 401: 인증 실패
- 404: 리소스 없음
- 500: 서버 오류

---

## 📝 구현 우선순위
1. Block 조회 API (GET /api/cover-letters/blocks) - 최우선
2. Essay 조회 API (GET /api/cover-letters/{id}/essays)
3. Essay 저장 API (POST)
4. 토큰 사용량 API

---

## 🧪 테스트 데이터 예시
```json
// Block 샘플
{
  "id": 1,
  "title": "WebRTC 화상회의 프로젝트",
  "content": "6인 팀 프로젝트로 WebRTC를 활용한 화상회의 시스템을 개발했습니다. 저는 백엔드 팀장으로 Spring Boot와 Kurento Media Server를 연동하여...",
  "categories": ["PROJECT", "LEADERSHIP"]
}
```
