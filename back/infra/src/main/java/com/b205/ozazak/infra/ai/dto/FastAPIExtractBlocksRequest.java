package com.b205.ozazak.infra.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

/**
 * FastAPI /api/ai/blocks/generate 요청 DTO
 * @see ai/src/adapters/inbound/rest/schemas.py - BlockGenerationRequest
 */
@Getter
@Builder
public class FastAPIExtractBlocksRequest {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("source_type")
    private String sourceType;  // "project" or "cover_letter"

    @JsonProperty("source_content")
    private String sourceContent;

    @JsonProperty("model_type")
    private String modelType;
}

