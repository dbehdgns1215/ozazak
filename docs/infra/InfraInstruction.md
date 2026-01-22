# 🏗️ 인프라 및 배포 가이드 (Infrastructure & CI/CD)

이 문서는 우리 프로젝트의 **시스템 아키텍처**, **로컬 개발 환경 구축**, **운영 배포 프로세스**를 설명합니다.

---

## 📌 1. 전체 시스템 아키텍처

우리는 **로컬(Local)** 과 **운영(Production)** 환경을 분리하여 운영합니다.

| 구분             | **로컬 개발 (Local)** | **운영 서버 (Production/EC2)** |
|:---------------| :--- | :--- |
| **목표**         | 빠른 개발 및 디버깅 | 안정성, 보안, 무중단 배포 |
| **서버 실행**      | **IntelliJ (IDE)** 직접 실행 | **Docker Container** 실행 |
| **DB / Cache** | **Docker** (`docker-compose.yml`) | **Docker** (`docker-compose-prod.yml`) |
| **Network**    | `localhost` 통신 | Docker Network (`bridge`) |
| **Profile**    | `spring.profiles.active=local` | `spring.profiles.active=prod` |

- Profile 위치: `(back/presentation/src/main/resources/application.yml)`

---

## 🛠️ 2. 로컬 개발 환경 구축

신규 프로젝트 세팅 시 반드시 아래 순서대로 진행해 주세요.

### 2-1. 보안 설정 (`.env` 파일 생성)
프로젝트 최상위 루트(`S14P11B205/`)에 `.env` 파일을 생성해야 합니다.<br>
공유해준 `.env` 파일을 사용하면 됩니다. <br>
*(주의: 이 파일은 절대 Git에 커밋 금지)*

### 2-2. 인프라 실행 (Docker)

**로컬 개발** 시 백엔드 서버(Spring Boot)를 제외한 **DB와 Redis는 Docker로 띄웁니다.**

```bash
# 프로젝트 루트 경로에서 실행
$ docker-compose up -d
```

> **확인:** `docker ps` 명령어로 `local-postgres`, `local-redis` 컨테이너가 떠 있는지 확인하세요.

### 2-3. IntelliJ 실행 설정

서버 실행 전, IntelliJ의 Run Configuration을 확인해주세요.

1. `PresentationApplication` 파일 우클릭 -> **Modify Run Configuration**
2. **Active profiles**: `local` 입력
3. **Environment variables**: (선택) `.env` 파일 플러그인 연동 또는 직접 변수 입력
4. **Working Directory**: 프로젝트 루트 폴더(`S14P11B205`)로 설정되어 있는지 확인

#### 매우 중요
- 만약, 위 설정을 해주지 않을 시에는 기본 `application.yml`만 인식하게 됨.

---

## 🚀 3. CI/CD 자동화 (Jenkins)

우리 프로젝트는 **Jenkins**를 통해 `master` 브랜치에 코드가 푸시되면 자동으로 운영 서버에 배포됩니다.

### 3-1. 배포 파이프라인 흐름

1. **Code Push**: 개발자가 `GitLab`의 `master` 브랜치로 코드 병합(Merge).
2. **Webhook**: GitLab이 Jenkins에게 변경 사항 알림.
3. **Build**: Jenkins가 Gradle을 사용하여 프로젝트 빌드 (`bootJar`).
4. **Docker Build**: `Dockerfile`을 기반으로 새로운 서버 이미지를 생성.
5. **Deploy**: 운영 서버의 기존 컨테이너를 내리고(`down`), 새 컨테이너를 실행(`up`).

### 3-2. 팀원 주의사항

* **배포 확인**: 배포가 완료되면 Swagger(`http://서버IP:8080/swagger-ui.html`)에서 변경 사항을 확인할 수 있습니다.
* **DB 변경**: 엔티티 수정 시 `Flyway` 혹은 `ddl-auto` 정책에 따라 DB 스키마가 변경될 수 있으니 주의 바랍니다.
* **환경 변수**: 운영 서버의 DB 비밀번호 등은 Jenkins 내부 **Credentials**로 안전하게 관리됩니다.

---

## 🐳 4. 운영 배포 상세 설정 (참고용)

서버 배포에 사용되는 주요 파일 설명입니다.

### 4-1. Dockerfile (멀티 스테이징 빌드)

이미지 용량을 최소화하기 위해 **빌드 단계(Gradle)** 와 **실행 단계(JRE)** 를 분리했습니다.

```dockerfile
# 1. Build Stage
FROM gradle:7.6-jdk17-alpine AS builder
WORKDIR /project
COPY . .
# presentation 모듈만 실행 가능한 JAR로 빌드
RUN ./gradlew :back:presentation:bootJar --no-daemon

# 2. Run Stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /project/back/presentation/build/libs/*-SNAPSHOT.jar app.jar
ENV TZ=Asia/Seoul
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]

```

### 4-2. docker-compose-prod.yml

운영 서버에서는 모든 서비스가 Docker 네트워크 내부에서 통신합니다.

* **DB 접속 주소**: `localhost`가 아닌 컨테이너 서비스명(`ozazak-db-prod`)을 사용합니다.
* **볼륨 마운트**: DB 데이터는 호스트의 `./pgdata` 경로에 영구 저장됩니다.

