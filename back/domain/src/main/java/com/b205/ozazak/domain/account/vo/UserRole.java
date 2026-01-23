package com.b205.ozazak.domain.account.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    ROLE_USER(1, "User"),
    ROLE_ADMIN(2, "Admin");

    private final int code;
    private final String description;

    public static UserRole fromCode(int code) {
        return Arrays.stream(values())
                .filter(role -> role.getCode() == code)
                .findFirst()
                .orElse(ROLE_USER); // Default to USER if unknown
    }
}
