package com.b205.ozazak.domain.streak.entity;

import com.b205.ozazak.domain.account.entity.Account;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class Streak {
    private final Account account;
    private final LocalDate activityDate;
    private final Integer dailyCount;
    private final LocalDateTime createdAt;
}
