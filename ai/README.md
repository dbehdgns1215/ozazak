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

### 기본 API

| 메소드 | 엔드포인트 | 설명 |
|:------:|-----------|------|
| `GET` | `/` | 루트 (버전 정보) |
| `GET` | `/health` | 헬스체크 |

### 블록/분석 API

| 메소드 | 엔드포인트 | 설명 |
|:------:|-----------|------|
| `POST` | `/api/ai/blocks/generate` | 프로젝트/자소서에서 **블록 추출** |
| `POST` | `/api/ai/job-postings/analyze` | **채용공고 분석** (직무 요구사항 추출) |

### 자기소개서 생성 API

| 메소드 | 엔드포인트 | 설명 |
|:------:|-----------|------|
| `POST` | `/api/ai/cover-letters/generate/smart` | **Smart** - LLM이 블록/자소서 자동 선택 |
| `POST` | `/api/ai/cover-letters/generate/selected` | **Selected** - 사용자가 직접 선택 |

두 API 모두 다음 기능 포함:
- ✅ SSE 스트리밍 (실시간 생성)
- ✅ COT 이벤트 (단계별 진행 상황)
- ✅ 채용공고 스크래핑 (자소설닷컴)
- ✅ Serper 기업정보 검색
- ✅ Spring API 연동

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

---

## 📅 향후 계획 (Roadmap)

1. **자동 재작성 (Auto-Regeneration)**
   - 글자 수 등 검증 실패 시, LLM이 실패 원인을 분석하여 자동으로 재작성 수행
   
2. **AI 에이전트 모드 (Agent Mode)**
   - 사용자 프롬프트(피드백)를 받아 자기소개서 내용을 구체적으로 수정 및 재생성
   
3. **Backend 연동 강화**
   - 생성된 자기소개서 저장 및 관리 기능 연동

4. **/api/ai/job-postings/analyze**
   - **Cost Optimization**: Cheap LLM (gpt-4o-mini 등) 모델로 대체
   - **System Upgrade**: LangGraph 구조로 포변하여 Agent 기능(검색 보강 등) 추가
   - **Caching**: 분석 결과 DB 저장/조회로 중복 분석 방지 및 응답 속도 개선
