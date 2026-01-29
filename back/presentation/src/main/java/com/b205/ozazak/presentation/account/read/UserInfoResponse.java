package com.b205.ozazak.presentation.account.read;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class UserInfoResponse {
    private final Long accountId;
    private final String email;
    private final String name;
    private final String role;
    private final String img;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime createdAt;
    
    private final long followerCount;
    private final long followeeCount;
}
