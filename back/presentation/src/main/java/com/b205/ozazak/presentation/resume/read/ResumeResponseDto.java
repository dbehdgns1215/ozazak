package com.b205.ozazak.presentation.resume.read;

import java.time.LocalDate;

public record ResumeResponseDto(
    Long resumeId,
    String title,
    String content,
    LocalDate startedAt,
    LocalDate endedAt
) {}
