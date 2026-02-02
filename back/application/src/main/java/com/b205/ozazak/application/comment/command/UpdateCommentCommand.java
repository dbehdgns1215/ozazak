package com.b205.ozazak.application.comment.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateCommentCommand {
    private final Long commentId;
    private final Long editorAccountId;
    private final String content;
}
