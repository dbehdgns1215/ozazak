# 🧪 Postman 스트릭 시스템 테스트 데이터셋

## 📋 테스트 시나리오

### **시나리오: 사용자 21번의 스트릭 변화 관찰**

```
26: 1 ✅
27: 0 ❌  (gap)
28: 0 ❌  (gap)
```

배치를 27일, 28일, 29일에 차례대로 실행하면서 스트릭이 어떻게 변화하는지 확인

---

## 🔑 필수 정보

### **JWT Token 설정**
- Postman 환경 변수에 추가:
  - `{{jwt_token}}` - 어드민 계정의 JWT 토큰
  - `{{base_url}}` - 서버 주소 (예: `http://localhost:8080`)

```json
{
  "base_url": "http://localhost:8080",
  "jwt_token": "YOUR_ADMIN_JWT_TOKEN_HERE"
}
```

---

## 📝 API 요청들

### **1️⃣ 기본 데이터 설정 (초기화)**

#### 1-1. 26일 활동 기록 생성
```http
POST http://{{base_url}}/api/admin/streaks/activities/update
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "accountId": 21,
  "activityDate": "2026-01-26",
  "amount": 1
}
```

**응답**: 200 OK

**데이터베이스 상태**:
```
streak 테이블:
  account_id=21, activity_date=2026-01-26, daily_count=1 ✅

streak_status 테이블:
  account_id=21, current_streak=?, longest_streak=?, last_activity_date=?
  (배치가 실행되지 않았으므로 아직 업데이트 안 됨)
```

---

#### 1-2. 27일 활동 기록 생성 (gap 만들기)
```http
POST http://{{base_url}}/api/admin/streaks/activities/update
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "accountId": 21,
  "activityDate": "2026-01-27",
  "amount": 0
}
```

**응답**: 200 OK

**데이터베이스 상태**:
```
streak 테이블:
  account_id=21, activity_date=2026-01-26, daily_count=1 ✅
  account_id=21, activity_date=2026-01-27, daily_count=0 ❌
```

---

#### 1-3. 28일 활동 기록 생성
```http
POST http://{{base_url}}/api/admin/streaks/activities/update
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "accountId": 21,
  "activityDate": "2026-01-28",
  "amount": 0
}
```

**응답**: 200 OK

**데이터베이스 상태**:
```
streak 테이블:
  account_id=21, activity_date=2026-01-26, daily_count=1 ✅
  account_id=21, activity_date=2026-01-27, daily_count=0 ❌
  account_id=21, activity_date=2026-01-28, daily_count=0 ❌
```

---

### **2️⃣ 배치 실행 #1 - 27일 기준 배치 실행**

#### 2-1. 27일 배치 수동 실행
```http
POST http://{{base_url}}/api/admin/streaks/batch/execute
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "baseDate": "2026-01-27"
}
```

**응답**: 200 OK

**서버 로그 확인**:
```
Found 1 accounts with streak data
Created streak_status for account 21
Created streak record for account 21 on 2026-01-27
Updated streak for account 21: current_streak=1, longest_streak=1, lastActivityDate=2026-01-26
```

**데이터베이스 상태**:
```
streak_status 테이블:
  account_id=21
  current_streak=1        ← 26일 활동이 있으므로 1
  longest_streak=1
  last_activity_date=2026-01-26

streak 테이블:
  account_id=21, activity_date=2026-01-26, daily_count=1 ✅
  account_id=21, activity_date=2026-01-27, daily_count=0 ❌
  account_id=21, activity_date=2026-01-28, daily_count=0 ❌ (새로 생성됨)
```

---

### **3️⃣ 배치 실행 #2 - 28일 기준 배치 실행**

#### 3-1. 28일 배치 수동 실행
```http
POST http://{{base_url}}/api/admin/streaks/batch/execute
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "baseDate": "2026-01-28"
}
```

**응답**: 200 OK

