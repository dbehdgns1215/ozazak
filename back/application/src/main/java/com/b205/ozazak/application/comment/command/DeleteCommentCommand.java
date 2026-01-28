package com.b205.ozazak.application.comment.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteCommentCommand {
    private final Long commentId;
    private final Long deleterAccountId;
}
