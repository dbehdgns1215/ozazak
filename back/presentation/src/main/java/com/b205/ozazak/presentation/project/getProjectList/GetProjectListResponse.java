package com.b205.ozazak.presentation.project.getProjectList;

import com.b205.ozazak.application.project.result.GetProjectResult;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class GetProjectListResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final List<ProjectContent> contents;
        private final PageInfo pageInfo;
    }

    @Getter
    @Builder
    public static class PageInfo {
        private final int currentPage;
        private final int totalPages;
        private final long totalElements;
        private final boolean hasNext;
    }

    @Getter
    @Builder
    public static class ProjectContent {
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

        public static ProjectContent from(GetProjectResult result) {
            return ProjectContent.builder()
                    .projectId(result.getProjectId())
                    .author(AuthorInfo.from(result.getAuthor()))
                    .title(result.getTitle())
                    .content(result.getContent())
                    .thumbnailUrl(result.getImage())
                    .startedAt(result.getStartedAt())
                    .endedAt(result.getEndedAt())
                    .createdAt(result.getCreatedAt())
                    .updatedAt(result.getUpdatedAt())
                    .deletedAt(result.getDeletedAt())
                    .tags(result.getTags())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class AuthorInfo {
        private final Long accountId;
        private final String name;
        private final String img;
        private final Long companyId;

        public static AuthorInfo from(GetProjectResult.AuthorInfo info) {
            if (info == null) return null;
            return AuthorInfo.builder()
                    .accountId(info.getAccountId())
                    .name(info.getName())
                    .img(info.getImg())
                    .companyId(info.getCompanyId())
                    .build();
        }
    }

    public static GetProjectListResponse from(Page<GetProjectResult> page) {
        List<ProjectContent> contents = page.getContent().stream()
                .map(ProjectContent::from)
                .toList();

        PageInfo pageInfo = PageInfo.builder()
                .currentPage(page.getNumber())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .hasNext(page.hasNext())
                .build();

        return GetProjectListResponse.builder()
                .data(Data.builder()
                        .contents(contents)
                        .pageInfo(pageInfo)
                        .build())
                .build();
    }
}
