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
    private final String companyImage;  // 기업 로고 이미지 URL
    private final String title;
    private final LocalDateTime startedAt;
    private final LocalDateTime endedAt;
    private final boolean isBookmarked;
    private final long dDay;
    private final LocalDateTime createdAt;
    private final String companySize;

    public static GetRecruitmentListResult from(Recruitment recruitment, boolean isBookmarked) {
        return GetRecruitmentListResult.builder()
                .recruitmentId(recruitment.getId().value())
                .companyName(recruitment.getCompany().getName().value())
                .companyImage(recruitment.getCompany().getImg() != null ? recruitment.getCompany().getImg().value() : null)
                .title(recruitment.getTitle().value())
                .startedAt(recruitment.getStartedAt().value())
                .endedAt(recruitment.getEndedAt().value())
                .isBookmarked(isBookmarked)
                .dDay(recruitment.getEndedAt().calculateDDay())
                .createdAt(recruitment.getCreatedAt().value())
                .companySize(recruitment.getCompany().getSize().getDescription())
                .build();
    }
}
