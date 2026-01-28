package com.b205.ozazak.application.streak.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.streak.port.in.GetStreakUseCase;
import com.b205.ozazak.application.streak.port.out.StreakPersistencePort;
import com.b205.ozazak.application.streak.port.out.StreakStatusPersistencePort;
import com.b205.ozazak.application.streak.result.GetStreakResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.streak.entity.Streak;
import com.b205.ozazak.domain.streak.entity.StreakStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetStreakService implements GetStreakUseCase {

    private final StreakPersistencePort streakPersistencePort;
    private final StreakStatusPersistencePort streakStatusPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional(readOnly = true)
    public GetStreakResult getStreak(Long accountId, LocalDate targetDate) {
        // 1. Account 존재 여부 확인
        Account account = accountPersistencePort.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + accountId));

        // 2. 쿼리 파라미터에 따라 데이터 조회
        List<Streak> streakList;
        LocalDate today = LocalDate.now();
        
        if (targetDate == null) {
            // 올해 1월 1일부터 오늘까지
            LocalDate startDate = LocalDate.of(today.getYear(), 1, 1);
            streakList = streakPersistencePort.findByAccountIdAndDateRange(accountId, startDate, today);
            log.info("Fetched current year streaks (1/1 ~ today) for account: {} ({}~{})", accountId, startDate, today);
        } else if (targetDate.getYear() < today.getYear()) {
            // 과거 연도: 1월 1일부터 12월 31일까지 전체
            streakList = streakPersistencePort.findByAccountIdAndFullYear(accountId, targetDate.getYear());
            log.info("Fetched full year {} streaks for account: {} (total: {})", targetDate.getYear(), accountId, streakList.size());
        } else {
            // 올해 특정 월: 그 달의 1일부터 마지막 날까지
            int year = targetDate.getYear();
            int month = targetDate.getMonthValue();
            streakList = streakPersistencePort.findByAccountIdAndMonth(accountId, year, month);
            log.info("Fetched streaks for account: {} on {}-{:02d} (total: {})", accountId, year, month, streakList.size());
        }

        // 3. StreakStatus 조회 (현재/최장 연속 스트릭)
        StreakStatus streakStatus = streakStatusPersistencePort.findByAccountId(accountId);
        
        Integer currentStreak = streakStatus != null ? streakStatus.getCurrentStreak() : 0;
        Integer longestStreak = streakStatus != null ? streakStatus.getLongestStreak() : 0;

        // 4. 응답 데이터 구성
        List<GetStreakResult.StreakData> streakDataList = streakList.stream()
                .map(streak -> GetStreakResult.StreakData.builder()
                        .date(streak.getActivityDate())
                        .value(streak.getDailyCount())
                        .build())
                .toList();

        GetStreakResult.StreakSummary streakSummary = GetStreakResult.StreakSummary.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .build();

        return GetStreakResult.builder()
                .streakDataList(streakDataList)
                .streakSummary(streakSummary)
                .build();
    }
}
