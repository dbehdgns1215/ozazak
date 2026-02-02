# Flyway 마이그레이션 가이드


## 📖 Flyway란?

**Flyway**는 데이터베이스 스키마 버전 관리 도구입니다. Git이 코드의 변경 이력을 관리하듯이, Flyway는 데이터베이스 스키마의 변경 이력을 관리합니다.

### 주요 특징

- **버전 관리**: 데이터베이스 스키마 변경사항을 SQL 파일로 버전화
- **순차 실행**: 미적용된 마이그레이션을 순서대로 자동 실행
- **일관성 보장**: 모든 환경(로컬, 개발, 스테이징, 프로덕션)에서 동일한 스키마 유지
- **롤백 불가**: 한 번 실행된 마이그레이션은 수정 불가 (새 마이그레이션으로 변경)

### Flyway가 해결하는 문제

❌ **Flyway 없이:**
- 팀원마다 다른 데이터베이스 스키마
- 프로덕션 배포 시 스키마 변경 누락
- 어떤 DDL이 언제 실행되었는지 추적 불가

✅ **Flyway 사용:**
- 모든 환경에서 자동으로 동일한 스키마 적용
- Git history처럼 스키마 변경 이력 추적
- 배포 시 자동으로 스키마 업데이트

---

## 🏗️ 프로젝트 설정

### 의존성 (이미 설정됨)

**`infra/build.gradle`**
```gradle
dependencies {
    implementation 'org.flywaydb:flyway-core'
    runtimeOnly 'org.postgresql:postgresql'
}
```

### 마이그레이션 파일 위치

```
back/
└── infra/
    └── src/
        └── main/
            └── resources/
                └── db/
                    └── migration/
                        ├── V20260123005005__init.sql
                        ├── V20260124120000__add_user_table.sql
                        └── V20260125093000__alter_user_add_email.sql
```

### Flyway 자동 실행

Spring Boot는 애플리케이션 시작 시 자동으로 Flyway를 실행합니다:

1. `flyway_schema_history` 테이블 확인 (없으면 자동 생성)
2. 미적용된 마이그레이션 파일 탐색
3. 버전 순서대로 SQL 실행
4. 실행 결과를 `flyway_schema_history`에 기록

---

## 📝 파일 네이밍 컨벤션

### 컨벤션이 필요한 이유

Flyway는 **파일명의 규칙**으로 마이그레이션을 관리합니다:
- **실행 순서**: 파일명의 버전으로 결정
- **중복 방지**: 버전이 고유해야 함
- **가독성**: 파일명만 보고도 내용 파악 가능

잘못된 네이밍은 마이그레이션 실패, 순서 꼬임, 팀 협업 어려움을 야기합니다.

### 네이밍 규칙

```
V{YYYYMMDDHHMMSS}__{description}.sql
```

**구성 요소:**
- `V`: 버전 마이그레이션 접두사 (**필수**)
- `{YYYYMMDDHHMMSS}`: 타임스탬프 (14자리)
  - `YYYY`: 연도 (4자리)
  - `MM`: 월 (2자리)
  - `DD`: 일 (2자리)
  - `HH`: 시 (2자리, 24시간 형식)
  - `MM`: 분 (2자리)
  - `SS`: 초 (2자리)
- `__`: 더블 언더스코어 구분자 (**필수**)
- `{description}`: 변경 내용 설명 (영어, snake_case)

### 예시

```
✅ V20260123005005__init.sql
✅ V20260124120000__add_user_table.sql
✅ V20260125093045__alter_community_add_tags.sql
✅ V20260126140000__create_index_on_email.sql

❌ v20260123__init.sql                    (소문자 v)
❌ V20260123_init.sql                     (언더스코어 1개)
❌ V20260123005005_add-user-table.sql     (kebab-case 사용)
❌ V1__init.sql                           (타임스탬프 미사용)
```

### 타임스탬프를 사용하는 이유

