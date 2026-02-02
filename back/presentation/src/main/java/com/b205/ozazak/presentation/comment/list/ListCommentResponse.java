package com.b205.ozazak.presentation.comment.list;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ListCommentResponse {
    private final List<CommentItem> items;
    private final PageInfo pageInfo;  // nullable - reserved for future pagination

    @Getter
    @Builder
    public static class CommentItem {
        private final Long commentId;
        private final AuthorInfo author;
        private final String content;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;  // nullable
        private final boolean isMine;
    }

    @Getter
    @Builder
    public static class AuthorInfo {
        private final Long accountId;
        private final String img;
        private final String name;
        private final String companyName;  // nullable
    }

    @Getter
    @Builder
    public static class PageInfo {
        private final int totalPage;
        private final int currentPage;
        private final long totalElements;
        private final int size;
    }
}
