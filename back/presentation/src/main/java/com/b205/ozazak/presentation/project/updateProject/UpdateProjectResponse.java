package com.b205.ozazak.presentation.project.updateProject;

import com.b205.ozazak.application.project.result.GetProjectResult;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UpdateProjectResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long projectId;
        private final AuthorInfo author;
        private final String title;
        private final String content;
        private final String image;
        private final LocalDate startedAt;
        private final LocalDate endedAt;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
        private final LocalDateTime deletedAt;
        private final List<String> tags;
    }

    @Getter
    @Builder
    public static class AuthorInfo {
        private final Long accountId;
        private final String name;
        private final String img;
        private final Long companyId;
    }

    public static UpdateProjectResponse from(GetProjectResult result) {
        return UpdateProjectResponse.builder()
                .data(Data.builder()
                        .projectId(result.getProjectId())
                        .author(AuthorInfo.builder()
                                .accountId(result.getAuthor().getAccountId())
                                .name(result.getAuthor().getName())
                                .img(result.getAuthor().getImg())
                                .companyId(result.getAuthor().getCompanyId())
                                .build())
                        .title(result.getTitle())
                        .content(result.getContent())
                        .image(result.getImage())
                        .startedAt(result.getStartedAt())
                        .endedAt(result.getEndedAt())
                        .createdAt(result.getCreatedAt())
                        .updatedAt(result.getUpdatedAt())
                        .deletedAt(result.getDeletedAt())
                        .tags(result.getTags())
                        .build())
                .build();
    }
}
