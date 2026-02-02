package com.b205.ozazak.domain.recruitment.vo;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public record EndedAt(LocalDate value) {

    public long calculateDDay() {
        if (value == null) {
            return Long.MAX_VALUE; // 마감일 없음
        }
        return ChronoUnit.DAYS.between(LocalDate.now(), value);
    }

    public boolean isExpired() {
        if (value == null) {
            return false;
        }
        return LocalDate.now().isAfter(value);
    }
}
