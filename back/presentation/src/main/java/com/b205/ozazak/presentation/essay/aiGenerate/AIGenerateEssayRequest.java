package com.b205.ozazak.presentation.essay.aiGenerate;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class AIGenerateEssayRequest {

    @NotNull(message = "recruitmentId is required")
    private Long recruitmentId;

    private List<Long> referenceCoverletters;

    @NotEmpty(message = "essays is required")
    private List<EssayItem> essays;

    @Getter
    public static class EssayItem {
        @NotNull(message = "essayId is required")
        private Long essayId;

        private List<Long> referenceBlocks;
        private String essayContent;
        private String userPrompt;
        private String question;  // [NEW] 문항 내용 직접 전달
    }
}
