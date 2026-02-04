package com.b205.ozazak.application.community.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CommunityErrorCode {
    BAD_REQUEST("BAD_REQUEST", "Invalid request.", HttpStatus.BAD_REQUEST),
    NOT_FOUND("NOT_FOUND", "Community not found.", HttpStatus.NOT_FOUND),
    COMMENT_NOT_FOUND("COM-001", "Comment not found", HttpStatus.NOT_FOUND),
    COMMENT_FLOODING_DETECTED("COM-002", "잠시 후 다시 시도해주세요. (도배 방지)", HttpStatus.TOO_MANY_REQUESTS),


    // Image
    PAYLOAD_TOO_LARGE("IMG-001", "Image size exceeds limit", HttpStatus.PAYLOAD_TOO_LARGE),
    UNSUPPORTED_MEDIA_TYPE("IMG-002", "Unsupported image type", HttpStatus.UNSUPPORTED_MEDIA_TYPE),
    IMAGE_PROCESSING_ERROR("IMG-003", "Failed to process image", HttpStatus.INTERNAL_SERVER_ERROR),
    IMAGE_UPLOAD_ERROR("IMG-004", "Failed to upload image", HttpStatus.INTERNAL_SERVER_ERROR),
    FORBIDDEN("FORBIDDEN", "Access denied.", HttpStatus.FORBIDDEN);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
