package com.b205.ozazak.application.community.result;

import lombok.Builder;

import java.util.List;

/**
 * Result DTO for TIL list response
 */
@Builder
public record ListTilResult(
    List<TilItemResult> items,
    PageInfoResult pageInfo
) {}
