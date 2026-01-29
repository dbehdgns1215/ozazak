package com.b205.ozazak.presentation.essay.aiGenerate;

import com.b205.ozazak.application.essay.result.AIGenerateEssayBatchResult;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class AIGenerateEssayResponse {
    private final Data data;

    @Getter
    @Builder
    public static class Data {
        private final List<EssayResult> results;
        private final Summary summary;
    }

    @Getter
    @Builder
    public static class EssayResult {
        private final Long essayId;
        private final Long questionId;
        private final String question;
        private final String content;
        private final Integer version;
        private final String versionTitle;
        private final Boolean isNewVersion;
        private final String status;
        private final String errorMessage;
    }

    @Getter
    @Builder
    public static class Summary {
        private final int totalRequested;
        private final int successCount;
        private final int failedCount;
        private final int newVersionCount;
        private final int overwriteCount;
    }

    public static AIGenerateEssayResponse from(AIGenerateEssayBatchResult result) {
        List<EssayResult> essayResults = result.getResults().stream()
                .map(r -> EssayResult.builder()
                        .essayId(r.getEssayId())
                        .questionId(r.getQuestionId())
                        .question(r.getQuestion())
                        .content(r.getContent())
                        .version(r.getVersion())
                        .versionTitle(r.getVersionTitle())
                        .isNewVersion(r.getIsNewVersion())
                        .status(r.getStatus())
                        .errorMessage(r.getErrorMessage())
                        .build())
                .collect(Collectors.toList());

        Summary summary = Summary.builder()
                .totalRequested(result.getSummary().getTotalRequested())
                .successCount(result.getSummary().getSuccessCount())
                .failedCount(result.getSummary().getFailedCount())
                .newVersionCount(result.getSummary().getNewVersionCount())
                .overwriteCount(result.getSummary().getOverwriteCount())
                .build();

        return AIGenerateEssayResponse.builder()
                .data(Data.builder()
                        .results(essayResults)
                        .summary(summary)
                        .build())
                .build();
    }
}
