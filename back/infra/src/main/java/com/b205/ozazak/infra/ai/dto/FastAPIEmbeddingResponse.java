package com.b205.ozazak.infra.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class FastAPIEmbeddingResponse {
    private boolean success;
    private List<Double> embedding;
    private String message;
}
