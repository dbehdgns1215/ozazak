package com.b205.ozazak.application.community.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
@Getter
@RequiredArgsConstructor
public enum CommunityErrorCode {
    BAD_REQUEST("BAD_REQUEST", "Invalid request."),
    NOT_FOUND("NOT_FOUND", "Community not found."),
    FORBIDDEN("FORBIDDEN", "Access denied.");

    private final String code;
    private final String message;
}
