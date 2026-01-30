package com.b205.ozazak.application.essay.port.out;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * FastAPI AI 생성 호출 포트
 */
public interface AIGenerationPort {

    /**
     * 단일 질문에 대해 AI 자소서 생성
     */
    String generate(AIGenerationRequest request);

    /**
     * 공고 분석 요청 (Redis 캐시 MISS 시 호출)
     */
    Map<String, Object> analyze(RecruitmentAnalysisRequest request);

    /**
     * 자소서에서 경험 블록 추출 요청
     */
    List<ExtractedBlock> extractBlocks(ExtractBlocksRequest request);

    @Getter
    @Builder
    class AIGenerationRequest {
        private final String company;           // 회사명
        private final String recruitmentTitle;  // 공고 제목
        private final String question;          // 질문 내용
        private final List<ReferenceEssay> referenceEssays;  // 참조 자소서
        private final List<ReferenceBlock> referenceBlocks;  // 참조 블록
        private final String userPrompt;        // 사용자 추가 지시사항
        private final Map<String, Object> recruitmentAnalysis;  // 공고 분석 결과
    }

    @Getter
    @Builder
    class RecruitmentAnalysisRequest {
        private final String companyName;
        private final String recruitmentTitle;
        private final String recruitmentContent;  // 공고 전체 내용
        private final List<String> questions;  // 질문 목록
    }

    @Getter
    @Builder
    class ExtractBlocksRequest {
        private final List<String> essayContents;  // 자소서 내용 목록
        private final List<CategoryInfo> availableCategories;  // 사용 가능한 카테고리 목록
    }

    @Getter
    @Builder
    class CategoryInfo {
        private final Integer code;
        private final String name;
    }

    @Getter
    @Builder
    class ExtractedBlock {
        private final String title;
        private final String content;
        private final List<Integer> categories;  // 카테고리 코드 목록
    }

    @Getter
    @Builder
    class ReferenceEssay {
        private final String question;
        private final String content;
    }

    @Getter
    @Builder
    class ReferenceBlock {
        private final String title;
        private final String content;
        private final List<String> categories;
    }
}

