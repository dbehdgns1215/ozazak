package com.b205.ozazak.presentation.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationRequest {
    @NotBlank @Email
    private String email;
}
