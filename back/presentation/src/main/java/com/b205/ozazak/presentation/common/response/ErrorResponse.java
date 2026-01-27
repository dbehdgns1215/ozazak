package com.b205.ozazak.presentation.common.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard Error Response")
public record ErrorResponse(
    @Schema(description = "HTTP Status Reason or Error Code", example = "BAD_REQUEST")
    String code,

    @Schema(description = "Human-readable error message", example = "Invalid input")
    String message
) {
}
