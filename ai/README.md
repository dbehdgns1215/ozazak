# 자기소개서 AI 생성 시스템

LangChain과 OpenAI GPT-4를 활용한 자기소개서 자동 생성 시스템입니다.

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
┌────────▼─────────────────────────────────────┐
│         Python AI Service (이 프로젝트)        │
│  ┌──────────────────────────────────────┐   │
│  │ Inbound Adapter (FastAPI REST API)   │   │
│  └─────────────────┬────────────────────┘   │
│                    │                         │
│  ┌─────────────────▼────────────────────┐   │
│  │    Application Layer (Use Cases)     │   │
│  └─────────────────┬────────────────────┘   │
│                    │                         │
│  ┌─────────────────▼────────────────────┐   │
│  │      Domain Layer (비즈니스 로직)      │   │
│  └─────────────────┬────────────────────┘   │
│                    │                         │
│  ┌─────────────────▼────────────────────┐   │
│  │ Outbound Adapter (LangChain + GPT-4) │   │
│  └──────────────────────────────────────┘   │
└───────────────────┬──────────────────────────┘
                    │ API
           ┌────────▼────────┐
           │  OpenAI GPT-4   │
           └─────────────────┘
```

### 핵심 개념

- **도메인 계층**: 비즈니스 로직이 위치하며, 외부 의존성을 알지 못합니다
- **포트 (Ports)**: 도메인과 외부 세계 간의 인터페이스
- **어댑터 (Adapters)**: 포트를 구현하여 실제 외부 시스템과 연결
  - **Inbound Adapter**: REST API (FastAPI)
  - **Outbound Adapter**: LangChain + OpenAI GPT-4

## 🚀 주요 기능

### 1. 블록 자동 생성
프로젝트 정보나 이전 자기소개서를 분석하여 재사용 가능한 블록을 자동으로 추출합니다.

**카테고리:**
- `TECHNICAL_SKILL`: 기술적 역량
- `PROBLEM_SOLVING`: 문제 해결 경험
- `TEAMWORK`: 협업 및 팀워크
- `LEADERSHIP`: 리더십 경험
- `ACHIEVEMENT`: 성과 및 결과
- `LEARNING`: 학습 및 성장

### 2. 문항별 자기소개서 생성
주어진 블록들과 참고 자료를 활용하여 STAR 기법으로 자기소개서를 생성합니다.

## 📦 설치 및 실행

### 사전 요구사항
- Python 3.11+
- Docker & Docker Compose (선택)
- OpenAI API Key (SSAFY GMS 제공)

### 1. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 값을 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일 내용:
```env
OPENAI_API_KEY=your-actual-api-key-here
OPENAI_MODEL=gpt-4
BACKEND_API_BASE_URL=http://localhost:8080
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
# Docker 이미지 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

## 📚 API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 주요 엔드포인트

#### 1. 블록 생성
```http
POST /api/ai/blocks/generate
Content-Type: application/json

{
  "user_id": "user123",
  "source_type": "project",
  "source_content": "프로젝트명: AI 자기소개서 작성 보조 도구\n기술 스택: Python, FastAPI, LangChain, OpenAI GPT-4\n역할: 백엔드 개발 및 AI 통합\n성과: 자기소개서 작성 시간 80% 단축"
}
```

#### 2. 자기소개서 생성
```http
POST /api/ai/cover-letters/generate
Content-Type: application/json

{
  "user_id": "user123",
  "question": "지원 동기와 입사 후 포부를 작성해주세요.",
  "blocks": [
    "Python과 FastAPI를 활용한 RESTful API 개발 경험이 있습니다.",
    "LangChain을 도입하여 AI 기능을 성공적으로 구현했습니다."
  ],
  "references": [
    "저는 항상 새로운 기술을 학습하고 프로젝트에 적용하는 것을 즐깁니다..."
  ]
}
```

## 🔗 Spring 백엔드 연동

Spring 백엔드에서 Python AI 서비스를 호출하는 예시:

```java
@Service
public class AIService {
    
    @Value("${ai.service.url}")
    private String aiServiceUrl;
    
    private final RestTemplate restTemplate;
    
    public BlockGenerationResponse generateBlocks(BlockGenerationRequest request) {
        String url = aiServiceUrl + "/api/ai/blocks/generate";
        return restTemplate.postForObject(url, request, BlockGenerationResponse.class);
    }
    
    public CoverLetterGenerationResponse generateCoverLetter(CoverLetterGenerationRequest request) {
        String url = aiServiceUrl + "/api/ai/cover-letters/generate";
        return restTemplate.postForObject(url, request, CoverLetterGenerationResponse.class);
    }
}
```

`application.yml`:
```yaml
ai:
  service:
    url: http://localhost:8000
```

## 📁 프로젝트 구조

```
AI/
├── src/
│   ├── adapters/
│   │   ├── inbound/          # REST API (FastAPI)
│   │   │   └── rest/
│   │   │       ├── main.py   # FastAPI 앱
│   │   │       └── schemas.py
│   │   └── outbound/         # LangChain 연동
│   │       └── llm/
│   │           ├── openai_adapter.py  # 핵심 어댑터
│   │           ├── prompts/           # 프롬프트 템플릿
│   │           └── chains/            # LangChain 체인
│   └── config/
│       └── settings.py       # 환경 설정
├── requirements.txt          # Python 의존성
├── Dockerfile               # Docker 이미지 설정
├── docker-compose.yml       # Docker Compose 설정
└── README.md
```

## 🔧 개발

### 테스트 실행

```bash
pytest tests/ -v
```

### 코드 포맷팅

```bash
black src/
```

## 📝 라이선스

이 프로젝트는 SSAFY 공통 프로젝트입니다.

## 💡 LangChain 연동 가이드

### Outbound Adapter 패턴

LangChain은 **Outbound Adapter**에서 연결됩니다:

1. **도메인 계층**은 LangChain의 존재를 알지 못합니다
2. **포트 인터페이스**를 통해 추상화된 LLM 서비스와 통신합니다
3. **Outbound Adapter**(`openai_adapter.py`)에서 실제 LangChain 구현이 이루어집니다

이를 통해:
- LangChain을 다른 LLM 프레임워크로 교체 가능
- 도메인 로직은 변경 없이 유지
- 테스트 시 Mock 객체로 쉽게 대체 가능

### 주요 파일

- `src/adapters/outbound/llm/openai_adapter.py`: LangChain 메인 어댑터
- `src/adapters/outbound/llm/chains/`: LangChain 체인 구현
- `src/adapters/outbound/llm/prompts/`: 프롬프트 템플릿
