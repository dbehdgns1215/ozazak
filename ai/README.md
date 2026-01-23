# 🤖 AI 자기소개서 생성 시스템

LangChain 기반 멀티 AI 모델 지원 자기소개서 자동 생성 시스템입니다.

> **지원 모델**: GPT 5.1, Gemini 2.5 Pro/Flash, Claude Sonnet 4.5

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| **🔄 멀티 모델 지원** | GPT, Gemini, Claude 등 4개 AI 모델 선택 가능 |
| **📄 채용공고 분석** | 인재상, 업무/KPI, 우대사항, 핵심역량 자동 추출 |
| **📝 블록 추출** | 프로젝트/자소서에서 재사용 가능한 경험 블록 생성 |
| **✍️ 자소서 생성** | STAR 구조 기반 맞춤형 자기소개서 작성 |

---

## 🏗️ 아키텍처

**헥사고날 아키텍처 (Ports and Adapters)** 기반으로 설계되었습니다.

```
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │ HTTP
┌────────▼────────┐
│ Spring Backend  │
└────────┬────────┘
         │ HTTP
┌────────▼─────────────────────────────────────────┐
│         Python AI Service (이 프로젝트)            │
│  ┌────────────────────────────────────────────┐  │
│  │ Inbound Adapter (FastAPI REST API)         │  │
│  └─────────────────┬──────────────────────────┘  │
│                    │                              │
│  ┌─────────────────▼──────────────────────────┐  │
│  │ Outbound Adapter (LangChain + Multi LLM)   │  │
│  │  ├── OpenAI GPT 5.1                        │  │
│  │  ├── Google Gemini 2.5 Pro/Flash           │  │
│  │  └── Anthropic Claude Sonnet 4.5           │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
                    │ API (GMS)
           ┌────────▼────────┐
           │  SSAFY GMS API  │
           └─────────────────┘
```

### 핵심 개념

- **도메인 계층**: 비즈니스 로직이 위치하며, 외부 의존성을 알지 못합니다
- **포트 (Ports)**: 도메인과 외부 세계 간의 인터페이스
- **어댑터 (Adapters)**: 포트를 구현하여 실제 외부 시스템과 연결
  - **Inbound Adapter**: REST API (FastAPI)
  - **Outbound Adapter**: LangChain + Multi LLM

---

## 🤖 지원 AI 모델

| 모델 | `model_type` | 특징 |
|------|-------------|------|
| **Gemini 2.5 Flash Lite** | `gemini-flash` | ⭐ **기본값** - 빠르고 저렴 |
| Gemini 2.5 Pro | `gemini` | 고품질 응답 |
| GPT 5.1 | `gpt` | OpenAI 최신 모델 |
| Claude Sonnet 4.5 | `claude` | Anthropic 모델 |

---

## 📁 프로젝트 구조

```
ai/
├── 📄 .env                    # 환경변수 (API Key)
├── 📄 .env.example            # 환경변수 예시
├── 📄 .gitignore              # Git 제외 파일 목록
├── 📄 Dockerfile              # Docker 이미지 빌드
├── 📄 docker-compose.yml      # Docker Compose
├── 📄 requirements.txt        # Python 의존성
├── 📄 init.sql                # DB 초기화 SQL
│
├── 📂 src/
│   ├── 📄 __init__.py         # 버전 정보
│   │
│   ├── 📂 config/
│   │   └── 📄 settings.py     # 앱 설정 (멀티 모델 지원)
│   │
│   └── 📂 adapters/
│       ├── 📂 inbound/rest/   # REST API (Inbound)
│       │   ├── 📄 main.py     # FastAPI 엔드포인트
│       │   └── 📄 schemas.py  # 요청/응답 스키마
│       │
│       └── 📂 outbound/llm/   # LLM 어댑터 (Outbound)
│           ├── 📄 base_llm_adapter.py   # 베이스 인터페이스
│           ├── 📄 custom_llms.py        # 커스텀 LangChain LLM
│           ├── 📄 openai_adapter.py     # GPT 어댑터
│           ├── 📄 gemini_adapter.py     # Gemini 어댑터
│           ├── 📄 claude_adapter.py     # Claude 어댑터
│           ├── 📄 llm_factory.py        # 모델 팩토리
│           │
│           ├── 📂 chains/               # LangChain 체인
│           │   ├── 📄 block_chain.py          # 블록 추출
│           │   ├── 📄 cover_letter_chain.py   # 자소서 생성
│           │   └── 📄 job_posting_chain.py    # 채용공고 분석
│           │
│           └── 📂 prompts/              # 프롬프트 템플릿
│               ├── 📄 block_generation_prompt.py
│               ├── 📄 cover_letter_prompt.py
│               └── 📄 job_posting_prompt.py
│
└── 📂 test_data/              # 테스트 데이터
```

