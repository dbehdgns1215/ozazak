package com.b205.ozazak.application.community.result;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class GetCommunityResult {
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
    private final List<ReactionInfo> reaction;
    private final List<ReactionInfo> userReaction;
    private final LocalDateTime createdAt;

    @Getter
    @Builder
    public static class ReactionInfo {
        private final Integer type;
        private final Long count;
    }
}
