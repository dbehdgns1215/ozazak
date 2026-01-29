package com.b205.ozazak.domain.resume.vo;

import java.time.LocalDate;

public record StartedAt(LocalDate value) {
    public StartedAt {
        if (value == null) {
            throw new IllegalArgumentException("Started date cannot be null");
        }
    }
}
