package com.b205.ozazak.domain.comment.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.comment.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Comment {
    private final CommentId id;
    private final Community community;
    private final Account account;
    private final CommentContent content;
    private final CreatedAt createdAt;
    private final UpdatedAt updatedAt;
    private final DeletedAt deletedAt;
}
