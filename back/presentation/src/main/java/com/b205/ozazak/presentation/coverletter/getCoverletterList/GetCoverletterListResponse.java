package com.b205.ozazak.presentation.coverletter.getCoverletterList;

import com.b205.ozazak.application.coverletter.port.in.GetCoverletterListUseCase;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class GetCoverletterListResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final List<CoverletterItem> items;
        private final PageInfo pageInfo;
    }

    @Getter
    @Builder
    public static class CoverletterItem {
        private final Long id;
        private final String title;
        private final String companyName;
        private final String jobType;
        private final Boolean isComplete;
        private final Boolean isPassed;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
    }

    @Getter
    @Builder
    public static class PageInfo {
        private final Integer currentPage;
        private final Integer totalPages;
        private final Long totalElements;
        private final Boolean hasNext;
    }

    public static GetCoverletterListResponse from(GetCoverletterListUseCase.CoverletterListResponse response) {
        List<CoverletterItem> items = response.getItems().stream()
                .map(result -> CoverletterItem.builder()
                        .id(result.getId())
                        .title(result.getTitle())
                        .companyName(result.getCompanyName())
                        .jobType(result.getJobType())
                        .isComplete(result.getIsComplete())
                        .isPassed(result.getIsPassed())
                        .createdAt(result.getCreatedAt())
                        .updatedAt(result.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        GetCoverletterListUseCase.PageInfo pageInfo = response.getPageInfo();
        PageInfo pageInfoDto = PageInfo.builder()
                .currentPage(pageInfo.getCurrentPage())
                .totalPages(pageInfo.getTotalPages())
                .totalElements(pageInfo.getTotalElements())
                .hasNext(pageInfo.isHasNext())
                .build();

        return GetCoverletterListResponse.builder()
                .data(Data.builder()
                        .items(items)
                        .pageInfo(pageInfoDto)
                        .build())
                .build();
    }
}
