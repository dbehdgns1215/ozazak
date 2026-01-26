# 🤖 AI 자기소개서 생성 서비스

LangChain 기반의 고도화된 자기소개서 자동 생성 서비스입니다.  
GPT, Gemini, Claude 등 다양한 SOTA LLM을 지원하며, 채용공고 분석과 기업 정보 검색, 그리고 사용자 경험(블록)을 결합하여 최적화된 자기소개서를 생성합니다.

---

## 🚀 주요 기능 (Key Features)

### 1. 하이브리드 스트리밍 엔진 (Hybrid Streaming Engine)
모든 생성 API는 **실시간 스트리밍(SSE)**과 **자동 검증 루프**가 결합된 하이브리드 방식을 사용합니다.
- **실시간 출력**: 한 글자씩 생성되는 즉시 클라이언트로 전송합니다.
- **자동 검증 및 재작성**: 생성이 완료되면 서버 내부에서 즉시 글자 수를 검증하고, 미달/초과 시 **자동으로 재생성**을 시작합니다. (최대 3회)
- **강력한 피드백**: 재생성 시 "현재 N자 부족하니 M자 더 추가하라"는 구체적인 지시를 LLM에게 전달하여 성공률을 높입니다.

### 2. 스마트 생성 (Smart Generation)
- **RAG & Selection**: 사용자의 경험 정리 데이터(블록)와 기존 자소서 중에서 해당 문항에 가장 적합한 소재를 LLM이 **스스로 선택(Reasoning)**합니다.
- **COT 스트리밍**: AI가 어떤 근거로 소재를 선택했는지 사고 과정(Chain of Thought)을 실시간으로 사용자에게 보여줍니다.

### 3. Agent Mode (Refinement)
- **대화형 수정**: 단순 재생성이 아니라, 사용자의 구체적인 피드백(예: "좀 더 도전적인 어조로 바꿔줘", "수치 데이터를 강조해줘")을 반영하여 내용을 수정합니다.
- **Diff & Action**: 수정 과정에서도 글자 수 제한을 엄격하게 준수하도록 검증 로직이 작동합니다.

### 4. 강화된 분석 파이프라인 (Enhanced Analysis)
- **Job Posting Scraper**: 자소설닷컴 등 채용공고 URL에서 핵심 직무 역량, 우대사항을 자동으로 추출합니다.
- **Serper 기업 검색**: 구글 검색 API(Serper)를 통해 기업의 최신 인재상, CEO 메시지, 올해 사업 목표 등을 실시간으로 수집하여 자소서에 반영합니다.

---

## 📁 프로젝트 구조

```
ai/
├── src/
│   ├── adapters/
│   │   ├── inbound/rest/          # FastAPI 엔드포인트
│   │   │   ├── main.py            # 메인 앱 (Router)
│   │   │   └── schemas.py         # Pydantic 스키마
│   │   └── outbound/
│   │       ├── llm/               # LLM 어댑터 (LangChain)
│   │       │   ├── chains/        # Core Logics
│   │       │   │   ├── smart_generation_chain.py   # 스마트 생성
│   │       │   │   ├── cover_letter_chain.py       # 일반/선택 생성
│   │       │   │   ├── refinement_chain.py         # 수정(Refine)
│   │       │   │   └── enhanced_utils.py           # 분석 파이프라인
│   │       │   ├── callbacks/     # Callbacks
│   │       │   │   └── token_usage_callback.py     # 토큰 추적
│   │       │   └── prompts/       # 프롬프트 템플릿
│   │       ├── tools/             # 외부 도구
│   │       │   ├── scraper.py     # 채용공고 스크래퍼
│   │       │   ├── searcher.py    # Serper 검색기
│   │       │   └── validator.py   # 글자 수 검증기
│   │       └── api/               # Spring API 클라이언트
│   │           └── spring_client.py
│   └── config/
│       └── settings.py            # 환경 설정
├── test_pipeline.py               # 종합 테스트 스크립트
└── requirements.txt
```

