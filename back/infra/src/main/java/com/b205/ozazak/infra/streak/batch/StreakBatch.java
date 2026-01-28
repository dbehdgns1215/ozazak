package com.b205.ozazak.infra.streak.batch;

import com.b205.ozazak.application.streak.port.out.StreakPersistencePort;
import com.b205.ozazak.application.streak.port.out.StreakStatusPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.streak.entity.Streak;
import com.b205.ozazak.domain.streak.entity.StreakStatus;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class StreakBatch {

    private final StreakPersistencePort streakPersistencePort;
    private final StreakStatusPersistencePort streakStatusPersistencePort;
    private final AccountJpaRepository accountJpaRepository;

    /**
     * 매일 자정에 실행: 스트릭 상태 계산 및 업데이트
     * 
     * 예) 01-28 00:00 실행 → today=28, yesterday=27 → 27일 데이터 정리
     */
    @Scheduled(cron = "0 0 0 * * *")  // 매일 자정
    @Transactional
    public void calculateStreaks() {
        log.info("=== Streak Calculation Batch Started ===");
        
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        
        executeCalculation(today, yesterday);
    }

    /**
     * 공통 스트릭 계산 로직
     * 
     * 처리 단계:
     * 1. 어제 활동한 계정 + streak_status 있는 계정 병합
     * 2. 누락된 streak_status 자동 생성
     * 3. 누락된 today 레코드 초기화 (daily_count=0)
     * 4. 각 계정마다 스트릭 계산 실행
     */
    @Transactional
    private void executeCalculation(LocalDate today, LocalDate yesterday) {
        // 1. streak 테이블에서 어제 활동한 모든 계정 조회
        List<Long> activeAccountIds = streakPersistencePort.findAllActiveAccountsOn(yesterday);
        
        // 1-1. streak_status에 있는 계정도 포함
        List<Long> statusAccountIds = streakPersistencePort.findAllAccountsWithStreakStatus();
        for (Long accountId : statusAccountIds) {
            if (!activeAccountIds.contains(accountId)) {
                activeAccountIds.add(accountId);
            }
        }
        
        log.info("Found {} accounts with streak data", activeAccountIds.size());

        // 2. 각 계정에 대해 streak_status가 없으면 먼저 생성
        for (Long accountId : activeAccountIds) {
            StreakStatus status = streakStatusPersistencePort.findByAccountId(accountId);
            if (status == null) {
                Account account = accountJpaRepository.findById(accountId)
                        .map(jpaEntity -> Account.builder()
                                .id(new com.b205.ozazak.domain.account.vo.AccountId(jpaEntity.getAccountId()))
                                .email(new com.b205.ozazak.domain.account.vo.Email(jpaEntity.getEmail()))
                                .name(new com.b205.ozazak.domain.account.vo.AccountName(jpaEntity.getName()))
                                .img(new com.b205.ozazak.domain.account.vo.AccountImg(jpaEntity.getImg()))
                                .roleCode(jpaEntity.getRoleCode())
                                .build())
                        .orElse(null);
                
                if (account != null) {
                    StreakStatus newStatus = StreakStatus.builder()
                            .account(account)
                            .currentStreak(0)
                            .longestStreak(0)
                            .lastActivityDate(null)
                            .build();
                    streakStatusPersistencePort.save(newStatus);
                    log.debug("Created streak_status for account {}", accountId);
                }
            }
        }

        // 3. 각 계정에 대해 today의 streak 레코드 초기화
        for (Long accountId : activeAccountIds) {
            Streak todayStreak = streakPersistencePort.findByAccountIdAndActivityDate(accountId, today);
            if (todayStreak == null) {
                Account account = accountJpaRepository.findById(accountId)
                        .map(jpaEntity -> Account.builder()
                                .id(new com.b205.ozazak.domain.account.vo.AccountId(jpaEntity.getAccountId()))
                                .email(new com.b205.ozazak.domain.account.vo.Email(jpaEntity.getEmail()))
                                .name(new com.b205.ozazak.domain.account.vo.AccountName(jpaEntity.getName()))
                                .img(new com.b205.ozazak.domain.account.vo.AccountImg(jpaEntity.getImg()))
                                .roleCode(jpaEntity.getRoleCode())
                                .build())
                        .orElse(null);
                
                if (account != null) {
                    Streak newStreakRecord = Streak.builder()
                            .account(account)
                            .activityDate(today)
                            .dailyCount(0)
                            .build();
                    streakPersistencePort.save(newStreakRecord);
                    log.debug("Created streak record for account {} on {}", accountId, today);
                }
            }
        }

        // 4. 스트릭 계산 실행
        int successCount = 0;
        for (Long accountId : activeAccountIds) {
            try {
                calculateStreakForAccount(accountId, today, yesterday);
                successCount++;
            } catch (Exception e) {
                log.error("Failed to calculate streak for account {}: {}", accountId, e.getMessage());
            }
        }

        log.info("=== Streak Calculation Batch Completed: {} / {} successful ===", 
                successCount, activeAccountIds.size());
    }
    private void calculateStreakForAccount(Long accountId, LocalDate today, LocalDate yesterday) {
        // 1. 현재 streak_status 조회
        StreakStatus currentStatus = streakStatusPersistencePort.findByAccountId(accountId);
        if (currentStatus == null) {
            log.warn("StreakStatus not found for account: {}", accountId);
            return;
        }

        // 2. 스트릭 계산
        int newCurrentStreak = 0;
        int newLongestStreak = currentStatus.getLongestStreak();
        LocalDate newLastActivityDate = currentStatus.getLastActivityDate();  // 기존 값 유지
        
        // 어제 활동 여부만 확인 (daily_count > 0인 경우만 활동으로 간주)
        Streak yesterdayStreak = streakPersistencePort.findByAccountIdAndActivityDate(accountId, yesterday);
        boolean hasActivityYesterday = yesterdayStreak != null && yesterdayStreak.getDailyCount() > 0;
        
        if (hasActivityYesterday) {
            // 어제 활동함 → 연속!
            newCurrentStreak = currentStatus.getCurrentStreak() + 1;
            newLastActivityDate = yesterday;  // 실제 활동 날짜 업데이트
            
            // longest_streak 업데이트
            if (newCurrentStreak > newLongestStreak) {
                newLongestStreak = newCurrentStreak;
            }
        } else {
            // 어제 활동 없음 → gap 발생 → 스트릭 끊김!
            newCurrentStreak = 0;
            // lastActivityDate는 유지 (마지막 실제 활동 날짜)
        }

        // 3. Account 객체 복원 (VO 포함)
        Account account = accountJpaRepository.findById(accountId)
                .map(jpaEntity -> Account.builder()
                        .id(new com.b205.ozazak.domain.account.vo.AccountId(jpaEntity.getAccountId()))
                        .email(new com.b205.ozazak.domain.account.vo.Email(jpaEntity.getEmail()))
                        .name(new com.b205.ozazak.domain.account.vo.AccountName(jpaEntity.getName()))
                        .img(new com.b205.ozazak.domain.account.vo.AccountImg(jpaEntity.getImg()))
                        .roleCode(jpaEntity.getRoleCode())
                        .build())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // 4. streak_status 업데이트
        StreakStatus updatedStatus = StreakStatus.builder()
                .account(account)
                .currentStreak(newCurrentStreak)
                .longestStreak(newLongestStreak)
                .lastActivityDate(newLastActivityDate)  // 실제 활동 날짜만 기록
                .build();
        
        streakStatusPersistencePort.save(updatedStatus);
        
        log.info("Updated streak for account {}: current_streak={}, longest_streak={}, lastActivityDate={}", 
                accountId, newCurrentStreak, newLongestStreak, newLastActivityDate);
    }

    /**
     * [테스트/어드민 전용] 배치 수동 실행
     * 특정 기준 날짜 기반으로 계산 (자정 대기 없이 즉시 실행)
     */
    @Transactional
    public void executeManually(LocalDate baseDate) {
        log.info("=== Manual Streak Calculation Batch Started (baseDate={}) ===", baseDate);
        
        LocalDate today = baseDate;
        LocalDate yesterday = baseDate.minusDays(1);

        executeCalculation(today, yesterday);
    }
}
