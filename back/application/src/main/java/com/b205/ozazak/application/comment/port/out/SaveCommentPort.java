package com.b205.ozazak.application.comment.port.out;

public interface SaveCommentPort {
    Long save(Long communityId, Long authorAccountId, String content);
}
