package com.b205.ozazak.application.essay.result;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AIGenerateEssayBatchResult {
    private final List<EssayGenerationResult> results;
    private final Summary summary;

    @Getter
    @Builder
    public static class EssayGenerationResult {
        private final Long essayId;
        private final Long questionId;
        private final String question;
        private final String content;
        private final Integer version;
        private final String versionTitle;
        private final Boolean isNewVersion;
        private final String status;  // SUCCESS, FAILED
        private final String errorMessage;  // nullable

        public static EssayGenerationResult success(
                Long essayId, Long questionId, String question,
                String content, Integer version, String versionTitle, boolean isNewVersion
        ) {
            return EssayGenerationResult.builder()
                    .essayId(essayId)
                    .questionId(questionId)
                    .question(question)
                    .content(content)
                    .version(version)
                    .versionTitle(versionTitle)
                    .isNewVersion(isNewVersion)
                    .status("SUCCESS")
                    .build();
        }

        public static EssayGenerationResult failed(Long essayId, Long questionId, String question, String errorMessage) {
            return EssayGenerationResult.builder()
                    .essayId(essayId)
                    .questionId(questionId)
                    .question(question)
                    .status("FAILED")
                    .errorMessage(errorMessage)
                    .build();
        }
    }

    @Getter
    @Builder
    public static class Summary {
        private final int totalRequested;
        private final int successCount;
        private final int failedCount;
        private final int newVersionCount;
        private final int overwriteCount;

        public static Summary from(List<EssayGenerationResult> results) {
            int success = 0, failed = 0, newVersion = 0, overwrite = 0;
            for (EssayGenerationResult r : results) {
                if ("SUCCESS".equals(r.getStatus())) {
                    success++;
                    if (Boolean.TRUE.equals(r.getIsNewVersion())) {
                        newVersion++;
                    } else {
                        overwrite++;
                    }
                } else {
                    failed++;
                }
            }
            return Summary.builder()
                    .totalRequested(results.size())
                    .successCount(success)
                    .failedCount(failed)
                    .newVersionCount(newVersion)
                    .overwriteCount(overwrite)
                    .build();
        }
    }
}
