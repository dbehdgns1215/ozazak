# AI 자기소개서 생성 서비스 - 프로젝트 구조

## 📁 프로젝트 구조

```
ai/
├── 📄 .env                    # 환경변수 (API Key 등)
├── 📄 .env.example            # 환경변수 예시
├── 📄 .gitignore              # Git 제외 파일 목록
├── 📄 Dockerfile              # Docker 이미지 빌드 설정
├── 📄 docker-compose.yml      # Docker Compose 설정
├── 📄 requirements.txt        # Python 패키지 의존성
├── 📄 README.md               # 프로젝트 설명서
├── 📄 init.sql                # DB 초기화 SQL
│
├── 📂 src/                    # 소스 코드
│   ├── 📄 __init__.py         # 버전 정보
│   ├── 📂 config/
│   │   └── 📄 settings.py     # 앱 설정 (멀티 모델 지원)
│   │
│   └── 📂 adapters/           # 헥사고날 아키텍처 어댑터
│       ├── 📂 inbound/rest/   # REST API
│       │   ├── 📄 main.py     # FastAPI 엔드포인트
│       │   └── 📄 schemas.py  # 요청/응답 스키마
│       │
│       └── 📂 outbound/llm/   # LLM 어댑터 (멀티 모델)
│           ├── 📄 base_llm_adapter.py   # 베이스 인터페이스
│           ├── 📄 openai_adapter.py     # GPT 어댑터
│           ├── 📄 gemini_adapter.py     # Gemini 어댑터
│           ├── 📄 claude_adapter.py     # Claude 어댑터
│           ├── 📄 llm_factory.py        # 모델 선택 팩토리
│           ├── 📂 chains/
│           │   ├── 📄 block_chain.py
│           │   ├── 📄 cover_letter_chain.py
│           │   └── 📄 job_posting_chain.py
│           └── 📂 prompts/
│               ├── 📄 block_generation_prompt.py
│               ├── 📄 cover_letter_prompt.py
│               └── 📄 job_posting_prompt.py
│
└── 📂 test_data/              # 테스트 데이터
```

---

## 🤖 지원 AI 모델

| 모델 | 타입 | 설명 |
|-----|------|-----|
| Gemini 2.5 Flash Lite | `gemini-flash` | **기본값** - 빠르고 저렴 |
| Gemini 2.5 Pro | `gemini` | 고품질 응답 |
| GPT 5.1 | `gpt` | OpenAI 최신 모델 |
| Claude Sonnet 4.5 | `claude` | Anthropic 모델 |

---

## 📋 파일별 역할

### LLM 어댑터 (outbound/llm/)

| 파일명 | 역할 |
|--------|------|
| `base_llm_adapter.py` | 모든 LLM 어댑터가 구현할 추상 인터페이스 |
| `openai_adapter.py` | GPT 모델 연동 (LangChain 사용) |
| `gemini_adapter.py` | Gemini 모델 연동 (HTTP API) |
| `claude_adapter.py` | Claude 모델 연동 (HTTP API) |
| `llm_factory.py` | 모델 타입으로 어댑터 인스턴스 반환 |

### Chains (chains/)

| 파일명 | 역할 |
|--------|------|
| `block_chain.py` | 프로젝트/자소서에서 블록 추출 |
| `cover_letter_chain.py` | STAR 구조 기반 자소서 생성 |
| `job_posting_chain.py` | 채용공고 분석 |

### Prompts (prompts/)

| 파일명 | 역할 |
|--------|------|
| `block_generation_prompt.py` | 블록 추출 GPT 프롬프트 |
| `cover_letter_prompt.py` | 자소서 생성 프롬프트 (STAR 구조) |
| `job_posting_prompt.py` | 채용공고 분석 프롬프트 |

---

## 📡 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 헬스체크 + 사용 가능한 모델 목록 |
| POST | `/api/ai/blocks/generate` | 블록 추출 |
| POST | `/api/ai/job-postings/analyze` | 채용공고 분석 |
| POST | `/api/ai/cover-letters/generate` | 자소서 생성 |

모든 API에서 `model_type` 파라미터로 모델 선택 가능 (기본값: `gemini-flash`)

---

## 🚀 실행 방법

```bash
# 환경변수 설정
cp .env.example .env
# .env에 GMS_API_KEY 설정

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn src.adapters.inbound.rest.main:app --reload --port 8000

# Docker 실행
docker-compose up -d
```

---

## 📡 API 사용 예시

```json
POST /api/ai/cover-letters/generate

{
  "user_id": "user123",
  "question": "지원 동기를 작성해주세요.",
  "blocks": ["경험1", "경험2"],
  "model_type": "gpt",  // 선택: gpt, gemini, gemini-flash, claude, 생략시 gemini-flash
  "char_limit": 800
}
```
