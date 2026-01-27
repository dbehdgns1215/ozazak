package com.b205.ozazak.presentation.community.read;

import com.b205.ozazak.application.community.result.GetCommunityResult;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long communityId;
        private final Author author;
        private final String title;
        private final String content;
        private final Integer view;
        private final Integer communityCode;
        private final Boolean isHot;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
    }

    @Getter
    @Builder
    public static class Author {
        private final Long accountId;
        private final String name;
        private final String img;
        private final Long companyId;
    }

    public static CommunityResponse from(GetCommunityResult result) {
        return CommunityResponse.builder()
                .data(Data.builder()
                        .communityId(result.getCommunityId())
                        .author(Author.builder()
                                .accountId(result.getAuthor().getAccountId())
                                .name(result.getAuthor().getName())
                                .img(result.getAuthor().getImg())
                                .companyId(result.getAuthor().getCompanyId())
                                .build())
                        .title(result.getTitle())
                        .content(result.getContent())
                        .view(result.getView())
                        .communityCode(result.getCommunityCode())
                        .isHot(result.getIsHot())
                        .createdAt(result.getCreatedAt())
                        .updatedAt(result.getUpdatedAt())
                        .build())
                .build();
    }
}
