package com.b205.ozazak.application.community.dto;

import com.b205.ozazak.domain.community.entity.Community;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class GetCommunityResult {
    private final Long communityId;
    private final AuthorInfo author;
    private final String title;
    private final String content;
    private final Integer view;
    private final Integer communityCode;
    private final Boolean isHot;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    
    // Additional fields
    private final List<String> tags;
    private final Long commentCount;
    private final Long reactionCount;

    @Getter
    @Builder
    public static class AuthorInfo {
        private final Long accountId;
        private final String name;
        private final String img;
        private final Long companyId;
    }

    public static GetCommunityResult from(Community community) {
        return GetCommunityResult.builder()
                .communityId(community.getId().value())
                .author(AuthorInfo.builder()
                        .accountId(community.getAuthor().getId().value())
                        .name(community.getAuthor().getName().value())
                        .img(community.getAuthor().getImg().value())
                        .companyId(community.getAuthor().getCompany() != null ? community.getAuthor().getCompany().getId().value() : null)
                        .build())
                .title(community.getTitle() != null ? community.getTitle().value() : null)
                .content(community.getContent() != null ? community.getContent().value() : null)
                .view(community.getView() != null ? community.getView().value() : null)
                .communityCode(community.getCommunityCode() != null ? community.getCommunityCode().value() : null)
                .isHot(community.getIsHot() != null ? community.getIsHot().value() : null)
                .createdAt(community.getCreatedAt().value())
                .updatedAt(community.getUpdatedAt() != null ? community.getUpdatedAt().value() : null)
                .tags(community.getTags())
                .commentCount(community.getCommentCount())
                .reactionCount(community.getReactionCount())
                .build();
    }
}
