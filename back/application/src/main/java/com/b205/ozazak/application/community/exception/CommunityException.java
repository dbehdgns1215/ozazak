package com.b205.ozazak.application.community.exception;

import lombok.Getter;

@Getter
public class CommunityException extends RuntimeException {
    private final CommunityErrorCode errorCode;

    public CommunityException(CommunityErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
