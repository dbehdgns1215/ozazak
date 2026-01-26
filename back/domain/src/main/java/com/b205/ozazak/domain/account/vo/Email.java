package com.b205.ozazak.domain.account.vo;

public record Email(String value) {
    public Email {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("이메일 필드가 비어있습니다.");
        }
        value = value.trim().toLowerCase();
        if (!value.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("잘못된 이메일 형식입니다.");
        }
    }
}
