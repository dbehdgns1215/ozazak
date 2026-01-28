package com.b205.ozazak.application.streak.port.out;

import com.b205.ozazak.domain.streak.entity.Streak;
import java.time.LocalDate;
import java.util.List;

public interface StreakPersistencePort {
    Streak save(Streak streak);
    
    Streak findByAccountIdAndActivityDate(Long accountId, LocalDate activityDate);
    
    LocalDate findLastActivityDateByAccountId(Long accountId);
    
    List<Long> findAllActiveAccountsOn(LocalDate date);
    
    boolean existsByAccountIdAndActivityDate(Long accountId, LocalDate activityDate);
    
    List<Long> findAllAccountsWithStreakStatus();
    
    // 조회용 메서드
    // 과거 연도 전체 조회 (1월 1일 ~ 12월 31일)
    List<Streak> findByAccountIdAndFullYear(Long accountId, int year);
    
    // 올해 특정 월 조회 (1일 ~ 마지막 날)
    List<Streak> findByAccountIdAndMonth(Long accountId, int year, int month);
    
    // 올해 1월 1일부터 특정 날짜까지 조회
    List<Streak> findByAccountIdAndDateRange(Long accountId, LocalDate startDate, LocalDate endDate);
}

