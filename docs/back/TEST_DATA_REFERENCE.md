# 테스트 데이터 레퍼런스

## 개요
프로젝트 테스트 및 개발을 위한 샘플 데이터 모음입니다.

---

## 테스트 유저 계정 정보

> **공통 비밀번호**: `test1234!`  
> **비밀번호 암호화**: BCrypt  
> **role_code**: `1` (일반 유저)

### 유저 목록

| No | 이름 | 이메일 | 페르소나 |
|----|------|--------|----------|
| 1 | 김지훈 | jihoon.kim@test.com | 신입 개발자 지망생 - 부트캠프 수료, 첫 직장 준비 중 |
| 2 | 이서연 | seoyeon.lee@test.com | 주니어 프론트엔드 개발자 - React 경력 1년, 성장형 마인드셋 |
| 3 | 박민준 | minjun.park@test.com | 백엔드 경력 3년차 - Spring Boot 전문, 팀 리딩 경험 |
| 4 | 최유진 | yujin.choi@test.com | 데이터 분석가 전환 희망 - 통계학 전공, SQL/Python 학습 중 |
| 5 | 정도윤 | doyoon.jung@test.com | 풀스택 개발자 5년차 - 스타트업 경험, 빠른 프로토타이핑 능력 |
| 6 | 강하은 | haeun.kang@test.com | UI/UX 디자이너 - Figma 마스터, 개발 협업 경험 多 |
| 7 | 윤서준 | seojun.yoon@test.com | 취업 준비 대학생 - 컴공 4학년, 포트폴리오 제작 중 |
| 8 | 임수아 | sua.lim@test.com | 마케터에서 PM 전환 - 고객 인사이트 강점, IT 제품 기획 희망 |
| 9 | 한지우 | jiwoo.han@test.com | 시니어 개발자 10년차 - 다양한 도메인 경험, 멘토링 역할 |
| 10 | 서예준 | yejun.seo@test.com | 스타트업 창업 준비 중 - 기술 중심 창업가, MVP 개발 진행 |
| 11 | 조아인 | ain.cho@test.com | 신입 QA 엔지니어 - 테스트 자동화 관심, 세심한 성격 |
| 12 | 신태양 | taeyang.shin@test.com | DevOps 엔지니어 4년차 - AWS/K8s 전문, CI/CD 파이프라인 구축 |
| 13 | 배수빈 | subin.bae@test.com | 보안 전문가 지망생 - CTF 참가 경험, 화이트해커 목표 |
| 14 | 노시현 | sihyun.noh@test.com | 게임 기획자 - 모바일 게임 업계 5년, PO 경험 |
| 15 | 홍다은 | daeun.hong@test.com | 신입 데이터 사이언티스트 - 석사 졸업, 머신러닝 프로젝트 다수 |
| 16 | 송민석 | minseok.song@test.com | 클라우드 아키텍트 - 멀티 클라우드 설계, 비용 최적화 전문 |
| 17 | 문채원 | chaewon.moon@test.com | AI 연구원 희망 - 딥러닝 박사과정, 논문 게재 경험 |
| 18 | 안지훈 | jihoon.ahn@test.com | 모바일 앱 개발자 - iOS/Android 네이티브 개발, 크로스플랫폼 경험 |
| 19 | 오서윤 | seoyun.oh@test.com | 블록체인 개발자 - Solidity 개발, DeFi 프로젝트 참여 |
| 20 | 황준서 | junseo.hwang@test.com | 리드 개발자 12년차 - CTO 경험, 기술 전략 수립 및 조직 관리 |

---

## 사용 예시

### 로그인 테스트
```bash
# 예시: 김지훈 계정으로 로그인
POST /api/auth/login
{
  "email": "jihoon.kim@test.com",
  "password": "test1234!"
}
```

### 페르소나별 시나리오 테스트

**신입 개발자 (김지훈, 윤서준, 조아인, 홍다은)**
- 자기소개서 작성 및 첨삭 요청
- 취업 공고 북마크 및 지원
- 커뮤니티에서 선배 개발자 질문

**경력 개발자 (박민준, 정도윤, 한지우, 신태양, 황준서)**
- 이력서 update 및 경력 관리
- 기술 블로그 작성 (TIL)
- 후배 멘토링 및 코드 리뷰

**커리어 전환 (최유진, 임수아)**
- 새로운 분야 채용 정보 탐색
- 온라인 강의 및 프로젝트 이력 추가
- 네트워킹 강화 (팔로우 기능)

**전문 분야 (강하은, 노시현, 송민석, 문채원, 안지훈, 오서윤)**
- 전문성 강조한 포트폴리오 작성
- 특화 커뮤니티 참여 및 정보 공유
- 해당 분야 채용 공고 필터링

---

## 데이터베이스 정보

### Migration 파일
- **파일명**: `V20260131150000__insert_test_users.sql`
- **위치**: `back/infra/src/main/resources/db/migration/`

### 적용 방법
```bash
# Flyway가 자동으로 migration 실행
# 애플리케이션 재시작 시 자동 적용됨
```
