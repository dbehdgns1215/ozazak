package com.b205.ozazak.presentation.coverletter.getCoverletterDetail;

import com.b205.ozazak.application.coverletter.result.CoverletterDetailResult;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class GetCoverletterDetailResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final Long id;
        private final String title;
        private final String companyName;
        private final String jobType;
        private final Long recruitmentId;
        private final Boolean isComplete;
        private final Boolean isPassed;
        private final LocalDateTime updatedAt;
        private final List<Essay> essayList;
    }

    @Getter
    @Builder
    public static class Essay {
        private final String question;
        private final List<Version> versions;
        private final Integer charMax;
        private final String applyUrl;
    }

    @Getter
    @Builder
    public static class Version {
        private final Long id;
        private final Integer version;
        private final String title;
        private final String content;
        private final Boolean isCurrent;
    }

    public static GetCoverletterDetailResponse from(CoverletterDetailResult result) {
        List<Essay> essayList = result.getEssayList().stream()
                .map(group -> Essay.builder()
                        .question(group.getQuestion())
                        .charMax(group.getCharMax())
                        .applyUrl(group.getApplyUrl())
                        .versions(group.getVersions().stream()
                                .map(v -> Version.builder()
                                        .id(v.getId())
                                        .version(v.getVersion())
                                        .title(v.getTitle())
                                        .content(v.getContent())
                                        .isCurrent(v.getIsCurrent())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return GetCoverletterDetailResponse.builder()
                .data(Data.builder()
                        .id(result.getId())
                        .title(result.getTitle())
                        .companyName(result.getCompanyName())
                        .jobType(result.getJobType())
                        .recruitmentId(result.getRecruitmentId())
                        .isComplete(result.getIsComplete())
                        .isPassed(result.getIsPassed())
                        .updatedAt(result.getUpdatedAt())
                        .essayList(essayList)
                        .build())
                .build();
    }
}
