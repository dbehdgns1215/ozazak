package com.b205.ozazak.infra.community.repository;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Pure Flat DTO for optimized Community List Query.
 * Does not contain Entity references to prevent accidental lazy loading.
 */
@Getter
@AllArgsConstructor
public class CommunitySummaryJpaResult {
    private final Long communityId;
    private final String title;
    private final Integer view;
    private final Integer communityCode;
    private final Boolean isHot;
    private final LocalDateTime createdAt;
    
    // Author metadata (Flattened)
    private final Long authorId;
    private final String authorName;
    private final String authorImg;
    
    // Aggregate counts (Fetched via correlated subqueries)
    private final Long commentCount;
    private final Long reactionCount;
}
