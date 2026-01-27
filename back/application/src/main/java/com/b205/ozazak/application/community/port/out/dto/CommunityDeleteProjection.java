package com.b205.ozazak.application.community.port.out.dto;

import java.time.LocalDateTime;

public interface CommunityDeleteProjection {
    Long getAuthorId();
    LocalDateTime getDeletedAt();
}
