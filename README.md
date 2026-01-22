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

## 시작하기

### 1. 로컬 개발 환경 설정
**데이터베이스 실행**
Docker Compose를 사용하여 PostgreSQL 데이터베이스를 시작합니다.
```bash
docker-compose up -d
```
이 명령어는 5432 포트에서 Postgres를 실행합니다 (사용자: postgres, 비밀번호: password, DB: s14p11b205).

**백엔드 실행**
백엔드 디렉토리로 이동하여 애플리케이션을 실행합니다.
```bash
cd back
./gradlew :presentation:bootRun
```
Swagger UI 접속 주소: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### 2. 도커를 이용한 전체 빌드 및 실행
애플리케이션 전체를 도커 컨테이너로 빌드하고 실행하려면 다음 명령어를 사용합니다:

```bash
docker-compose up --build -d
```

## 데이터베이스 마이그레이션
Flyway를 사용하여 DB 마이그레이션을 관리합니다. 초기 스키마는 `back/infra/src/main/resources/db/migration/V1__init.sql`에 위치합니다.
애플리케이션 시작 시 Flyway가 자동으로 데이터베이스 마이그레이션을 수행합니다.

## 최근 리팩토링 사항
- **Domain VO 분리**: 엔티티 내부에 정의되었던 VO 레코드들을 각각 별도의 파일로 추출하여 `vo` 패키지에서 관리하도록 개선되었습니다.
- **Gradle 멀티 모듈화**: 프로젝트 구조를 헥사고날 아키텍처에 맞게 4개의 모듈로 분리하였습니다.
