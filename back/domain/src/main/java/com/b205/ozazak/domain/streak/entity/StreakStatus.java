package com.b205.ozazak.domain.streak.entity;

import com.b205.ozazak.domain.account.entity.Account;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class StreakStatus {
    private final Account account;
    private final Integer currentStreak;
    private final Integer longestStreak;
    private final LocalDate lastActivityDate;
}
