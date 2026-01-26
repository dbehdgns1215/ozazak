package com.b205.ozazak.domain.account.vo;

public record AccountName(String value) {
    public AccountName {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("이름 필드가 비어있습니다.");
        }
        if (value.length() > 10) {
            throw new IllegalArgumentException("이름은 10글자 이하여야 합니다.");
        }
    }
}
