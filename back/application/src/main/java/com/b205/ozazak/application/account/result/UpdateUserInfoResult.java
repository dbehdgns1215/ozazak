package com.b205.ozazak.application.account.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateUserInfoResult {
    private final Long userId;
}
