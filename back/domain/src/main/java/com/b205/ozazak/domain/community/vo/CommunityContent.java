package com.b205.ozazak.domain.community.vo;

public record CommunityContent(String value) {
    public CommunityContent {
        if (value == null || value.isBlank()) { // Content required? Yes.
            throw new IllegalArgumentException("Content cannot be empty");
        }
        if (value.length() > 5000) {
            throw new IllegalArgumentException("Content length exceeds 5000 characters");
        }
    }
}
