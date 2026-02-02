package com.b205.ozazak.presentation.account.error;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Account API Error Response")
public record AccountApiErrors(
    @Schema(description = "HTTP Status Reason or Error Code", example = "BAD_REQUEST")
    String code,

    @Schema(description = "Human-readable error message", example = "Invalid account")
    String message
) {
    // Error codes
    public static final String ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND";
    public static final String EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public static final String INVALID_EMAIL = "INVALID_EMAIL";
    public static final String PASSWORD_MISMATCH = "PASSWORD_MISMATCH";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
}
