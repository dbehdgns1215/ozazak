package com.b205.ozazak.application.recruitment.result;

import com.b205.ozazak.domain.question.entity.Question;
import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class RecruitmentDetailResult {
    private final String name;
    private final String title;
    private final LocalDate startedAt;
    private final LocalDate endedAt;
    private final String applyUrl;
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

    public static RecruitmentDetailResult from(Recruitment recruitment, List<Question> questions) {
        return RecruitmentDetailResult.builder()
                .name(recruitment.getCompany().getName().value())
                .title(recruitment.getTitle().value())
                .startedAt(recruitment.getStartedAt().value())
                .endedAt(recruitment.getEndedAt().value())
                .applyUrl(recruitment.getApplyUrl().value())
                .questions(questions.stream()
                        .map(QuestionResult::from)
                        .toList())
                .build();
    }
}
