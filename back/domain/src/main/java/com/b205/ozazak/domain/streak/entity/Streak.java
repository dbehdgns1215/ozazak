package com.b205.ozazak.domain.streak.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.streak.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Streak {
    private final Account account;
    private final Count count;
    private final UpdatedAt updatedAt;
}
