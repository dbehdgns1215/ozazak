package com.b205.ozazak.presentation.community.feed;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ListCommunityResponse {
    private final List<CommunityItem> items;
    private final PageInfo page;

    @Getter
    @Builder
    public static class CommunityItem {
        private final Long communityId;
        private final Integer communityCode;
        private final String title;
        private final String content;
        private final LocalDateTime createdAt;
        private final Integer view;
        private final Long commentCount;
        private final List<String> tags;
        private final List<ReactionInfo> reaction;
        private final List<ReactionInfo> userReaction;
        private final AuthorInfo author;
    }

    @Getter
    @Builder
    public static class AuthorInfo {
        private final Long accountId;
        private final String name;
        private final String img;
        private final String companyName;
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