1. **고유성 보장**: 동시에 여러 명이 작업해도 버전 충돌 없음
2. **시간순 정렬**: 파일 생성 시각 = 실행 순서
3. **Git 충돌 방지**: 브랜치 간 마이그레이션 파일 충돌 최소화

---

## 🎨 IntelliJ 파일 템플릿

### 템플릿 위치

```
.idea/fileTemplates/Flyway Migreation File Convention.sql.ft
```

### 템플릿 사용 방법

1. **마이그레이션 디렉토리에서 우클릭**
   ```
   infra/src/main/resources/db/migration/
   ```

2. **New → Flyway Migreation File Convention** 선택

3. **자동으로 타임스탬프 생성된 파일명 확인**
   ```
   V20260126143022__[설명 입력].sql
   ```

4. **설명 부분 수정 후 SQL 작성**

### 템플릿의 장점

- ✅ 수동으로 타임스탬프 입력할 필요 없음
- ✅ 네이밍 컨벤션 오타 방지
- ✅ 팀 전체가 동일한 규칙 준수

---

## 🚀 사용 방법

### 1. 새 마이그레이션 파일 생성

**IntelliJ 템플릿 사용:**
```
New → Flyway Migreation File Convention
→ V20260126143022__add_bookmark_table.sql
```

**또는 수동 생성:**
```bash
# PowerShell
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
New-Item "V${timestamp}__add_bookmark_table.sql"
```

### 2. SQL 작성

```sql
-- V20260126143022__add_bookmark_table.sql

CREATE TABLE bookmark (
    bookmark_id bigserial NOT NULL,
    account_id bigint NOT NULL,
    recruitment_id bigint NOT NULL,
    created_at timestamp NOT NULL,
    PRIMARY KEY (bookmark_id)
);

ALTER TABLE bookmark
    ADD CONSTRAINT FK_account_TO_bookmark
        FOREIGN KEY (account_id)
            REFERENCES account (account_id);

ALTER TABLE bookmark
    ADD CONSTRAINT FK_recruitment_TO_bookmark
        FOREIGN KEY (recruitment_id)
            REFERENCES recruitment (recruitment_id);

CREATE INDEX idx_bookmark_account ON bookmark(account_id);
```

### 3. 애플리케이션 실행

```bash
# Gradle로 실행
./gradlew :presentation:bootRun

# 또는 IntelliJ에서 PresentationApplication 실행
```

### 4. 로그 확인

```
INFO  o.f.core.internal.command.DbMigrate : Migrating schema "public" to version "20260126143022 - add bookmark table"
INFO  o.f.core.internal.command.DbMigrate : Successfully applied 1 migration to schema "public"
```

### 5. 데이터베이스 확인

```sql
-- 마이그레이션 이력 확인
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- 테이블 생성 확인
\dt bookmark
```

---

## ⚠️ 주의사항

### 🚫 절대 하지 말아야 할 것

1. **이미 실행된 마이그레이션 파일 수정**
   ```
   ❌ V20260123005005__init.sql 내용 변경
   → Flyway checksum 오류 발생
   ```
   
   **해결책**: 새 마이그레이션 파일로 변경 사항 반영
   ```
   ✅ V20260126150000__alter_init_schema.sql 생성
   ```

2. **실행된 마이그레이션 파일 삭제**
   ```
   ❌ Git에서 이전 마이그레이션 파일 삭제
   → 다른 환경에서 실행 불가
   ```

3. **버전 번호 중복**
   ```
   ❌ V20260126143022__add_table_a.sql
   ❌ V20260126143022__add_table_b.sql
   → 두 번째 파일 실행 안 됨
   ```

### ✅ 권장사항

1. **한 파일에 관련된 변경사항 그룹화**
   ```sql
   -- V20260126143022__add_bookmark_feature.sql
   CREATE TABLE bookmark (...);
   CREATE INDEX idx_bookmark_account (...);
   ALTER TABLE bookmark ADD CONSTRAINT (...);
   ```

2. **롤백용 마이그레이션 별도 생성**
   ```sql
   -- V20260126150000__rollback_bookmark_feature.sql
   DROP TABLE IF EXISTS bookmark CASCADE;
   ```

