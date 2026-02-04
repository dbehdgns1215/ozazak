package com.b205.ozazak.application.community.exception;

import lombok.Getter;

@Getter
public class CommunityException extends RuntimeException {
    private final CommunityErrorCode errorCode;
    private final String customMessage;
    private final java.util.Map<String, Object> payload;

    public CommunityException(CommunityErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.customMessage = null;
        this.payload = null;
    }

    public CommunityException(CommunityErrorCode errorCode, String customMessage) {
        super(customMessage);
        this.errorCode = errorCode;
        this.customMessage = customMessage;
        this.payload = null;
    }

    public CommunityException(CommunityErrorCode errorCode, String customMessage, java.util.Map<String, Object> payload) {
        super(customMessage);
        this.errorCode = errorCode;
        this.customMessage = customMessage;
        this.payload = payload;
    }

    @Override
    public String getMessage() {
        return customMessage != null ? customMessage : errorCode.getMessage();
    }
}
