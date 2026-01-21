package com.b205.scripter.global.response;

import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private final T data;

    private ApiResponse(T data) {
        this.data = data;
    }

    // 성공 시 (데이터 있음)
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data);
    }

    // 성공 시 (데이터 없음)
    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(null);
    }

    // 실패 시 (에러 메시지)
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(null);
    }
}