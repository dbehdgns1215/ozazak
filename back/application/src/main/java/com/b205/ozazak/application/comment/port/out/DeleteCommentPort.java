package com.b205.ozazak.application.comment.port.out;

import java.time.LocalDateTime;

public interface DeleteCommentPort {
    void softDelete(Long commentId, LocalDateTime deletedAt);
}
