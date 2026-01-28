package com.b205.ozazak.presentation.resume.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateResumeRequest(
    @NotBlank(message = "Company name (title) is required")
    String title,
    
    @NotBlank(message = "Content is required")
    String content,
    
    @NotNull(message = "Started date is required")
    LocalDate startedAt,
    
    LocalDate endedAt  // optional
) {}
