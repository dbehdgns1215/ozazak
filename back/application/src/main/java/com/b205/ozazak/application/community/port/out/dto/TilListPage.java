package com.b205.ozazak.application.community.port.out.dto;

import lombok.Builder;

import java.util.List;

/**
 * Page result for TIL list
 */
@Builder
public record TilListPage(
    List<TilRow> items,
    Long totalElements,
    Integer totalPages,
    Integer currentPage,
    Integer pageSize
) {}
