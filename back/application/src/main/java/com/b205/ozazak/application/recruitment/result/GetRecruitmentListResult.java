package com.b205.ozazak.application.recruitment.result;

import com.b205.ozazak.domain.recruitment.entity.Recruitment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class GetRecruitmentListResult {
    private final Long recruitmentId;
    private final String companyName;
    private final String title;
    private final LocalDate startedAt;
    private final LocalDate endedAt;
    private final boolean isBookmarked;
    private final long dDay;
    private final LocalDateTime createdAt;

    public static GetRecruitmentListResult from(Recruitment recruitment, boolean isBookmarked) {
        return GetRecruitmentListResult.builder()
                .recruitmentId(recruitment.getId().value())
                .companyName(recruitment.getCompany().getName().value())
                .title(recruitment.getTitle().value())
                .startedAt(recruitment.getStartedAt().value())
                .endedAt(recruitment.getEndedAt().value())
                .isBookmarked(isBookmarked)
                .dDay(recruitment.getEndedAt().calculateDDay())
                .createdAt(recruitment.getCreatedAt().value())
                .build();
    }
}
