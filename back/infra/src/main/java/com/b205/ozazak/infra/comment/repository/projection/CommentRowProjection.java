package com.b205.ozazak.infra.comment.repository.projection;

import java.time.LocalDateTime;

/**
 * JPA Projection for comment list query.
 * Field names must match JPQL SELECT aliases exactly.
 */
public interface CommentRowProjection {
    Long getCommentId();
    Long getAuthorId();
    String getAuthorName();
    String getAuthorImg();
    String getCompanyName();  // nullable
    String getContent();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();  // nullable
}
