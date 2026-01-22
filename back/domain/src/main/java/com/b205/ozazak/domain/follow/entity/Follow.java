package com.b205.ozazak.domain.follow.entity;

import com.b205.ozazak.domain.account.entity.Account;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Follow {
    private final Account follower;
    private final Account following;
}
