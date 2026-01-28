package com.b205.ozazak.application.comment.port.out.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Application-layer DTO for comment data from infrastructure.
 * Does NOT contain isMine - that is calculated in the service layer.
 */
@Getter
@Builder
public class CommentRow {
    private final Long commentId;
    private final Long authorId;
    private final String authorName;
    private final String authorImg;
    private final String companyName;  // nullable
    private final String content;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;  // nullable
}
