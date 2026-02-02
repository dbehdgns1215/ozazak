package com.b205.ozazak.infra.community.repository.projection;

import java.time.LocalDateTime;

public interface CommunityListProjection {
    Long getCommunityId();
    Integer getCommunityCode();
    String getTitle();
    String getContent();
    Long getAuthorId();
    String getAuthorName();
    String getAuthorImg();
    String getCompanyName();
    Integer getView();
    LocalDateTime getCreatedAt();
}
