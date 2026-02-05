package com.b205.ozazak.presentation.recruitment.getRecruitmentList;

import com.b205.ozazak.application.recruitment.result.GetRecruitmentListResult;
import lombok.Builder;
import lombok.Getter;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class GetRecruitmentListResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long recruitmentId;
        private final String companyName;
        private final String title;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private final LocalDateTime startedAt;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private final LocalDateTime endedAt;
        private final boolean isBookmarked;
        private final long dDay;
        private final LocalDateTime createdAt;
        private final String companySize;
    }

    public static GetRecruitmentListResponse from(GetRecruitmentListResult result) {
        return GetRecruitmentListResponse.builder()
                .data(Data.builder()
                        .recruitmentId(result.getRecruitmentId())
                        .companyName(result.getCompanyName())
                        .title(result.getTitle())
                        .startedAt(result.getStartedAt())
                        .endedAt(result.getEndedAt())
                        .isBookmarked(result.isBookmarked())
                        .dDay(result.getDDay())
                        .createdAt(result.getCreatedAt())
                        .companySize(result.getCompanySize())
                        .build())
                .build();
    }
}
