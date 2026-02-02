package com.b205.ozazak.presentation.resume.update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record UpdateResumeRequest(
    @NotBlank(message = "Title is required")
    String title,
    
    @NotBlank(message = "Content is required")
    String content,
    
    @NotNull(message = "Started date is required")
    LocalDate startedAt,
    
    LocalDate endedAt  // optional
) {}
