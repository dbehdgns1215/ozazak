package com.b205.ozazak.application.resume.result;

import java.time.LocalDate;

public record ResumeDataDto(
    Long resumeId,
    String title,
    String content,
    LocalDate startedAt,
    LocalDate endedAt
) {}
