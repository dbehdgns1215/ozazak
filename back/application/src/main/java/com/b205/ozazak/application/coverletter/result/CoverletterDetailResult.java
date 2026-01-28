package com.b205.ozazak.application.coverletter.result;

import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import com.b205.ozazak.domain.essay.entity.Essay;
import com.b205.ozazak.domain.question.entity.Question;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class CoverletterDetailResult {
    private final Long id;
    private final String title;
    private final String companyName;
    private final String jobType;
    private final Boolean isComplete;
    private final Boolean isPassed;
    private final LocalDateTime updatedAt;
    private final List<EssayGroupResult> essayList;

    @Getter
    @Builder
    public static class EssayGroupResult {
        private final String question;
        private final Integer charMax;
        private final String applyUrl;
        private final List<EssayVersionResult> versions;
    }

    @Getter
    @Builder
    public static class EssayVersionResult {
        private final Long id;
        private final Integer version;
        private final String title;
        private final String content;
        private final Boolean isCurrent;

        public static EssayVersionResult from(Essay essay) {
            return EssayVersionResult.builder()
                    .id(essay.getId().value())
                    .version(essay.getVersion().value())
                    .title(essay.getVersionTitle().value())
                    .content(essay.getContent().value())
                    .isCurrent(essay.getIsCurrent().value())
                    .build();
        }
    }

    public static CoverletterDetailResult of(Coverletter coverletter, List<EssayGroupResult> essayList) {
        // recruitment와 company null 처리
        String companyName = null;
        if (coverletter.getRecruitment() != null 
                && coverletter.getRecruitment().getCompany() != null 
                && coverletter.getRecruitment().getCompany().getName() != null) {
            companyName = coverletter.getRecruitment().getCompany().getName().value();
        }
        
        return CoverletterDetailResult.builder()
                .id(coverletter.getId().value())
                .title(coverletter.getTitle().value())
                .companyName(companyName)
                .isComplete(coverletter.getIsComplete().value())
                .isPassed(coverletter.getIsPassed().value())
                .updatedAt(coverletter.getUpdatedAt() != null ? coverletter.getUpdatedAt().value() : null)
                .essayList(essayList)
                .build();
    }

    public static EssayGroupResult from(Question question, List<Essay> essays) {
        List<EssayVersionResult> versions = essays.stream()
                .map(EssayVersionResult::from)
                .sorted(Comparator.comparing(EssayVersionResult::getVersion).reversed()) // Latest version first
                .collect(Collectors.toList());

        return EssayGroupResult.builder()
                .question(question.getContent() != null ? question.getContent().value() : null)
                .charMax(question.getCharMax() != null ? question.getCharMax().value() : null)
                .applyUrl(question.getRecruitment() == null ? null : question.getRecruitment().getApplyUrl() != null ? question.getRecruitment().getApplyUrl().value() : null)
                .versions(versions)
                .build();
    }
}