3. **주석으로 변경 이유 명시**
   ```sql
   -- V20260126143022__add_email_index.sql
   -- 이유: 로그인 쿼리 성능 개선 (현재 5초 → 목표 0.1초)
   CREATE INDEX idx_account_email ON account(email);
   ```

4. **테스트 환경에서 먼저 검증**
   ```bash
   # 로컬에서 먼저 실행 후
   ./gradlew :presentation:bootRun
   
   # 문제 없으면 Git push
   git add infra/src/main/resources/db/migration/V*.sql
   git commit -m "feat: Add bookmark table migration"
   ```

---

## 🔧 트러블슈팅

### 에러: Detected resolved migration not applied to database

**원인**: Git pull로 받은 마이그레이션이 로컬 DB에 적용 안 됨

**해결**:
```bash
# 애플리케이션 재시작 (자동 적용됨)
./gradlew :presentation:bootRun
```

### 에러: Validate failed: Migration checksum mismatch

**원인**: 이미 실행된 마이그레이션 파일을 수정함

**해결**:
```bash
# 1. 로컬 개발 환경인 경우 (데이터 손실 주의!)
# PostgreSQL 접속
psql -U postgres -d ozazak

# Flyway 히스토리 삭제 (또는 DB 전체 재생성)
DROP TABLE flyway_schema_history;

# 2. 프로덕션 환경인 경우
# 수정한 내용을 되돌리고 새 마이그레이션으로 생성
```

### 에러: Found non-empty schema(s) "public" without schema history table

**원인**: 기존 테이블이 있는 DB에 Flyway를 처음 적용

**해결**:
```sql
-- 옵션 1: 기존 스키마를 baseline으로 설정
-- application.yml에 추가
spring:
  flyway:
    baseline-on-migrate: true

-- 옵션 2: DB 초기화 (개발 환경만)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

---

## 📚 Best Practices

### 1. 작고 자주 커밋

```
❌ V20260126__entire_database_schema.sql (5000줄)
✅ V20260126143000__add_user_table.sql (50줄)
✅ V20260126144000__add_post_table.sql (40줄)
✅ V20260126145000__add_user_post_relation.sql (20줄)
```

### 2. 명확한 설명 사용

```
❌ V20260126143000__update.sql
❌ V20260126143000__fix.sql
✅ V20260126143000__add_email_unique_constraint.sql
✅ V20260126143000__alter_user_add_profile_image.sql
```

### 3. Transactional DDL 활용 (PostgreSQL)

```sql
-- 마이그레이션 실패 시 자동 롤백
BEGIN;

CREATE TABLE new_table (...);
ALTER TABLE old_table ADD COLUMN (...);
-- 에러 발생 시 모두 롤백됨

COMMIT;
```

### 4. 데이터 마이그레이션 주의

```sql
-- V20260126143000__migrate_user_data.sql

-- ❌ 위험: 대량 데이터 한 번에 업데이트
UPDATE account SET status = 'ACTIVE';

-- ✅ 안전: 배치 처리 또는 애플리케이션 레벨에서 처리
-- 대량 데이터는 별도 스크립트로 분리
```

---

## 🎯 요약

| 항목 | 내용 |
|------|------|
| **도구** | Flyway (DB 스키마 버전 관리) |
| **파일 위치** | `infra/src/main/resources/db/migration/` |
| **네이밍** | `V{YYYYMMDDHHMMSS}__{description}.sql` |
| **실행** | Spring Boot 시작 시 자동 실행 |
| **템플릿** | IntelliJ → New → Flyway Migreation File Convention |
| **핵심 원칙** | 실행된 파일은 절대 수정하지 않기 |

---

## 📖 참고 자료

- [Flyway 공식 문서](https://flywaydb.org/documentation/)
- [Flyway PostgreSQL Tutorial](https://flywaydb.org/documentation/database/postgresql)
- [Spring Boot Flyway Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
