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
}

