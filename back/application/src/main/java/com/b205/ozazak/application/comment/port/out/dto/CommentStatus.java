package com.b205.ozazak.application.comment.port.out.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentStatus {
    private final Long commentId;
    private final Long authorId;
    private final LocalDateTime deletedAt;
    
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
