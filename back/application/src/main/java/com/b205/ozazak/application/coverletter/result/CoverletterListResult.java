package com.b205.ozazak.application.coverletter.result;

import com.b205.ozazak.domain.coverletter.entity.Coverletter;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CoverletterListResult {
    private final Long id;
    private final String title;
    private final String companyName;
    private final String jobType;
    private final Long recruitmentId;
    private final Boolean isComplete;
    private final Boolean isPassed;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static CoverletterListResult from(Coverletter coverletter) {
        return CoverletterListResult.builder()
                .id(coverletter.getId() != null ? coverletter.getId().value() : null)
                .title(coverletter.getTitle() != null ? coverletter.getTitle().value() : null)
                .companyName(coverletter.getRecruitment() != null 
                        && coverletter.getRecruitment().getCompany() != null 
                        && coverletter.getRecruitment().getCompany().getName() != null
                        ? coverletter.getRecruitment().getCompany().getName().value()
                        : null)
                .recruitmentId(coverletter.getRecruitment() != null 
                        ? coverletter.getRecruitment().getId().value()
                        : null)
                .isComplete(coverletter.getIsComplete() != null ? coverletter.getIsComplete().value() : null)
                .isPassed(coverletter.getIsPassed() != null ? coverletter.getIsPassed().value() : null)
                .createdAt(coverletter.getCreatedAt() != null ? coverletter.getCreatedAt().value() : null)
                .updatedAt(coverletter.getUpdatedAt() != null ? coverletter.getUpdatedAt().value() : null)
                .build();
    }
}
