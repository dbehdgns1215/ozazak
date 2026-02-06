# 🚀 CI/CD 인프라 구성 문서

> 작성일: 2026-01-29

## 📋 목차
1. [아키텍처 개요](#아키텍처-개요)
2. [환경 분리 전략](#환경-분리-전략)
3. [Docker Compose 구성](#docker-compose-구성)
4. [Jenkins Pipeline](#jenkins-pipeline)
5. [Nginx 설정](#nginx-설정)
6. [트러블슈팅](#트러블슈팅)
7. [실행 방법](#실행-방법)

---

## 🏗️ 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────────┐
│                            EC2 Server                               │
│                                                                     │
│  ┌───────────────────── ozazak-network ─────────────────────────┐  │
│  │  (같은 네트워크 = 모든 컨테이너 간 통신 가능)                  │  │
│  │                                                               │  │
│  │   ┌─────────┐     ┌─────────┐     ┌─────────┐                │  │
│  │   │  nginx  │────▶│  back   │◀───▶│   ai    │                │  │
│  │   │   :80   │     │  :8080  │     │  :8000  │                │  │
│  │   └─────────┘     └────┬────┘     └─────────┘                │  │
│  │        │               │                                      │  │
│  │        │          ┌────┴────┐                                │  │
│  │        │          ▼         ▼                                │  │
│  │        │     ┌────────┐ ┌───────┐      ┌─────────┐           │  │
│  │        │     │postgres│ │ redis │      │ jenkins │           │  │
│  │        │     │ :5432  │ │ :6379 │      │  :8081  │           │  │
│  │        │     └────────┘ └───────┘      └─────────┘           │  │
│  │        │                                    │                 │  │
│  │        └───────────(nginx→jenkins 프록시)───┘                 │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ※ 화살표는 "실제 통신 흐름"을 나타냄 (네트워크 연결 X)             │
│  ※ 네트워크 = 바운더리. 안에 있으면 누구든 통신 가능                │
└─────────────────────────────────────────────────────────────────────┘
```

### Docker Network 개념

| 개념 | 설명 |
|------|------|
| **네트워크** | 컨테이너들의 **통신 범위(바운더리)** |
| **같은 네트워크** | 컨테이너명으로 서로 접근 가능 (예: `http://back:8080`) |
| **다른 네트워크** | 서로 통신 불가 (격리) |

### 실제 통신 흐름 (화살표 의미)

| 통신 | 설명 |
|------|------|
| nginx → back | API 요청 프록시 (`/api/*`) |
| nginx → ai | AI API 요청 프록시 (`/api/ai/*`) |
| nginx → jenkins | Jenkins UI 프록시 |
| back → postgres | DB 연결 |
| back → redis | 세션/캐시 |
| ai → back | AI가 백엔드 API 호출 |

| 서비스 | 설명 | 포트 | 컨테이너명 |
|--------|------|------|------------|
| nginx | 리버스 프록시 | 80 | ozazak-nginx |
| back | Spring Boot 백엔드 | 8080 | ozazak-back-prod |
| ai-service | FastAPI AI 서비스 | 8000 | ozazak-ai-prod |
| jenkins | CI/CD 서버 | 8081 | jenkins |
| postgres | 데이터베이스 | 5432 | ozazak-postgres-prod |
| redis | 캐시/세션 | 6379 | ozazak-redis-prod |

### 접근 URL

| 서비스 | URL |
|--------|-----|
| 메인 (프론트/백엔드/AI) | http://ozazak.13.124.6.228.nip.io |
| Swagger UI | http://ozazak.13.124.6.228.nip.io/swagger-ui/index.html |
| Jenkins | http://jenkins.13.124.6.228.nip.io 또는 http://13.124.6.228:8081 |

---

## 🔀 환경 분리 전략

### 파일 구조

```
back/
├── docker-compose-local.yml    # 로컬 개발용
├── docker-compose-prod.yml     # 프로덕션용
├── docker-compose-jenkins.yml  # Jenkins 전용 (분리)
├── .env.local                  # 로컬 환경변수
├── .env.prod                   # 프로덕션 환경변수
└── nginx/
    ├── nginx-local.conf        # 로컬 nginx 설정
    └── nginx-prod.conf         # 프로덕션 nginx 설정
```

### 환경변수 파일

#### .env.local
```env
SPRING_PROFILES_ACTIVE=local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ozazak
DB_USERNAME=ozazak
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### .env.prod
```env
SPRING_PROFILES_ACTIVE=prod
DB_HOST=ozazak-postgres-prod
DB_PORT=5432
DB_NAME=ozazak
DB_USERNAME=ozazak
DB_PASSWORD=your_password
REDIS_HOST=ozazak-redis-prod
REDIS_PORT=6379
```

### 환경 전환 방식

| 환경 | 실행 명령어 |
|------|-------------|
| 로컬 | `docker-compose -f docker-compose-local.yml up -d` |
| 프로덕션 | `docker-compose -f docker-compose-prod.yml up -d` |

---

## 🐳 Docker Compose 구성

### docker-compose-prod.yml

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:latest
    container_name: ozazak-nginx
    ports:
      - "80:80"
    volumes:
      - /home/ubuntu/nginx/nginx-prod.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - back
      - ai-service
    networks:
      - ozazak-network
    restart: always

  back:
    image: ozazak-backend:latest
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ozazak-back-prod
    depends_on:
      - postgres
      - redis
    env_file:
      - .env.prod
    environment:
      TZ: Asia/Seoul
    networks:
      - ozazak-network
    restart: always

  ai-service:
    image: ozazak-ai-service:latest
    build:
      context: ../ai
      dockerfile: Dockerfile
    container_name: ozazak-ai-prod
    env_file:
      - ../ai/.env
    environment:
      - TZ=Asia/Seoul
      - BACKEND_API_BASE_URL=http://ozazak-back-prod:8080
      - APP_ENV=production
    networks:
      - ozazak-network
    restart: always

  postgres:
    image: postgres:15
    container_name: ozazak-postgres-prod
    environment:
      TZ: Asia/Seoul
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-prod-data:/var/lib/postgresql/data
    networks:
      - ozazak-network
    restart: always

  redis:
    image: redis:7-alpine
    container_name: ozazak-redis-prod
    environment:
      TZ: Asia/Seoul
    volumes:
      - redis-prod-data:/data
    networks:
      - ozazak-network
    restart: always

volumes:
  postgres-prod-data:
  redis-prod-data:

networks:
  ozazak-network:
    external: true
```

### docker-compose-jenkins.yml (분리된 Jenkins)

```yaml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    user: root
    ports:
      - "8081:8080"
      - "50000:50000"
    volumes:
      - /home/ubuntu/jenkins/jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    environment:
      TZ: Asia/Seoul
    networks:
      - ozazak-network
    restart: always

networks:
  ozazak-network:
    external: true
```

### Jenkins 분리 이유

**문제:** Jenkins가 docker-compose-prod.yml 안에 있으면 Jenkins가 자기 자신을 재시작하는 무한루프 발생

**해결:** Jenkins를 별도 docker-compose 파일로 분리
- Jenkins는 한 번만 실행하고 계속 유지
- 앱 배포 시 jenkins 컨테이너는 건드리지 않음

---

## 🔧 Jenkins Pipeline

### Jenkinsfile (Pipeline Script)

```groovy
pipeline {
    agent any
    
    stages {
        stage('Git Clone') {
            steps {
                git branch: 'master', 
                    url: 'https://lab.ssafy.com/s14-webmobile2-sub1/S14P11B205.git',
                    credentialsId: 'gitlab-auth'
            }
        }

        stage('Prepare Environment Files') {
            steps {
                script {
                    // 백엔드 .env 주입
                    dir('back') {
                        withCredentials([file(credentialsId: 'back-env-file', variable: 'BACK_ENV')]) {
                            sh 'cp $BACK_ENV .env'
                        }
                    }
                    // AI .env 주입
                    dir('ai') {
                        withCredentials([file(credentialsId: 'ai-env-file', variable: 'AI_ENV')]) {
                            sh 'cp $AI_ENV .env'
                        }
                    }
                }
            }
        }
        
        stage('Deploy Services') {
            steps {
                dir('back') {
                    echo 'Deploying Backend and AI...'
                    sh 'chmod +x gradlew'
                    
                    // 1. 백엔드 Docker 이미지 빌드
                    sh 'docker build -t ozazak-backend:latest .'
                    
                    // 2. AI 서비스 Docker 이미지 빌드
                    sh 'docker build -t ozazak-ai-service:latest ../ai'
        
                    script {
                        // 3. nginx 설정 파일을 호스트 고정 경로에 복사
                        sh '''
                            rm -rf /home/ubuntu/nginx/nginx-prod.conf
                            mkdir -p /home/ubuntu/nginx
                            cp nginx/nginx-prod.conf /home/ubuntu/nginx/nginx-prod.conf
                        '''
                        
                        // 4. docker-compose 다운로드 (최초 1회)
                        sh '''
                            if [ ! -f "./docker-compose" ]; then
                                curl -SL https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-linux-x86_64 -o ./docker-compose
                                chmod +x ./docker-compose
                            fi
                        '''
                        
                        // 5. 서비스 실행 (이미 빌드했으므로 --no-build)
                        sh './docker-compose -f docker-compose-prod.yml up -d --no-build back ai-service nginx postgres redis'
                    }
                }
            }
        }
    }
}
```

### Pipeline 단계 설명

| 단계 | 설명 |
|------|------|
| Git Clone | GitLab에서 최신 코드 가져오기 |
| Prepare Environment Files | Jenkins Credentials에서 .env 파일 주입 |
| Deploy Services | Docker 이미지 빌드 및 컨테이너 실행 |

### 핵심 포인트

1. **이미지 이름 일치**: `docker build -t ozazak-backend:latest` → docker-compose의 `image: ozazak-backend:latest`
2. **nginx 설정 복사**: Jenkins workspace → 호스트 고정 경로 (`/home/ubuntu/nginx/`)
3. **`--no-build` 옵션**: 이미 빌드했으므로 다시 빌드하지 않음

---

## 🌐 Nginx 설정

### nginx-prod.conf

```nginx
events {
    worker_connections 1024;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # AI Service
    upstream ai_service {
        server ozazak-ai-prod:8000;
    }

    # Spring Backend
    upstream spring_service {
        server ozazak-back-prod:8080;
    }

    # 메인 서버
    server {
        listen 80;
        server_name ozazak.13.124.6.228.nip.io;
        client_max_body_size 10M;

        # Health Check
        location /health {
            return 200 'nginx ok';
            add_header Content-Type text/plain;
        }

        # AI Health Check
        location = /api/ai/health {
            proxy_pass http://ai_service/health;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # AI 요청 라우팅 (SSE 스트리밍 지원)
        location /api/ai/ {
            proxy_pass http://ai_service/api/ai/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Authorization $http_authorization;
            
            # SSE 스트리밍 설정
            proxy_buffering off;
            proxy_cache off;
            proxy_set_header Connection '';
            proxy_http_version 1.1;
            chunked_transfer_encoding on;
            proxy_read_timeout 600s;
        }

        # Backend API 라우팅
        location /api/ {
            proxy_pass http://spring_service/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Authorization $http_authorization;
        }

        # Swagger UI
        location /swagger-ui/ {
            proxy_pass http://spring_service/swagger-ui/;
            proxy_set_header Host $host;
        }

        # OpenAPI docs
        location /v3/api-docs {
            proxy_pass http://spring_service/v3/api-docs;
            proxy_set_header Host $host;
        }

        # Frontend (S3 프록시)
        location / {
            proxy_pass http://ozazak.s3-website.ap-northeast-2.amazonaws.com/;
            proxy_set_header Host ozazak.s3-website.ap-northeast-2.amazonaws.com;
            proxy_intercept_errors on;
            error_page 404 = /index.html;
        }
    }

    # Jenkins 서버 (동적 resolve)
    server {
        listen 80;
        server_name jenkins.13.124.6.228.nip.io;
        
        resolver 127.0.0.11 valid=30s;

        location / {
            set $jenkins_upstream http://jenkins:8080;
            proxy_pass $jenkins_upstream;
            proxy_set_header Host $host;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

### 라우팅 규칙

| 경로 | 대상 |
|------|------|
| `/api/ai/*` | AI 서비스 (FastAPI) |
| `/api/*` | 백엔드 (Spring Boot) |
| `/swagger-ui/*` | Swagger UI |
| `/v3/api-docs` | OpenAPI 문서 |
| `/` | S3 프론트엔드 |

### Jenkins 동적 Resolve

```nginx
resolver 127.0.0.11 valid=30s;  # Docker 내장 DNS
set $jenkins_upstream http://jenkins:8080;  # 변수로 설정
proxy_pass $jenkins_upstream;  # 요청 시점에 resolve
```

**이유:** Jenkins가 없어도 nginx가 정상 시작되도록 (upstream 블록은 시작 시 resolve 필수)

---

## 🔥 트러블슈팅

### 1. Jenkins 무한 재시작

**문제:** Jenkins가 docker-compose를 실행하면 자기 자신도 재시작됨

**해결:** Jenkins를 별도 docker-compose-jenkins.yml로 분리

```bash
# Jenkins는 별도로 한 번만 실행
docker-compose -f docker-compose-jenkins.yml up -d

# 앱 배포는 prod만
docker-compose -f docker-compose-prod.yml up -d
```

### 2. nginx "host not found in upstream"

**문제:** nginx 시작 시 Jenkins 컨테이너를 찾지 못함

**해결:** 동적 resolve 방식 사용
```nginx
resolver 127.0.0.11 valid=30s;
set $jenkins_upstream http://jenkins:8080;
proxy_pass $jenkins_upstream;
```

### 3. nginx 설정 파일 마운트 실패

**문제:** Jenkins workspace 경로가 Docker 호스트와 다름
```
Error: mount src=/var/jenkins_home/workspace/.../nginx-prod.conf
       Are you trying to mount a directory onto a file?
```

**해결:** 호스트 고정 경로 사용
```yaml
# docker-compose-prod.yml
volumes:
  - /home/ubuntu/nginx/nginx-prod.conf:/etc/nginx/nginx.conf:ro
```

```groovy
// Jenkinsfile
sh 'cp nginx/nginx-prod.conf /home/ubuntu/nginx/nginx-prod.conf'
```

### 4. Docker 이미지 이름 불일치

**문제:** Pipeline에서 빌드한 이미지와 docker-compose가 사용하는 이미지 다름

| 빌드 | 사용 |
|------|------|
| `ozazak-backend:latest` | `back-back` (자동 생성) |

**해결:** docker-compose에 image 명시
```yaml
back:
  image: ozazak-backend:latest  # 추가!
  build:
    context: .
```

### 5. Settings 속성 누락

**문제:** Python Settings 클래스에 `available_models` 속성 없음
```
AttributeError: 'Settings' object has no attribute 'available_models'
```

**해결:** settings.py에 속성 추가
```python
available_models: List[str] = ["gpt", "gemini", "gemini-flash", "claude"]
```

### 6. nginx 설정이 디렉토리로 생성됨

**문제:** Docker가 없는 파일을 마운트하면 디렉토리로 생성

```bash
ls -la /home/ubuntu/nginx/
drwxr-xr-x nginx-prod.conf  # 파일이 아니라 디렉토리!
```

**해결:** 
```bash
sudo rm -rf /home/ubuntu/nginx
mkdir -p /home/ubuntu/nginx
cp nginx-prod.conf /home/ubuntu/nginx/nginx-prod.conf
```

---

## ▶️ 실행 방법

### 최초 서버 설정

```bash
# 1. Docker 네트워크 생성
docker network create ozazak-network

# 2. Jenkins 실행 (한 번만)
cd ~/S14P11B205/back
docker-compose -f docker-compose-jenkins.yml up -d

# 3. nginx 설정 디렉토리 생성
mkdir -p /home/ubuntu/nginx
```

### 앱 배포 (Jenkins 자동)

Jenkins Webhook이 GitLab push 감지 → Pipeline 자동 실행

### 수동 배포

```bash
cd ~/S14P11B205/back
git pull

# 이미지 빌드 + 서비스 시작
docker-compose -f docker-compose-prod.yml up -d --build
```

### 서비스 확인

```bash
# 컨테이너 상태
docker ps

# 로그 확인
docker logs ozazak-back-prod --tail 50
docker logs ozazak-ai-prod --tail 50
docker logs ozazak-nginx --tail 50

# 헬스체크
curl http://localhost/health
curl http://localhost/api/ai/health
```

### 로컬 개발

```bash
cd back
docker-compose -f docker-compose-local.yml up -d
```

---

## 📊 API 테스트

### Health Check
```bash
curl http://ozazak.13.124.6.228.nip.io/api/ai/health
```

### 블록 생성
```bash
curl -X POST "http://ozazak.13.124.6.228.nip.io/api/ai/blocks/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "1",
    "source_type": "project",
    "source_content": "프로젝트 경험 내용...",
    "model_type": "gpt"
  }'
```

---

## 📝 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-29 | 초기 CI/CD 구성 |
| 2026-01-29 | Jenkins 분리 (무한루프 해결) |
| 2026-01-29 | nginx 동적 resolve 적용 |
| 2026-01-29 | Docker 이미지 이름 명시 |
| 2026-01-29 | AI Settings 속성 추가 |
