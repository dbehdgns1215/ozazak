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

        PageInfo pageInfo = PageInfo.from(page);

        return new GetProjectListResponse(new Data(contents, pageInfo));
    }

    public record Data(
            List<ProjectContent> contents,
            PageInfo pageInfo) {
    }

    public record ProjectContent(
            Long projectId,
            String title,
            LocalDate startDate,
            LocalDate endDate,
            List<String> tags,
            String thumbnailUrl) {
        public static ProjectContent from(GetProjectResult result) {
            return new ProjectContent(
                    result.getProjectId(),
                    result.getTitle(),
                    result.getStartedAt(),
                    result.getEndedAt(),
                    result.getTags(),
                    result.getImage());
        }
    }

    public record PageInfo(
            int currentPage,
            int totalPages,
            long totalElements,
            boolean hasNext) {
        public static PageInfo from(Page<?> page) {
            return new PageInfo(
                    page.getNumber(),
                    page.getTotalPages(),
                    page.getTotalElements(),
                    page.hasNext());
        }
    }
}
