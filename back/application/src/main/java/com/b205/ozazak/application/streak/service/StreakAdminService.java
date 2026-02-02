package com.b205.ozazak.application.streak.service;

import com.b205.ozazak.application.streak.port.in.StreakAdminUseCase;
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
public class StreakAdminService implements StreakAdminUseCase {

    private final StreakPersistencePort streakPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional
    public void updateActivityCount(Long accountId, LocalDate activityDate, Integer amount) {
        // Input validation
        if (accountId == null) {
            throw new IllegalArgumentException("accountId must not be null");
        }
        if (activityDate == null) {
            throw new IllegalArgumentException("activityDate must not be null");
        }
        if (amount == null) {
            throw new IllegalArgumentException("amount must not be null");
        }
        
        log.info("[ADMIN] Starting activity count update: accountId={}, date={}, amount={}", 
                accountId, activityDate, amount);
        
        // 1. Account 존재 확인
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
