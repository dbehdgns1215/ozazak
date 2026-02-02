package com.b205.ozazak.presentation.recruitment.getRecruitment;

import com.b205.ozazak.application.recruitment.result.GetRecruitmentResult;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class GetRecruitmentResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long recruitmentId;
        private final Long companyId;
        private final String companyName;
        private final String companyImg;
        private final String companyLocation;
        private final String title;
        private final String content;
        private final String position;
        private final Integer companySize;
        private final LocalDate startedAt;
        private final LocalDate endedAt;
        private final String applyUrl;
        private final boolean isBookmarked;
        private final long dDay;
        private final LocalDateTime createdAt;
        private final int questionCnt;
        private final List<QuestionResponse> questions;
    }

    @Getter
    @Builder
    public static class QuestionResponse {
        private final Long id;
        private final String content;
        private final Integer charMax;

        public static QuestionResponse from(GetRecruitmentResult.QuestionResult result) {
            return QuestionResponse.builder()
                    .id(result.getId())
                    .content(result.getContent())
                    .charMax(result.getCharMax())
                    .build();
        }
    }

    public static GetRecruitmentResponse from(GetRecruitmentResult result) {
        return GetRecruitmentResponse.builder()
                .data(Data.builder()
                        .recruitmentId(result.getRecruitmentId())
                        .companyId(result.getCompanyId())
                        .companyName(result.getCompanyName())
                        .companyImg(result.getCompanyImg())
                        .companyLocation(result.getCompanyLocation())
                        .title(result.getTitle())
                        .content(result.getContent())
                        .position(result.getPosition())
                        .companySize(result.getCompanySize())
                        .startedAt(result.getStartedAt())
                        .endedAt(result.getEndedAt())
                        .applyUrl(result.getApplyUrl())
                        .isBookmarked(result.isBookmarked())
                        .dDay(result.getDDay())
                        .createdAt(result.getCreatedAt())
                        .questionCnt(result.getQuestionCnt())
                        .questions(result.getQuestions().stream()
                                .map(QuestionResponse::from)
                                .toList())
                        .build())
                .build();
    }
}
