package com.b205.scripter.global.error;

import com.b205.scripter.global.response.ApiResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ApiResponse<Void> handleCustomException(CustomException e) {
        return ApiResponse.error(e.getErrorCode().getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception e) {
        e.printStackTrace();
        return ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR.getMessage());
    }
}