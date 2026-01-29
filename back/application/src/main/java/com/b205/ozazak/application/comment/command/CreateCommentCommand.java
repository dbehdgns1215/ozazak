package com.b205.ozazak.application.comment.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateCommentCommand {
    private final Long communityId;
    private final Long authorAccountId;
    private final String content;
}
