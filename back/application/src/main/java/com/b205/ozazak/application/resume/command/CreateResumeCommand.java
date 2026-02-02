package com.b205.ozazak.application.resume.command;

import java.time.LocalDate;

public record CreateResumeCommand(
    Long accountId,
    String title,
    String content,
    LocalDate startedAt,
    LocalDate endedAt
) {}
