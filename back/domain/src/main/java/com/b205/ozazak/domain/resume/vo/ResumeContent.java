package com.b205.ozazak.domain.resume.vo;

public record ResumeContent(String value) {
    public ResumeContent {
        if (value == null) {
            throw new IllegalArgumentException("Resume content cannot be null");
        }
        if (value.isBlank()) {
            throw new IllegalArgumentException("Resume content cannot be blank");
        }
        value = value.trim();
    }
}
