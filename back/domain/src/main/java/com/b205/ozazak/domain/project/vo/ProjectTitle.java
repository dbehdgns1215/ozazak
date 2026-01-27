package com.b205.ozazak.domain.project.vo;

//public record ProjectTitle(String value) {}

public record ProjectTitle(String value) {
    public ProjectTitle {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("프로젝트 제목은 필수입니다");
        }
        if (value.length() > 50) {
            throw new IllegalArgumentException("프로젝트 제목은 50자를 초과할 수 없습니다");
        }
    }
}