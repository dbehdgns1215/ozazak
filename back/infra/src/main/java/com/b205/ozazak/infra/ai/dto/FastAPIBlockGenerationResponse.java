package com.b205.ozazak.infra.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class FastAPIBlockGenerationResponse {
    private boolean success;
    private List<BlockDto> blocks;
    private String message;

    @Getter
    @NoArgsConstructor
    public static class BlockDto {
        private String category;
        private String content;
        private List<String> keywords;
        private List<Double> embedding;
    }
}