---

## 📋 파일별 상세 역할

### LLM 어댑터 (`outbound/llm/`)

| 파일명 | 역할 |
|--------|------|
| `base_llm_adapter.py` | 모든 LLM 어댑터가 구현할 추상 인터페이스 |
| `custom_llms.py` | Gemini/Claude용 커스텀 LangChain Chat Model |
| `openai_adapter.py` | GPT 모델 연동 (LangChain `ChatOpenAI` 사용) |
| `gemini_adapter.py` | Gemini 모델 연동 (LangChain 커스텀 LLM 사용) |
| `claude_adapter.py` | Claude 모델 연동 (LangChain 커스텀 LLM 사용) |
| `llm_factory.py` | `model_type`으로 어댑터 인스턴스 생성 + 캐싱 |

### Chains (`chains/`)

| 파일명 | 역할 |
|--------|------|
| `block_chain.py` | 프로젝트/자소서에서 경험 블록 추출 |
| `cover_letter_chain.py` | STAR 구조 기반 자소서 생성 |
| `job_posting_chain.py` | 채용공고에서 핵심 정보 분석 |

### Prompts (`prompts/`)

| 파일명 | 역할 |
|--------|------|
| `block_generation_prompt.py` | 블록 추출용 프롬프트 템플릿 |
| `cover_letter_prompt.py` | 자소서 생성 프롬프트 (STAR 구조) |
| `job_posting_prompt.py` | 채용공고 분석 프롬프트 |

---

## 🚀 빠른 시작

### 1. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일 편집:
```env
# SSAFY GMS API Key (필수)
GMS_API_KEY=your-gms-api-key

# 기본 모델 설정
DEFAULT_MODEL=gemini-flash
```

### 2. 로컬 실행

```bash
# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn src.adapters.inbound.rest.main:app --reload --port 8000
```

### 3. Docker 실행

```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

---

## 📡 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/health` | 헬스체크 + 지원 모델 목록 |
| `POST` | `/api/ai/blocks/generate` | 블록 추출 |
| `POST` | `/api/ai/job-postings/analyze` | 채용공고 분석 |
| `POST` | `/api/ai/cover-letters/generate` | 자소서 생성 |

> 📚 **API 문서**: http://localhost:8000/docs (Swagger UI)

모든 API에서 `model_type` 파라미터로 모델 선택 가능 (기본값: `gemini-flash`)

---

## 📋 API 사용 예시

### 1. 채용공고 분석

```bash
curl -X POST http://localhost:8000/api/ai/job-postings/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "job_posting_text": "삼성전자 소프트웨어 개발자 채용...",
    "model_type": "gemini-flash"
  }'
```

**응답:**
```json
{
  "success": true,
  "analysis": {
    "ideal_candidate": "도전과 혁신을 추구하는 인재",
    "key_responsibilities": ["SW 개발", "시스템 설계"],
    "preferred_qualifications": ["Python 숙련", "AI/ML 경험"],
    "core_competencies": ["문제해결력", "협업능력"],
    "keywords": ["혁신", "기술력", "글로벌"],
    "writing_tips": ["구체적인 성과 중심 작성"]
  },
  "model_used": "gemini-flash"
}
```

### 2. 블록 추출

```bash
curl -X POST http://localhost:8000/api/ai/blocks/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "source_type": "project",
    "source_content": "프로젝트명: AI 자소서 도우미\n기술: Python, FastAPI\n성과: 작성 시간 80% 단축",
    "model_type": "gpt"
  }'
```

### 3. 자소서 생성

```bash
curl -X POST http://localhost:8000/api/ai/cover-letters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question": "지원 동기와 입사 후 포부를 작성해주세요.",
    "blocks": ["Python FastAPI 개발 경험", "AI 프로젝트 리드 경험"],
    "model_type": "gemini",
    "char_limit": 800,
    "company_name": "삼성전자",
    "position": "소프트웨어 개발자",
    "job_analysis": {
      "ideal_candidate": "도전과 혁신을 추구하는 인재",
      "core_competencies": ["문제해결력", "협업능력"]
    }
  }'
```

