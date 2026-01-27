package com.b205.ozazak.presentation.community.til;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 * Request DTO for TIL list query parameters
 */
public record ListTilRequest(
    String authorStatus,
    String tags,
    @Min(0) Integer page,
    @Min(1) @Max(100) Integer size,
    Long authorId
) {
    // Constructor with defaults
    public ListTilRequest {
        if (page == null) {
            page = 0;
        }
        if (size == null) {
            size = 10;
        }
    }
}
