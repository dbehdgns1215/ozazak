# Scripts 폴더 구조

이 폴더에는 개발 및 테스트용 유틸리티 스크립트가 포함되어 있습니다.

## 폴더 구조

```
scripts/
├── data/           # 데이터 생성/처리 스크립트
│   ├── crawl_company_logos.py      # 회사 로고 크롤링
│   ├── fix_multiline_sql.py        # SQL 수정 유틸리티
│   ├── generate_2nd_data_sql.py    # 테스트 데이터 SQL 생성
│   └── generate_recruitment_sql.py # 채용 데이터 SQL 생성
│
├── test/           # 테스트 스크립트
│   ├── test_langgraph_pipeline.py  # LangGraph 파이프라인 테스트 (★ 핵심)
│   ├── test_api_simple.py          # API 엔드포인트 간단 테스트
│   ├── test_pipeline.py            # 종합 테스트 파이프라인
│   ├── test_generation.py          # 생성 품질 테스트
│   └── ...
│
└── README.md
```

## 주요 테스트 스크립트

### 1. LangGraph 파이프라인 테스트

백엔드 없이 AI 파이프라인을 직접 테스트합니다.

```bash
# 프로젝트 루트(ai/)에서 실행
cd ai

# 파이프라인 직접 테스트
python scripts/test/test_langgraph_pipeline.py pipeline

# 이벤트 스트리밍 테스트
python scripts/test/test_langgraph_pipeline.py events

# Use Case 레벨 테스트
python scripts/test/test_langgraph_pipeline.py usecase

# API 엔드포인트 테스트 (서버 실행 필요)
python scripts/test/test_langgraph_pipeline.py api

# 전체 테스트
python scripts/test/test_langgraph_pipeline.py all
```

### 2. API 간단 테스트

서버가 실행 중일 때 각 엔드포인트를 빠르게 테스트합니다.

```bash
# 먼저 서버 실행
uvicorn src.adapters.inbound.rest.main:app --port 8000

# 다른 터미널에서:
# 헬스 체크
python scripts/test/test_api_simple.py health

# Selected 엔드포인트 테스트
python scripts/test/test_api_simple.py selected

# 전체 테스트
python scripts/test/test_api_simple.py all
```

## 환경 설정

테스트 실행 전 `.env` 파일에 필요한 환경 변수가 설정되어 있어야 합니다:

```env
GMS_API_KEY=your_api_key_here
SERPER_API_KEY=your_serper_key_here  # 옵션: 기업 검색용
```

## 테스트 데이터

테스트 스크립트들은 내장된 샘플 데이터를 사용합니다:
- 샘플 질문 (자기소개서 문항)
- 샘플 경험 블록 (3개)
- 샘플 참고 자소서

실제 데이터로 테스트하려면 스크립트 내의 `TEST_*` 상수를 수정하세요.
