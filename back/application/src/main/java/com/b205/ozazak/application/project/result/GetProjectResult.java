package com.b205.ozazak.application.project.result;

import com.b205.ozazak.domain.project.entity.Project;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class GetProjectResult {
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

    @Getter
    @Builder
    public static class AuthorInfo {
        private final Long accountId;
        private final String name;
        private final String img;
        private final Long companyId;
    }

    public static GetProjectResult from(Project project) {
        return GetProjectResult.builder()
                .projectId(project.getProjectId().value())
                .author(AuthorInfo.builder()
                        .accountId(project.getAuthor().getId().value())
                        .name(project.getAuthor().getName().value())
                        .img(project.getAuthor().getImg() != null ? project.getAuthor().getImg().value() : null)
                        .companyId(project.getAuthor().getCompany() != null
                                ? project.getAuthor().getCompany().getId().value()
                                : null)
                        .build())
                .title(project.getTitle().value())
                .content(project.getContent().value())
                .image(project.getImage() != null ? project.getImage().value() : null)
                .startedAt(project.getStartedAt().value())
                .endedAt(project.getEndedAt() != null ? project.getEndedAt().value() : null)
                .createdAt(project.getCreatedAt().value())
                .updatedAt(project.getUpdatedAt() != null ? project.getUpdatedAt().value() : null)
                .deletedAt(project.getDeletedAt() != null ? project.getDeletedAt().value() : null)
                .tags(project.getTags())
                .build();
    }
}
