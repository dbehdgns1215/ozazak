package com.b205.ozazak.presentation.recruitment.dto;

import com.b205.ozazak.application.recruitment.result.RecruitmentDetailResult;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class RecruitmentDetailResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final String name;
        private final String title;
        private final LocalDate startedAt;
        private final LocalDate endedAt;
        private final String applyUrl;
        private final List<Question> questions;
    }

    @Getter
    @Builder
    public static class Question {
        private final Long id;
        private final String content;
        private final Integer charMax;
    }

    public static RecruitmentDetailResponse from(RecruitmentDetailResult result) {
        List<Question> questions = result.getQuestions().stream()
                .map(q -> Question.builder()
                        .id(q.getId())
                        .content(q.getContent())
                        .charMax(q.getCharMax())
                        .build())
                .collect(Collectors.toList());

        return RecruitmentDetailResponse.builder()
                .data(Data.builder()
                        .name(result.getName())
                        .title(result.getTitle())
                        .startedAt(result.getStartedAt())
                        .endedAt(result.getEndedAt())
                        .applyUrl(result.getApplyUrl())
                        .questions(questions)
                        .build())
                .build();
    }
}
