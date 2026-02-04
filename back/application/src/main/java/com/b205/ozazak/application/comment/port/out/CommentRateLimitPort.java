package com.b205.ozazak.application.comment.port.out;

public interface CommentRateLimitPort {
    void checkAndIncrementCount(Long accountId);
}
