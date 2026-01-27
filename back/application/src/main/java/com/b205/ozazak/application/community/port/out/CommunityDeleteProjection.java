package com.b205.ozazak.application.community.port.out;

import java.time.LocalDateTime;

public interface CommunityDeleteProjection {
    Long getAuthorId();
    LocalDateTime getDeletedAt();
}
