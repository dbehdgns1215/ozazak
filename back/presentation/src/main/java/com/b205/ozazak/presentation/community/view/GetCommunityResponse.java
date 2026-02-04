package com.b205.ozazak.presentation.community.view;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class GetCommunityResponse {
    private final Long communityId;
    private final Integer communityCode;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;
    private final Integer view;
    private final Long commentCount;
    private final List<String> tags;
    private final List<ReactionInfo> reactions;
    private final List<ReactionInfo> userReactions;
    private final AuthorInfo author;

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
}
