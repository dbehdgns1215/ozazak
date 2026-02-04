package com.b205.ozazak.application.community.result;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Result DTO for individual TIL item
 */
@Builder
public record TilItemResult(
    Long tilId,
    String title,
    String content,
    AuthorInfo author,
    List<String> tags,
    Integer view,
    Long commentCount,
    List<ReactionInfo> reactions,
    List<ReactionInfo> userReaction,
    LocalDateTime createdAt
) {
    @Builder
    public record AuthorInfo(
        Long accountId,
        String name,
        String img,
        String companyName
    ) {}

    @Builder
    public record ReactionInfo(
        Integer type,
        Long count
    ) {}
}
