package com.b205.ozazak.infra.ai.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FastAPIEmbeddingRequest {
    private final String text;
}