---

## 📊 처리 흐름 (Processing Flow)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                            👤 사용자 요청                                  │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        📥 1. 데이터 로딩                                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  • Spring API → 블록/자소서 조회                                    │  │
│  │  • 직접 전달받은 데이터 사용                                         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   🔍 2. Enhanced 분석 파이프라인                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                        Analysis Phase                              │  │
│  │  ┌──────────────────┐          ┌─────────────────────┐            │  │
│  │  │ 채용공고 스크래핑  │          │ 기업 정보 검색       │            │  │
│  │  │  (자소설닷컴)     │          │   (Serper API)     │            │  │
│  │  └────────┬─────────┘          └─────────┬───────────┘            │  │
│  │           │                              │                        │  │
│  │           └──────────────┬───────────────┘                        │  │
│  │                          ▼                                        │  │
│  │                 Job Analysis 데이터 생성                           │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
                        ❓ 생성 모드 선택
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌─────────┐           ┌──────────┐          ┌──────────┐
   │  Smart  │           │ Selected │          │  Refine  │
   │   모드   │           │   모드    │          │   모드    │
   └────┬────┘           └────┬─────┘          └────┬─────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  🧠 3. Generation Phase (Hybrid Streaming)                │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Smart 모드:                                                        │  │
│  │    └─→ AI 소재 선택 (Reasoning) ──┐                                │  │
│  │                                    │                                │  │
│  │  Selected 모드:                    │                                │  │
│  │    └─→ 사용자 선택 소재 ───────────┤                                │  │
│  │                                    │                                │  │
│  │  Refine 모드:                      │                                │  │
│  │    └─→ 수정 (피드백 반영) ─────────┤                                │  │
│  │                                    │                                │  │
│  │                                    ▼                                │  │
│  │                          ┌──────────────────┐                       │  │
│  │                          │  초안 생성        │                       │  │
│  │                          │  (SSE Streaming) │                       │  │
│  │                          └────────┬─────────┘                       │  │
│  │                                   │                                 │  │
│  │                                   ▼                                 │  │
│  │                          ┌──────────────────┐                       │  │
│  │                          │ 글자 수 검증?     │                       │  │
│  │                          │ (Validator)      │                       │  │
│  │                          └────┬────────┬────┘                       │  │
│  │                               │        │                            │  │
│  │                         ✅ Pass│        │❌ Fail                     │  │
│  │                               │        │                            │  │
│  │                               │        ▼                            │  │
│  │                               │  ┌──────────────────────┐           │  │
│  │                               │  │  자동 재작성          │           │  │
│  │                               │  │ (Auto-Regeneration)  │           │  │
│  │                               │  │  피드백 반영          │           │  │
│  │                               │  └──────────┬───────────┘           │  │
│  │                               │             │                       │  │
│  │                               │             └───────┐               │  │
│  │                               │                     │               │  │
│  │                               ▼                     │               │  │
│  │                        ┌─────────────┐              │               │  │
│  │                        │  최종 완료   │◄─────────────┘               │  │
│  │                        └──────┬──────┘                              │  │
│  └───────────────────────────────┼─────────────────────────────────────┘  │
└──────────────────────────────────┼───────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    💾 4. Spring 백엔드 저장 (보류)                         │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   ▼
                            👤 사용자에게 반환
