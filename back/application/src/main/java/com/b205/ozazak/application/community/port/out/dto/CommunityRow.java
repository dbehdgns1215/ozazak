package com.b205.ozazak.application.community.port.out.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CommunityRow {
    private Long communityId;
    private Integer communityCode;
    private String title;
    private String content;
    private AuthorInfo author;
    private Integer view;
    private Long commentCount;
    private List<String> tags;
    private List<ReactionCount> reaction;
    private List<ReactionCount> userReaction;
    private LocalDateTime createdAt;

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
