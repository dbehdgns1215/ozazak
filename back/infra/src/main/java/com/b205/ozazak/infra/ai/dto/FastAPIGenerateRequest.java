package com.b205.ozazak.infra.ai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class FastAPIGenerateRequest {
    private final String company;
    private final String recruitmentTitle;
    private final String question;
    private final List<ReferenceEssayDto> referenceEssays;
    private final List<ReferenceBlockDto> referenceBlocks;
    private final String userPrompt;
    private final Map<String, Object> recruitmentAnalysis;  // 공고 분석 결과

    @Getter
    @Builder
    public static class ReferenceEssayDto {
        private final String question;
        private final String content;
    }

    @Getter
    @Builder
    public static class ReferenceBlockDto {
        private final String title;
        private final String content;
        private final List<String> categories;
    }
}
