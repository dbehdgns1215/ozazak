package com.b205.ozazak.application.community.result;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ListCommunityResult {
    private final List<CommunityItem> items;
    private final PageInfo resultPage;

    @Getter
    @Builder
    public static class CommunityItem {
        private final Long communityId;
        private final Integer communityCode;
        private final String title;
        private final String content;
        private final Long authorId;
        private final String authorName;
        private final String authorImg;
        private final String companyName;
        private final Integer view;
        private final Long commentCount;
        private final List<String> tags;
        private final List<ReactionInfo> reactions;
        private final LocalDateTime createdAt;
    }

    @Getter
    @Builder
    public static class ReactionInfo {
        private final Integer type;
        private final Long count;
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
