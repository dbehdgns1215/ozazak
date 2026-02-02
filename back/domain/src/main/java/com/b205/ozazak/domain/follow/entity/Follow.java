package com.b205.ozazak.domain.follow.entity;

import com.b205.ozazak.domain.account.entity.Account;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Follow {
    private final Account follower;  // 팔로우를 건 사람
    private final Account followee;  // 팔로우를 받은 사람
}
