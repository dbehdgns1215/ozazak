package com.b205.ozazak.application.essay.service;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * 비동기 처리에 필요한 컨텍스트 데이터 (Lazy Loading 방지)
 */
@Getter
@Builder
public class AIGenerationContext {
    private final String company;
    private final String recruitmentTitle;
    private final String recruitmentContent;  // 공고 전체 내용 (캐시 키 생성용)
    private final List<ReferenceEssayData> referenceEssays;
    private final Map<String, Object> recruitmentAnalysis;  // FastAPI 공고 분석 결과

    @Getter
    @Builder
    public static class ReferenceEssayData {
        private final String question;
        private final String content;
    }

    @Getter
    @Builder
    public static class BlockData {
        private final Long blockId;
        private final String title;
        private final String content;
        private final List<String> categories;
    }

    @Getter
    @Builder
    public static class EssayData {
        private final Long essayId;
        private final Long questionId;
        private final String questionContent;
        private final Long coverletterId;
        private final Long accountId;
        private final Integer currentVersion;
    }
}
