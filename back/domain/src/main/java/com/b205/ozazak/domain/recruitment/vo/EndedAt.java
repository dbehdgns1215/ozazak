package com.b205.ozazak.domain.recruitment.vo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public record EndedAt(LocalDateTime value) {

    public long calculateDDay() {
        if (value == null) {
            return Long.MAX_VALUE; // 마감일 없음
        }
        return ChronoUnit.DAYS.between(LocalDate.now(), value.toLocalDate());
    }

    public boolean isExpired() {
        if (value == null) {
            return false;
        }
        return LocalDateTime.now().isAfter(value);
    }
}
