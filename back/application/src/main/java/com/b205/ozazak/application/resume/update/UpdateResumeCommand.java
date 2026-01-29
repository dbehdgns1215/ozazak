package com.b205.ozazak.application.resume.update;

import java.time.LocalDate;

public record UpdateResumeCommand(
    Long accountId,
    Long resumeId,
    String title,
    String content,
    LocalDate startedAt,
    LocalDate endedAt
) {}