**서버 로그 확인**:
```
Found 1 accounts with streak data
Updated streak for account 21: current_streak=0, longest_streak=1, lastActivityDate=2026-01-26
```

**데이터베이스 상태**:
```
streak_status 테이블:
  account_id=21
  current_streak=0        ← 27일에 활동 없으므로 0 (끊김!)
  longest_streak=1        ← 유지
  last_activity_date=2026-01-26  ← 유지

streak 테이블:
  account_id=21, activity_date=2026-01-26, daily_count=1 ✅
  account_id=21, activity_date=2026-01-27, daily_count=0 ❌
  account_id=21, activity_date=2026-01-28, daily_count=0 ❌
  account_id=21, activity_date=2026-01-29, daily_count=0 (새로 생성됨)
```

---

### **4️⃣ 배치 실행 #3 - 29일 기준 배치 실행**

#### 4-1. 29일 배치 수동 실행
```http
POST http://{{base_url}}/api/admin/streaks/batch/execute
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "baseDate": "2026-01-29"
}
```

**응답**: 200 OK

**서버 로그 확인**:
```
Found 1 accounts with streak data
Updated streak for account 21: current_streak=0, longest_streak=1, lastActivityDate=2026-01-26
```

**데이터베이스 상태**:
```
streak_status 테이블:
  account_id=21
  current_streak=0        ← 여전히 0 (28일도 활동 없음)
  longest_streak=1        ← 유지
  last_activity_date=2026-01-26  ← 유지

streak 테이블:
  account_id=21, activity_date=2026-01-26, daily_count=1 ✅
  account_id=21, activity_date=2026-01-27, daily_count=0 ❌
  account_id=21, activity_date=2026-01-28, daily_count=0 ❌
  account_id=21, activity_date=2026-01-29, daily_count=0 ❌
  account_id=21, activity_date=2026-01-30, daily_count=0 (새로 생성됨)
```

---

## 🔍 중간 확인: SQL로 현황 조회

배치 실행 전후에 데이터베이스를 직접 확인하려면:

### **streak_status 확인**
```sql
SELECT account_id, current_streak, longest_streak, last_activity_date
FROM streak_status
WHERE account_id = 21;
```

### **streak 레코드 확인**
```sql
SELECT account_id, activity_date, daily_count
FROM streak
WHERE account_id = 21
ORDER BY activity_date DESC;
```

---

## ✅ 예상 결과

| 단계 | 배치 baseDate | yesterday | 27일 활동 | 28일 활동 | current_streak | longest_streak | last_activity_date | 설명 |
|------|--------------|-----------|---------|---------|----------------|----------------|-------------------|------|
| 초기 | - | - | 0 | 0 | - | - | - | 26일만 1, 27-28일은 0 |
| #1 | 2026-01-27 | 2026-01-26 | ❌ | ❌ | **1** | 1 | 2026-01-26 | 26일 활동 감지 → streak 시작 |
| #2 | 2026-01-28 | 2026-01-27 | 0 | - | **0** | 1 | 2026-01-26 | 27일 gap → streak 끊김! |
| #3 | 2026-01-29 | 2026-01-28 | 0 | 0 | **0** | 1 | 2026-01-26 | 28일도 gap → 여전히 끊김 |

---

## 🎯 핵심 검증 포인트

✅ **1. 기본 설정 완료**
- 26일: daily_count=1
- 27일: daily_count=0
- 28일: daily_count=0

✅ **2. 27일 배치 결과**
- current_streak = 1 (26일 활동 감지)
- last_activity_date = 2026-01-26

✅ **3. 28일 배치 결과**
- current_streak = 0 (27일 gap 감지)
- longest_streak = 1 (유지)
- last_activity_date = 2026-01-26 (유지)

✅ **4. 29일 배치 결과**
- current_streak = 0 (여전히 gap)
- longest_streak = 1 (유지)
- last_activity_date = 2026-01-26 (유지)

---

## 📊 시각화

