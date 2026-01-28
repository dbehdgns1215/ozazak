package com.b205.ozazak.application.comment.result;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class DeleteCommentResult {
    private final Long commentId;
    private final LocalDateTime deletedAt;
}
