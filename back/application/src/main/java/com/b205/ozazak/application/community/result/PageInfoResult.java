package com.b205.ozazak.application.community.result;

import lombok.Builder;

/**
 * Pagination metadata for TIL list
 */
@Builder
public record PageInfoResult(
    Integer currentPage,
    Integer pageSize,
    Long totalElements,
    Integer totalPages,
    Boolean hasNext,
    Boolean hasPrevious
) {}
