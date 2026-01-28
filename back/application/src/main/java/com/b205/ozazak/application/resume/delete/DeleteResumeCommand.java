package com.b205.ozazak.application.resume.delete;

public record DeleteResumeCommand(
    Long accountId,
    Long resumeId
) {}
