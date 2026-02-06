package com.b205.ozazak.application.essay.command;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AIGenerateEssayBatchCommand {
    private final Long accountId;
    private final Long recruitmentId;
    private final List<Long> referenceCoverletterIds;
    private final List<EssayGenerationItem> essays;

    @Getter
    @Builder
    public static class EssayGenerationItem {
        private final Long essayId;
        private final List<Long> referenceBlockIds;
        private final String essayContent;
        private final String userPrompt;
        private final String question;  // [NEW]
    }
}