```
**상세 흐름:**
1. **데이터 로딩**: Spring API 또는 요청 본문에서 블록/자소서 데이터 로드
2. **Enhanced 분석**: 채용공고 URL 스크래핑 + 기업 정보 실시간 검색 → 직무 분석 데이터 생성
3. **생성 및 검증 루프 (Hybrid Streaming)**:
   - 소재 선택 (Smart 모드일 경우 AI가 자동 선택)
   - 스트리밍 생성 시작
   - **실시간 검증**: 생성 완료 즉시 서버 내부에서 글자 수 검증 (`CharacterCountValidator`)
   - **자동 재작성**: 검증 실패 시, "300자 더 늘려줘"와 같은 구체적 피드백과 함께 최대 3회 자동 재시도
4. **저장**: 최종 성공 시 백엔드 DB에 저장 (현재 인터페이스만 구현됨)

---

## ⚡ API 명세 (API Specifications)

### 1. 자기소개서 생성 및 수정

모든 생성 API는 **Server-Sent Events (SSE)**로 응답합니다.

#### `POST /api/ai/cover-letters/smart`
AI가 문항을 분석하여 가장 적합한 블록과 자소서를 자동으로 선택해 작성합니다.
- **Flow**: 로딩 -> 공고/기업 분석 -> 소재 선택(Reasoning) -> 생성 -> 검증 -> (필요시) 재생성
- **Events**: `step_start`, `step_complete`, `selection`, `content`, `system` (재시도 알림), `done`

#### `POST /api/ai/cover-letters/selected`
사용자가 직접 선택한 블록과 자소서를 바탕으로 작성합니다.
- **Flow**: 로딩 -> 공고/기업 분석 -> 생성 -> 검증 -> (필요시) 재생성

#### `POST /api/ai/cover-letters/refine`
기존 내용을 사용자의 피드백에 맞춰 수정합니다.
- **Input**: `original_content`, `feedback`, `question`
- **Feature**: 이전 내용의 맥락을 유지하면서 요청 사항을 반영

### 2. 분석 및 데이터 처리

#### `POST /api/ai/blocks/generate`
프로젝트 경험이나 기존 자소서 텍스트에서 재사용 가능한 **'경험 블록(Block)'**을 추출합니다.
- **Output**: 블록 리스트 (제목, 내용, 태그, 카테고리)

#### `POST /api/ai/job-postings/analyze`
채용공고 텍스트나 URL을 입력받아 직무 요구사항, 우대사항, 핵심 키워드를 구조화된 데이터로 추출합니다.

---

## 🔧 핵심 도구 (Core Tools)

### CharacterCountValidator
생성 품질을 보장하는 핵심 컴포넌트입니다.
- **기능**: 최소/최대 글자 수 비율(0.8 ~ 1.2) 검증
- **피드백**: "현재 500자, 목표 800자. 부족한 300자를 더 채워주세요"와 같은 명확한 수치 피드백 생성
- **적용**: 모든 생성 Chain의 후처리 단계에 적용됨

### JobPostingScraperTool
- **기능**: Jsoup/BS4 기반 스크래핑이 아닌, LLM 기반의 유연한 파싱 지원
- **지원**: 자소설닷컴 및 일반 텍스트 포맷

### SerperSearchTool
- **기능**: 기업명 + "인재상", "비전" 등의 키워드 조합 검색
- **통합**: 생성 전 단계에서 자동으로 실행되어 Context에 주입됨

---

## 🔑 환경 설정 (Configuration)

`.env` 파일을 통해 다음 설정을 관리합니다.

```env
# AI Models
GMS_API_KEY=sk-...           # 통합 API Key
GPT_MODEL=gpt-4o
GEMINI_MODEL=gemini-1.5-pro
CLAUDE_MODEL=claude-3-5-sonnet

# External Tools
SERPER_API_KEY=...           # Google Search API

