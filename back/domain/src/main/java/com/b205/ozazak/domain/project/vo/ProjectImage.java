package com.b205.ozazak.domain.project.vo;

public record ProjectImage(String value) {
    public ProjectImage {
        // null은 ok (기본 이미지)
        if (value != null && !value.isBlank()) {
            // URL 검증
            if (!value.startsWith("http://") && !value.startsWith("https://")) {
                throw new IllegalArgumentException("이미지 URL은 http:// 또는 https://로 시작해야 합니다");
            }
        }
    }
}
