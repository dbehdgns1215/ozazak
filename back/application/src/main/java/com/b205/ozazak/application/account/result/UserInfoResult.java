package com.b205.ozazak.application.account.result;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class UserInfoResult {
    private final Long accountId;
    private final String email;
    private final String name;
    private final String role;
    private final String img;
    private final LocalDateTime createdAt;
    private final long followerCount;
    private final long followeeCount;
}
