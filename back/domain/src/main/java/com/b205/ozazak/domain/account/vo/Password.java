package com.b205.ozazak.domain.account.vo;

public record Password(String value) {
    public Password {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("비밀번호 필드가 비어있습니다.");
        }
        if (value.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 최소 8글자 이상이어야 합니다.");
        }
    }
}
