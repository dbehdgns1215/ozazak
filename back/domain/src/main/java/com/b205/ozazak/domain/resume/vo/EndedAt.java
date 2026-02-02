package com.b205.ozazak.domain.resume.vo;

import java.time.LocalDate;

public record EndedAt(LocalDate value) {
    public EndedAt {
        // null is allowed (endedAt is optional)
        // if provided, no additional validation needed
    }
}
