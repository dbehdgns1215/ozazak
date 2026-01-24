# 🤖 AI 자기소개서 생성 서비스

LangChain 기반 자기소개서 자동 생성 서비스입니다.  
GPT, Gemini, Claude 등 다양한 LLM을 지원하며, 채용공고 스크래핑과 기업 정보 검색을 통해 맞춤형 자기소개서를 생성합니다.

---

## 📁 프로젝트 구조

```
ai/
├── src/
│   ├── adapters/
│   │   ├── inbound/rest/          # FastAPI 엔드포인트
│   │   │   ├── main.py            # 메인 앱
│   │   │   └── schemas.py         # 요청/응답 스키마
│   │   └── outbound/
│   │       ├── llm/               # LLM 어댑터
│   │       │   ├── chains/        # LangChain Chains
│   │       │   │   ├── smart_generation_chain.py   # 스마트 선택 + 생성
│   │       │   │   ├── enhanced_pipeline_chain.py  # 통합 파이프라인
│   │       │   │   └── enhanced_utils.py           # 유틸리티
│   │       │   └── prompts/       # 프롬프트 템플릿
│   │       ├── tools/             # 외부 도구 (NEW!)
│   │       │   ├── scraper.py     # 채용공고 스크래핑
│   │       │   ├── searcher.py    # Serper 기업 검색
│   │       │   └── validator.py   # 글자 수 검증
│   │       └── api/               # Spring API 클라이언트
│   │           └── spring_client.py
│   └── config/
│       └── settings.py            # 환경 설정
├── test_pipeline.py               # 종합 테스트
└── requirements.txt
```

---

## 🚀 실행 방법

```bash
# 의존성 설치
pip install -r requirements.txt

# 서버 시작
uvicorn src.adapters.inbound.rest.main:app --reload

# 테스트
python test_pipeline.py        # 전체 테스트
python test_pipeline.py quick  # 빠른 테스트
```

---

## 🔌 API 엔드포인트

### 1️⃣ Smart Stream (LLM 자동 선택)
```
POST /api/ai/cover-letters/generate/smart/stream
```

LLM이 문항에 가장 적합한 블록/자소서를 **자동 선택**하고 생성합니다.

**요청 예시:**
```json
{
  "user_id": "user123",
  "question": "지원동기를 작성해주세요",
  "company_name": "녹십자웰빙",
  "position": "병의원영업",
  "poster_url": "https://jasoseol.com/recruit/101851",
  "fallback_content": "채용공고 본문...",
  "blocks": [
    {"category": "협업", "content": "...", "keywords": ["팀워크"]}
  ],
  "cover_letters": [
    {"company": "수협", "question": "지원동기", "content": "..."}
  ],
  "char_limit": 1000,
  "model_type": "gemini-flash"
}
```

---

### 2️⃣ Selected Stream (사용자 직접 선택)
```
POST /api/ai/cover-letters/generate/selected/stream
```

사용자가 **직접 선택**한 블록/자소서만 사용하여 생성합니다.

**요청 예시:**
```json
{
  "user_id": "user123",
  "question": "지원동기를 작성해주세요",
  "company_name": "녹십자웰빙",
  "position": "병의원영업",
  "block_ids": ["block-uuid-1", "block-uuid-2"],
  "cover_letter_ids": ["cl-uuid-1"],
  "poster_url": "https://jasoseol.com/...",
  "char_limit": 1000,
  "model_type": "gpt"
}
```

---

### 3️⃣ Enhanced Stream (채용공고 분석 중심)
```
POST /api/ai/cover-letters/generate/enhanced/stream
```

채용공고 스크래핑 + 기업 검색 후 블록으로 생성합니다.

---

### 기존 API

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /health` | 헬스체크 |
| `POST /api/ai/blocks/generate` | 프로젝트에서 블록 추출 |
| `POST /api/ai/job-postings/analyze` | 채용공고 분석 |
| `POST /api/ai/cover-letters/generate` | 자소서 생성 (동기) |
| `POST /api/ai/cover-letters/generate/stream` | 자소서 생성 (스트리밍) |

---

## 🔧 Tools

### JobPostingScraperTool
채용공고 URL(자소설닷컴 등)에서 담당업무, 자격요건, 우대사항을 추출합니다.

### SerperSearchTool
Serper API를 사용해 기업의 인재상, 올해 목표, 기업문화를 검색합니다.

### CharacterCountValidator
생성된 자기소개서의 글자 수가 제한 범위 내인지 검증합니다.

```python
from src.adapters.outbound.tools import CharacterCountValidator

validator = CharacterCountValidator(min_ratio=0.7, max_ratio=1.15)
result = validator.run(content, char_limit=1000)
# {"valid": True, "char_count": 850, "status": "OK"}
```

---

## 📡 SSE 이벤트

스트리밍 API는 Server-Sent Events(SSE) 형식으로 응답합니다.

| 이벤트 | 설명 |
|--------|------|
| `step_start` | 단계 시작 (scraping, searching, generating) |
| `step_complete` | 단계 완료 |
| `content` | 생성된 콘텐츠 청크 |
| `selection` | 선택된 블록/자소서 정보 (smart 전용) |
| `done` | 완료 |
| `error` | 에러 발생 |

---

## 🔑 환경 변수

```env
# LLM API Keys
GMS_API_KEY=your-google-api-key
GPT_MODEL=gpt-4o
GEMINI_MODEL=gemini-1.5-pro
CLAUDE_MODEL=claude-sonnet-4-20250514

# Tools
SERPER_API_KEY=your-serper-api-key

# Spring Backend
BACKEND_API_BASE_URL=http://localhost:8080

# Server
APP_HOST=0.0.0.0
APP_PORT=8000
```

---

## 🧪 테스트

```bash
python test_pipeline.py
```

**테스트 내용:**
- 모든 모델 (gemini-flash, gemini, gpt, claude)
- Smart/Selected API 모두
- 글자 수 검증 (CharacterCountValidator)

---

## 📊 처리 흐름

```
사용자 요청
    │
    ▼
┌─────────────────────────────────────────┐
│  1. 데이터 로딩                          │
│     - Spring API에서 블록/자소서 조회     │
│     - 또는 직접 전달받은 데이터 사용       │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  2. Enhanced 분석 (선택적)               │
│     - 채용공고 스크래핑 (자소설닷컴)       │
│     - Serper로 기업 정보 검색            │
│     - job_analysis 생성                 │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  3. 자기소개서 생성                      │
│     - Smart: LLM이 적합한 블록 선택       │
│     - Selected: 사용자 선택 블록 사용     │
│     - SSE 스트리밍 출력                  │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  4. 검증 (클라이언트 측)                 │
│     - CharacterCountValidator로 글자수 검증│
└─────────────────────────────────────────┘
```

---

## 📦 Spring API 연동

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/cover-letters/blocks` | 사용자 블록 전체 조회 |
| `GET /api/cover-letters/blocks/{id}` | 특정 블록 조회 |
| `GET /api/cover-letters/originals` | 사용자 자소서 전체 조회 |
| `GET /api/cover-letters/originals/{id}` | 특정 자소서 조회 |
