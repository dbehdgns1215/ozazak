package com.b205.ozazak.presentation.activity.update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateAwardRequest(
        @NotBlank(message = "Award title must not be blank")
        String title,
        
        String rankName,
        
        String organization,
        
        @NotNull(message = "Award date must not be null")
        String awardedAt
) {}
