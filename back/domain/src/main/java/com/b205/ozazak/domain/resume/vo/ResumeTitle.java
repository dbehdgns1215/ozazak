package com.b205.ozazak.domain.resume.vo;

public record ResumeTitle(String value) {
    public ResumeTitle {
        if (value == null) {
            throw new IllegalArgumentException("Resume title cannot be null");
        }
        if (value.isBlank()) {
            throw new IllegalArgumentException("Resume title cannot be blank");
        }
        if (value.length() > 100) {
            throw new IllegalArgumentException("Resume title cannot exceed 100 characters");
        }
        value = value.trim();
    }
}
