package com.b205.ozazak.infra.community.repository.projection;

import java.time.LocalDateTime;

/**
 * Read-only projection for TIL base data
 */
public interface TilBaseProjection {
    Long getCommunityId();
    String getTitle();
    String getContent();
    Long getAuthorId();
    String getAuthorName();
    String getAuthorImg();
    String getCompanyName();
    Integer getView();
    LocalDateTime getCreatedAt();
}
