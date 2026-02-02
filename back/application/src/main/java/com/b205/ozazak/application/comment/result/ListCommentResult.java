package com.b205.ozazak.application.comment.result;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ListCommentResult {
    private final List<CommentItemResult> items;
    
    /**
     * Pagination info. Nullable.
     * When null, the response represents a non-paginated list.
     * Reserved for future pagination support.
     */
    private final PageInfo pageInfo;

    @Getter
    @Builder
    public static class CommentItemResult {
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
