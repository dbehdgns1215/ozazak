package com.b205.ozazak.presentation.activity.update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateCertificateRequest(
        @NotBlank(message = "Certificate title must not be blank")
        String title,
        
        String rankName,
        
        String organization,
        
        @NotNull(message = "Certificate date must not be null")
        String awardedAt
) {}
