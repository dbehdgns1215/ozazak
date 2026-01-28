package com.b205.ozazak.application.recruitment.result;

import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class GetRecruitmentResult {
    private final Long recruitmentId;
    private final Long companyId;
    private final String companyName;
    private final String companyImg;
    private final String companyLocation;
    private final String title;
    private final String content;
    private final LocalDate startedAt;
    private final LocalDate endedAt;
    private final String applyUrl;
    private final boolean isBookmarked;
    private final long dDay;
    private final LocalDateTime createdAt;

    private final List<QuestionResult> questions;

    @Getter
    @Builder
    public static class QuestionResult {
        private final Long id;
        private final String content;
        private final Integer charMax;

        public static QuestionResult from(Question question) {
            return QuestionResult.builder()
                    .id(question.getId().value())
                    .content(question.getContent().value())
                    .charMax(question.getCharMax().value())
                    .build();
        }
    }

    public static GetRecruitmentResult from(
            Recruitment recruitment,
            List<Question> questions,
            boolean isBookmarked) {
        return GetRecruitmentResult.builder()
                .recruitmentId(recruitment.getId().value())
                .companyId(recruitment.getCompany().getId().value())
                .companyName(recruitment.getCompany().getName().value())
                .companyImg(recruitment.getCompany().getImg().value())
                .companyLocation(recruitment.getCompany().getLocation().value())
                .title(recruitment.getTitle().value())
                .content(recruitment.getContent().value())
                .startedAt(recruitment.getStartedAt().value())
                .endedAt(recruitment.getEndedAt().value())
                .applyUrl(recruitment.getApplyUrl().value())
                .isBookmarked(isBookmarked)
                .dDay(recruitment.getEndedAt().calculateDDay())
                .createdAt(recruitment.getCreatedAt().value())
                .questions(questions.stream().map(QuestionResult::from).toList())
                .build();
    }
}
