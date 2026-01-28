package com.b205.ozazak.application.account.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteUserResult {
    private final Long userId;
}
