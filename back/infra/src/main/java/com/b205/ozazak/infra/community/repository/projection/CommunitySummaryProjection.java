package com.b205.ozazak.infra.community.repository.projection;


public interface CommunitySummaryProjection {
    Long getCommunityId();
    String getTitle();
    Long getAuthorId();
    String getAuthorName();
    String getAuthorImg();
    Long getCommentCount();
}
