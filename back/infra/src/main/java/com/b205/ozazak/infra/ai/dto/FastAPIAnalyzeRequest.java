package com.b205.ozazak.infra.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

/**
 * FastAPI /api/ai/job-postings/analyze 요청 DTO
 * @see ai/src/adapters/inbound/rest/schemas.py - JobPostingAnalysisRequest
 */
@Getter
@Builder
public class FastAPIAnalyzeRequest {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("company_name")
    private String companyName;

    private String position;

    @JsonProperty("job_posting")
    private String jobPosting;

    private String requirements;

    @JsonProperty("model_type")
    private String modelType;
}

