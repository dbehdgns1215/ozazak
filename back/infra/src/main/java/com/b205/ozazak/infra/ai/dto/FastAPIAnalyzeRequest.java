package com.b205.ozazak.infra.ai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * FastAPI /analyze 요청 DTO
 */
@Getter
@Builder
public class FastAPIAnalyzeRequest {
    private String companyName;
    private String recruitmentTitle;
    private String recruitmentContent;
    private List<String> questions;
}
