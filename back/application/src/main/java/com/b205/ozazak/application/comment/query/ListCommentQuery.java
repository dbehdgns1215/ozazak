package com.b205.ozazak.application.comment.query;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ListCommentQuery {
    private final Long communityId;
    private final Long viewerAccountId;  // nullable for anonymous access
}