# Backend Connection
BACKEND_API_BASE_URL=http://localhost:8080
```

---

## 📅 Roadmap & Status

### ✅ Completed
- [x] 다중 모델(LLM) 지원 구조 구축
- [x] LangChain 기반 생성/수정/분석 체인 구현
- [x] 하이브리드 스트리밍 (SSE + Backend Logic)
- [x] 자동 검증 및 재작성 루프 (Auto-Regeneration)
- [x] 기업 정보 검색 및 공고 분석 통합
- [x] 토큰 사용량 추적 모듈 (Callback)

### ⏳ Future Plan (To-Do)
- [ ] **Backend Integration**: 생성 결과 저장 및 토큰 리포트 연동 (현재 Interface만 구현됨)
- [ ] **Prompt Optimization**: 모델별(Claude vs GPT) 최적화 프롬프트 분리
- [ ] **Cost Optimization**: 단순 분석 작업에 소형 모델(gpt-4o-mini 등) 적용
- [ ] **Evaluation System**: 생성 품질 정량 평가 지표 도입

---

## 🐳 Docker 통합 배포 (Docker Integration)

AI 서비스와 Spring Backend를 Nginx 게이트웨이로 통합 관리하는 Docker Compose 환경을 구성했습니다.

### 아키텍처 (Architecture)

```
                        ┌─────────────────────────────────────────┐
                        │              Client (Browser)           │
                        └─────────────────┬───────────────────────┘
                                          │
                                          ▼ :80
                        ┌─────────────────────────────────────────┐
                        │           Nginx Gateway                 │
                        │         (ozazak-gateway)                │
                        │                                         │
                        │   /api/ai/*  ──────►  AI Service        │
                        │   /api/*     ──────►  Spring Backend    │
                        └─────────────────┬───────────────────────┘
                                          │
                   ┌──────────────────────┼──────────────────────┐
                   │                      │                      │
                   ▼ :8000                ▼ :8080                │
        ┌──────────────────┐    ┌──────────────────┐            │
        │   AI Service     │    │  Spring Backend  │            │
        │   (FastAPI)      │    │   (Spring Boot)  │            │
        │  ozazak-ai-local │    │ ozazak-back-local│            │
        └──────────────────┘    └────────┬─────────┘            │
                                         │                      │
                   ┌─────────────────────┼──────────────────────┘
                   │                     │
                   ▼ :5432               ▼ :6379
        ┌──────────────────┐    ┌──────────────────┐
        │    PostgreSQL    │    │      Redis       │
        │ozazak-postgres   │    │  ozazak-redis    │
        └──────────────────┘    └──────────────────┘
```

### 서비스 구성 (Services)

| 서비스 | 컨테이너명 | 포트 | 설명 |
|--------|-----------|------|------|
| Nginx | ozazak-gateway | 80 | API 게이트웨이, 라우팅 |
| AI | ozazak-ai-local | 8000 (internal) | FastAPI 기반 AI 서비스 |
| Backend | ozazak-back-local | 8080 (internal) | Spring Boot 백엔드 |
| PostgreSQL | ozazak-postgres-local | 5432 | 메인 데이터베이스 |
| Redis | ozazak-redis-local | 6379 | 캐시/세션 저장소 |

### 실행 방법 (How to Run)

```bash
# back 폴더에서 실행
cd back

# 전체 서비스 시작 (빌드 포함)
docker-compose -f docker-compose-test.yml up -d --build

# 상태 확인
docker-compose -f docker-compose-test.yml ps

# 로그 확인
docker-compose -f docker-compose-test.yml logs -f

# 서비스 중지
docker-compose -f docker-compose-test.yml down

# 볼륨까지 삭제 (DB 초기화)
docker-compose -f docker-compose-test.yml down -v
```

### API 라우팅 (Nginx Routing)

| 경로 | 대상 서비스 | 예시 |
|------|------------|------|
| `/api/ai/*` | FastAPI (AI) | `GET /api/ai/health` |
| `/api/*` | Spring Boot | `GET /api/communities` |

### 환경 변수 (.env)

`back/.env` 파일에 다음 변수를 설정합니다:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ozazak
DB_USERNAME=b205admin
DB_PASSWORD=b205admin

# Spring
SPRING_PROFILES_ACTIVE=local
JWT_SECRET=your-jwt-secret-key

# AI Service (optional)
GMS_API_KEY=your-api-key
SERPER_API_KEY=your-serper-key
```

### Health Check

```bash
# AI 서비스 헬스체크
curl http://localhost/api/ai/health

# 응답 예시
{"status":"healthy","version":"0.1.0","available_models":["gpt","gemini","gemini-flash","claude"]}
```