---

## 🔗 Spring Backend 연동

### RestTemplate 사용 예시

```java
@Service
@RequiredArgsConstructor
public class AIService {
    
    private final RestTemplate restTemplate;
    
    @Value("${ai.service.url}")
    private String aiServiceUrl;
    
    public JobPostingAnalysisResponse analyzeJobPosting(String jobPostingText) {
        String url = aiServiceUrl + "/api/ai/job-postings/analyze";
        Map<String, Object> request = Map.of(
            "job_posting_text", jobPostingText,
            "model_type", "gemini-flash"
        );
        return restTemplate.postForObject(url, request, JobPostingAnalysisResponse.class);
    }
    
    public CoverLetterResponse generateCoverLetter(CoverLetterRequest request) {
        String url = aiServiceUrl + "/api/ai/cover-letters/generate";
        return restTemplate.postForObject(url, request, CoverLetterResponse.class);
    }
}
```

### application.yml

```yaml
ai:
  service:
    url: http://localhost:8000
```

---

## 📝 블록 카테고리

| 카테고리 | 설명 |
|---------|------|
| `TECHNICAL_SKILL` | 기술적 역량 |
| `PROBLEM_SOLVING` | 문제 해결 경험 |
| `TEAMWORK` | 협업 및 팀워크 |
| `LEADERSHIP` | 리더십 경험 |
| `ACHIEVEMENT` | 성과 및 결과 |
| `LEARNING` | 학습 및 성장 |

---

## 💡 LangChain 연동 가이드

### Outbound Adapter 패턴

LangChain은 **Outbound Adapter**에서 연결됩니다:

1. **도메인 계층**은 LangChain의 존재를 알지 못합니다
2. **포트 인터페이스**를 통해 추상화된 LLM 서비스와 통신합니다
3. **Outbound Adapter**에서 실제 LangChain 구현이 이루어집니다

이를 통해:
- LangChain을 다른 LLM 프레임워크로 교체 가능
- 도메인 로직은 변경 없이 유지
- 테스트 시 Mock 객체로 쉽게 대체 가능

### 멀티 모델 팩토리 패턴

```python
from src.adapters.outbound.llm.llm_factory import get_llm_adapter

# 기본 모델 사용 (gemini-flash)
adapter = get_llm_adapter()

# 특정 모델 지정
gpt_adapter = get_llm_adapter("gpt")
gemini_adapter = get_llm_adapter("gemini")
claude_adapter = get_llm_adapter("claude")
```

---

## 🧪 테스트

```bash
# 멀티 모델 테스트
python test_multi_model.py

# 단위 테스트
pytest tests/ -v

# 코드 포맷팅
black src/
```

---

## 📦 주요 의존성

```
fastapi>=0.104.1
uvicorn>=0.24.0
pydantic>=2.5.0
pydantic-settings>=2.1.0
langchain>=0.1.0
langchain-openai>=0.0.2
langchain-core>=0.1.0
httpx>=0.25.0
python-dotenv>=1.0.0
```

---

## 🔧 환경변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `GMS_API_KEY` | SSAFY GMS API 키 | (필수) |
| `DEFAULT_MODEL` | 기본 LLM 모델 | `gemini-flash` |
| `GPT_MODEL` | GPT 모델명 | `gpt-5.1` |
| `GEMINI_PRO_MODEL` | Gemini Pro 모델명 | `gemini-2.5-pro` |
| `GEMINI_FLASH_MODEL` | Gemini Flash 모델명 | `gemini-2.5-flash-lite-preview-06-17` |
| `CLAUDE_MODEL` | Claude 모델명 | `claude-sonnet-4-5-20250514` |
| `LLM_TEMPERATURE` | 응답 다양성 | `0.7` |
| `APP_HOST` | 서버 호스트 | `0.0.0.0` |
| `APP_PORT` | 서버 포트 | `8000` |
| `BACKEND_API_BASE_URL` | Spring Backend URL | `http://localhost:8080` |

---

## 📝 라이선스

SSAFY 14기 공통 프로젝트 '수상한 사람들'
