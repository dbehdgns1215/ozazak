package com.b205.ozazak.infra.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FastAPIBlockGenerationRequest {
    @JsonProperty("user_id")
    private final String userId;
    
    @JsonProperty("source_type")
    private final String sourceType;
    
    @JsonProperty("source_content")
    private final String sourceContent;
}
