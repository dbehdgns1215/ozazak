package com.b205.ozazak.application.streak.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.streak.port.out.StreakPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.streak.entity.Streak;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class StreakService {

    private final StreakPersistencePort streakPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    /**
     * 사용자 활동 기록
     * - 오늘 기록이 있으면: daily_count + 1
     * - 오늘 기록이 없으면: 새로운 기록 생성 (daily_count = 1)
     */
    @Transactional
    public void recordActivity(Account account) {
        LocalDate today = LocalDate.now();

        // 기존 기록 조회
        Streak existingStreak = streakPersistencePort.findByAccountIdAndActivityDate(
                account.getId().value(),
                today
        );

        if (existingStreak != null) {
            // 기존 기록 업데이트
            Streak updatedStreak = Streak.builder()
                    .account(account)
                    .activityDate(today)
                    .dailyCount(existingStreak.getDailyCount() + 1)
                    .createdAt(existingStreak.getCreatedAt())
                    .build();
            streakPersistencePort.save(updatedStreak);
        } else {
            // 새로운 기록 생성
            Streak newStreak = Streak.builder()
                    .account(account)
                    .activityDate(today)
                    .dailyCount(1)
                    .build();
            streakPersistencePort.save(newStreak);
        }
    }

    /**
     * [어드민 전용] 특정 사용자의 특정 날짜 활동 수 수정
     * - 기록이 있으면: dailyCount에 amount 더함
     * - 기록이 없으면: amount만큼 새로 생성
     *
     * @param accountId 사용자 ID
     * @param activityDate 활동 날짜
     * @param amount 추가할 활동 수 (음수 가능)
     */
    @Transactional
    public void adminUpdateActivityCount(Long accountId, LocalDate activityDate, Integer amount) {
        // 1. Account 조회
        Account account = accountPersistencePort.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + accountId));

        // 2. 기존 Streak 조회
        Streak existingStreak = streakPersistencePort.findByAccountIdAndActivityDate(
                accountId,
                activityDate
        );

        if (existingStreak != null) {
            // 3-1. 기존 기록 업데이트
            int newDailyCount = Math.max(0, existingStreak.getDailyCount() + amount);
            Streak updatedStreak = Streak.builder()
                    .account(account)
                    .activityDate(activityDate)
                    .dailyCount(newDailyCount)
                    .createdAt(existingStreak.getCreatedAt())
                    .build();
            streakPersistencePort.save(updatedStreak);
            log.info("[ADMIN] Updated streak for account {} on {}: {} → {}",
                    accountId, activityDate, existingStreak.getDailyCount(), newDailyCount);
        } else {
            // 3-2. 새 기록 생성
            int newDailyCount = Math.max(0, amount);
            Streak newStreak = Streak.builder()
                    .account(account)
                    .activityDate(activityDate)
                    .dailyCount(newDailyCount)
                    .build();
            streakPersistencePort.save(newStreak);
            log.info("[ADMIN] Created new streak for account {} on {}: {}",
                    accountId, activityDate, newDailyCount);
        }
    }
}
