package com.b205.ozazak.application.streak.port.out;

import com.b205.ozazak.domain.streak.entity.StreakStatus;

public interface StreakStatusPersistencePort {
    StreakStatus save(StreakStatus streakStatus);
    StreakStatus findByAccountId(Long accountId);
}
