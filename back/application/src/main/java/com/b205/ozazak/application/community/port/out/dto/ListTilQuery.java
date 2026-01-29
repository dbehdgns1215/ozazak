package com.b205.ozazak.application.community.port.out.dto;

import lombok.Builder;

import java.util.List;

/**
 * Query DTO for TIL list port
 */
@Builder
public record ListTilQuery(
    Integer communityCode,
    String authorStatus,
    List<String> tags,
    Integer page,
    Integer size,
    Long authorId
) {}
