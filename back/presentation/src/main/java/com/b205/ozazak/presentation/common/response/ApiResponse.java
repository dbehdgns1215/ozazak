package com.b205.ozazak.presentation.common.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import com.fasterxml.jackson.annotation.JsonInclude;

@Schema(description = "Standard API Response Wrapper")
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    @Schema(description = "Response message", example = "Success")
    private String message;
    
    @Schema(description = "Response data")
    private T data;
    
    @Schema(description = "Pagination info (null if not applicable)")
    private PageInfo page;

    @Getter
    @AllArgsConstructor
    public static class PageInfo {
        @Schema(description = "Current page number (0-indexed)", example = "0")
        private int currentPage;
        
        @Schema(description = "Total number of pages", example = "10")
        private int totalPages;
        
        @Schema(description = "Total number of elements", example = "100")
        private long totalElements;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data, PageInfo pageInfo) {
        return ApiResponse.<T>builder()
                .message(message)
                .data(data)
                .page(pageInfo)
                .build();
    }
}
