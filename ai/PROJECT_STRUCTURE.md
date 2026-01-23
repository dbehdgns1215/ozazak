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
│   ├── 📂 config/             # 설정
│   │   └── 📄 settings.py     # 앱 설정 (환경변수 로드)
│   │
│   └── 📂 adapters/           # 헥사고날 아키텍처 어댑터
│       ├── 📂 inbound/rest/   # REST API (입력 어댑터)
│       │   ├── 📄 main.py     # FastAPI 엔드포인트
│       │   └── 📄 schemas.py  # 요청/응답 스키마
│       │
│       └── 📂 outbound/llm/   # LangChain (출력 어댑터)
│           ├── 📄 openai_adapter.py  # OpenAI 연동 어댑터
│           ├── 📂 chains/            # LangChain Chain
│           │   ├── 📄 block_chain.py          # 블록 추출 Chain
│           │   ├── 📄 cover_letter_chain.py   # 자소서 생성 Chain
│           │   └── 📄 job_posting_chain.py    # 채용공고 분석 Chain
│           └── 📂 prompts/           # 프롬프트 템플릿
│               ├── 📄 block_generation_prompt.py   # 블록 추출 프롬프트
│               ├── 📄 cover_letter_prompt.py       # 자소서 생성 프롬프트
│               └── 📄 job_posting_prompt.py        # 채용공고 분석 프롬프트
│
└── 📂 test_data/              # 테스트 데이터
    ├── 📄 my_coverletter.txt  # 테스트용 자소서
    └── 📄 generated_enhanced.txt  # 생성 결과
```

---

## 📋 파일별 역할

### 루트 파일

| 파일명 | 역할 |
|--------|------|
| `.env` | OpenAI API Key, DB 정보 등 환경변수 저장 |
| `.env.example` | 환경변수 예시 (팀원 공유용) |
| `Dockerfile` | Docker 이미지 빌드 설정 |
| `docker-compose.yml` | 컨테이너 오케스트레이션 설정 |
| `requirements.txt` | Python 패키지 의존성 목록 |
| `init.sql` | PostgreSQL 테이블 초기화 DDL |

---

### src/config/

| 파일명 | 역할 |
|--------|------|
| `settings.py` | Pydantic 기반 설정 관리, `.env` 파일 로드 |

---

### src/adapters/inbound/rest/ (REST API)

| 파일명 | 역할 |
|--------|------|
| `main.py` | FastAPI 엔드포인트 정의 |
| `schemas.py` | Pydantic 요청/응답 스키마 |

**API 엔드포인트:**
- `GET /health` - 헬스체크
- `POST /api/ai/blocks/generate` - 블록 추출
- `POST /api/ai/job-postings/analyze` - 채용공고 분석
- `POST /api/ai/cover-letters/generate` - 자소서 생성

---

### src/adapters/outbound/llm/ (LangChain)

| 파일명 | 역할 |
|--------|------|
| `openai_adapter.py` | OpenAI GPT-4 연동 어댑터 (진입점) |

#### chains/ (LangChain Chain)

| 파일명 | 역할 |
|--------|------|
| `block_chain.py` | 프로젝트/자소서에서 재사용 블록 추출 |
| `cover_letter_chain.py` | STAR 구조 기반 자소서 생성 |
| `job_posting_chain.py` | 채용공고 분석 (인재상, 업무, 역량 추출) |

#### prompts/ (프롬프트 템플릿)

| 파일명 | 역할 |
|--------|------|
| `block_generation_prompt.py` | 블록 추출용 GPT 프롬프트 |
| `cover_letter_prompt.py` | 자소서 생성용 GPT 프롬프트 (STAR 구조) |
| `job_posting_prompt.py` | 채용공고 분석용 GPT 프롬프트 |

---

## 🏗️ 아키텍처

**헥사고날 아키텍처 (Hexagonal Architecture)**

```
[Spring Backend] → REST API (Inbound) → [Domain] → LangChain (Outbound) → [OpenAI GPT-4]
```

- **Inbound Adapter**: FastAPI REST API
- **Outbound Adapter**: LangChain + OpenAI

---

## 🚀 실행 방법

```bash
# 1. 환경변수 설정
cp .env.example .env
# .env 파일에 OPENAI_API_KEY 설정

# 2. 의존성 설치
pip install -r requirements.txt

# 3. 서버 실행
uvicorn src.adapters.inbound.rest.main:app --reload --port 8000

# 4. Docker로 실행
docker-compose up -d
```

---

## 📡 API 사용 예시

### 1. 채용공고 분석
```json
POST /api/ai/job-postings/analyze

{
  "user_id": "user123",
  "company_name": "삼성전자",
  "position": "AI/ML 엔지니어",
  "job_posting": "채용공고 내용..."
}
```

### 2. 자소서 생성
```json
POST /api/ai/cover-letters/generate

{
  "user_id": "user123",
  "question": "지원 동기와 포부를 작성해주세요.",
  "blocks": ["경험1", "경험2"],
  "job_analysis": { ... },
  "char_limit": 800,
  "company_name": "삼성전자",
  "position": "AI/ML 엔지니어"
}
```