```
날짜별 활동 상태:
26      27      28      29
1 ✅   0 ❌   0 ❌   (배치가 생성)

배치 실행 후 streak 변화:
배치 #1 (27일 기준)   →  current_streak=1
배치 #2 (28일 기준)   →  current_streak=0 (gap!)
배치 #3 (29일 기준)   →  current_streak=0 (유지)
```

---

## 💡 추가 테스트 케이스

### **케이스 A: 연속 활동**
```
26: 1 ✅
27: 2 ✅
28: 1 ✅
```

배치 #1 (27일): current_streak=2
배치 #2 (28일): current_streak=3

### **케이스 B: 회복**
```
25: 1 ✅
26: 0 ❌
27: 2 ✅
28: 3 ✅
```

배치 #1 (26일): current_streak=0 (gap)
배치 #2 (27일): current_streak=1 (새로 시작)
배치 #3 (28일): current_streak=2 (연속)

---

## 🚀 Postman Collection JSON

```json
{
  "info": {
    "name": "Streak System Test",
    "description": "스트릭 시스템 테스트 컬렉션",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. 26일 활동 기록 생성",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"accountId\": 21,\n  \"activityDate\": \"2026-01-26\",\n  \"amount\": 1\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/admin/streaks/activities/update",
          "host": ["{{base_url}}"],
          "path": ["api", "admin", "streaks", "activities", "update"]
        }
      }
    },
    {
      "name": "2. 27일 활동 기록 생성 (gap)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"accountId\": 21,\n  \"activityDate\": \"2026-01-27\",\n  \"amount\": 0\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/admin/streaks/activities/update",
          "host": ["{{base_url}}"],
          "path": ["api", "admin", "streaks", "activities", "update"]
        }
      }
    },
    {
      "name": "3. 28일 활동 기록 생성 (gap)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"accountId\": 21,\n  \"activityDate\": \"2026-01-28\",\n  \"amount\": 0\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/admin/streaks/activities/update",
          "host": ["{{base_url}}"],
          "path": ["api", "admin", "streaks", "activities", "update"]
        }
      }
    },
    {
      "name": "배치 #1 - 27일 기준 실행",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"baseDate\": \"2026-01-27\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/admin/streaks/batch/execute",
          "host": ["{{base_url}}"],
          "path": ["api", "admin", "streaks", "batch", "execute"]
        }
      }
    },
    {
      "name": "배치 #2 - 28일 기준 실행",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"baseDate\": \"2026-01-28\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/admin/streaks/batch/execute",
          "host": ["{{base_url}}"],
          "path": ["api", "admin", "streaks", "batch", "execute"]
        }
      }
    },
    {
      "name": "배치 #3 - 29일 기준 실행",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"baseDate\": \"2026-01-29\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/admin/streaks/batch/execute",
          "host": ["{{base_url}}"],
          "path": ["api", "admin", "streaks", "batch", "execute"]
        }
      }
    }
  ]
}
```

---

## 🎯 실행 순서

1. Postman 환경 변수 설정 (`{{jwt_token}}`, `{{base_url}}`)
2. **1. 26일 활동 기록 생성** 실행
3. **2. 27일 활동 기록 생성** 실행
4. **3. 28일 활동 기록 생성** 실행
5. 데이터베이스 확인 (SQL 쿼리)
6. **배치 #1** 실행 + 서버 로그 확인
7. 데이터베이스 확인
8. **배치 #2** 실행 + 서버 로그 확인
9. 데이터베이스 확인
10. **배치 #3** 실행 + 서버 로그 확인
11. 데이터베이스 확인

---

## 📝 검증 체크리스트

- [ ] 배치 #1 후: current_streak = 1
- [ ] 배치 #2 후: current_streak = 0 (gap 감지!)
- [ ] 배치 #3 후: current_streak = 0 (유지)
- [ ] 모든 배치 후: longest_streak = 1 (유지)
- [ ] 모든 배치 후: last_activity_date = 2026-01-26 (유지)

