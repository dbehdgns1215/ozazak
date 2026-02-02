package com.b205.ozazak.application.comment.port.out;

public interface UpdateCommentPort {
    void update(Long commentId, String content);
}
