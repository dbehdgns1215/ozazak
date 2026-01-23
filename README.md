# S14P11B205 프로젝트

## 프로젝트 구조
이 프로젝트는 모노레포 구조로 다음과 같은 디렉토리를 포함합니다:
- `front/`: 프런트엔드 애플리케이션 (현재 비어 있음)
- `back/`: 백엔드 스프링 부트 애플리케이션 (Gradle 멀티 모듈 + 헥사고날 아키텍처)

## 백엔드 아키텍처
백엔드는 엄격한 **헥사고날 아키텍처(Hexagonal Architecture)**를 따르며 다음과 같은 모듈로 구성됩니다:
1.  **domain**: 순수 Java 도메인 모델 및 Value Object(VO). 프레임워크 의존성 없음.
2.  **application**: 비즈니스 로직, UseCase, Port 정의.
3.  **infra**: 인프라 어댑터, JPA 엔티티, 리포지토리, Flyway 마이그레이션.
4.  **presentation**: 웹 레이어, 컨트롤러, DTO.

## 사전 요구 사항
- **JDK 17**
- **Docker & Docker Compose**

## 실행 방법 (Execution)

이 프로젝트는 개발 편의성을 위한 `local` 환경과 실제 운영을 위한 `prod` 환경을 분리하여 제공합니다.

### 1. 로컬 개발 및 테스트 환경 (Local)
로컬 환경에서는 **테스트 데이터(Mock Data)가 자동으로 생성**되며, 상세한 SQL 로그가 출력됩니다.

- **실행 프로파일**: `local`
- **데이터베이스**: 자체 Docker 컨테이너 생성 (Postgres 5432)
- **주요 특징**: 
  - 서버 실행 시 테스트 사용자(`김싸피`, `홍길동`) 및 샘플 게시글 자동 생성
  - JPA SQL 로그 및 파라미터 바인딩 로그 출력 (`DEBUG`)

**실행 명령어:**
```bash
# Docker Compose (Local 데이터베이스 및 서버 전체 실행)
docker-compose up --build -d
```
 
### 2. 운영 환경 (Production)
운영 환경에서는 테스트 데이터를 생성하지 않으며, Flyway를 통한 **데이터베이스 스키마 검증**만 수행합니다.

- **실행 프로파일**: `prod`
- **주요 특징**:
  - 테스트 데이터 생성 안 함
  - SQL 로그 비활성화 및 성능 최적화 설정
  - Flyway를 이용한 초기 스키마(`V1__init.sql`) 자동 반영

**실행 명령어:**
```bash
# Docker Compose (Production 설정으로 실행)
docker-compose -f docker-compose-prod.yml up --build -d
```

---

## 데이터베이스 접속 정보
- **초기 접속 정보 (공통)**: 
  - DB Name: `ozazak`
  - User: `postgres`
  - Password: `password` (prod 환경에서는 환경변수 설정 권장)

## API 문서
애플리케이션 실행 후 아래 주소에서 Swagger 문서를 확인할 수 있습니다.
- [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## 최근 리팩토링 사항
- **Domain VO 분리**: 엔티티 내부에 정의되었던 VO 레코드들을 각각 별도의 파일로 추출하여 `vo` 패키지에서 관리하도록 개선되었습니다.
- **Gradle 멀티 모듈화**: 프로젝트 구조를 헥사고날 아키텍처에 맞게 4개의 모듈로 분리하였습니다.
