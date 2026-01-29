package com.b205.ozazak.presentation.auth.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class VerificationResponse {
    private final String verificationToken;
}
