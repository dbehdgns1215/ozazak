package com.b205.ozazak.presentation.project.getProjectList;

import com.b205.ozazak.application.project.result.GetProjectResult;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public record GetProjectListResponse(
        Data data) {
    public static GetProjectListResponse from(Page<GetProjectResult> page) {
        List<ProjectContent> contents = page.getContent().stream()
                .map(ProjectContent::from)
                .toList();

    @Getter
    @Builder
    public static class Data {
        private final Long projectId;
        private final AuthorInfo author;
        private final String title;
        private final String content;
        private final String thumbnailUrl;
        private final LocalDate startedAt;
        private final LocalDate endedAt;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
        private final LocalDateTime deletedAt;
        private final List<String> tags;
    }

    public record Data(
            List<ProjectContent> contents,
            PageInfo pageInfo) {
    }

    public static GetProjectListResponse from(GetProjectResult result) {
        return GetProjectListResponse.builder()
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
                        .thumbnailUrl(result.getImage())
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
