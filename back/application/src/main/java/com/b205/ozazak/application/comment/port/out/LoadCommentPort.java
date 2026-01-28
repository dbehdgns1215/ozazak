package com.b205.ozazak.application.comment.port.out;

import com.b205.ozazak.application.comment.port.out.dto.CommentStatus;

import java.util.Optional;

public interface LoadCommentPort {
    Optional<CommentStatus> loadStatus(Long commentId);
}
