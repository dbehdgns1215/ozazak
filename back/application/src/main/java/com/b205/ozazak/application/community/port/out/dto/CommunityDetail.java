package com.b205.ozazak.application.community.port.out.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CommunityDetail {
    private final Long communityId;
    private final Integer communityCode;
    private final String title;
    private final String content;
    private final AuthorInfo author;
    private final Integer view;
    private final Long commentCount;
    private final List<String> tags;
    private final List<ReactionCount> reactions;
    private final List<ReactionCount> userReactions;
    private final LocalDateTime createdAt;

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
    public static class ReactionCount {
        private final Integer type;
        private final Long count;
    }
}
