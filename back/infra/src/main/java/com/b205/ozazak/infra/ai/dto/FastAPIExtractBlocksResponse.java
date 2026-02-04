package com.b205.ozazak.infra.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * FastAPI /api/ai/blocks/generate 응답 DTO
 * @see ai/src/adapters/inbound/rest/schemas.py - BlockGenerationResponse, BlockData
 */
@Getter
@NoArgsConstructor
public class FastAPIExtractBlocksResponse {
    private boolean success;
    private List<BlockData> blocks;
    private String message;
    private String modelUsed;

    @Getter
    @NoArgsConstructor
    public static class BlockData {
        private String category;
        private String content;
        private List<String> keywords;
        private List<Double> embedding;  // text-embedding-3-large (1536 dim)
    }
}

