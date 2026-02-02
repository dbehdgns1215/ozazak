package com.b205.ozazak.domain.community.vo;

public record CommunityTitle(String value) {
    public CommunityTitle {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        if (value.length() > 200) {
            throw new IllegalArgumentException("Title length exceeds 200 characters");
        }
    }
}
