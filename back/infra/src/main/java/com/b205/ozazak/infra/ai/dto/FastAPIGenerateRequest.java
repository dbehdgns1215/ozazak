package com.b205.ozazak.infra.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class FastAPIGenerateRequest {
    @JsonProperty("user_id")
    private final String userId;
    
    @JsonProperty("company_name")
    private final String company;
    
    @JsonProperty("recruitment_title")
    private final String recruitmentTitle;
    
    @JsonProperty("position")
    private final String position;
    
    @JsonProperty("question")
    private final String question;
    
    @JsonProperty("cover_letters")
    private final List<ReferenceEssayDto> referenceEssays;
    
    @JsonProperty("blocks")
    private final List<ReferenceBlockDto> referenceBlocks;
    
    @JsonProperty("user_prompt")
    private final String userPrompt;
    
    @JsonProperty("job_analysis")
    private final Map<String, Object> recruitmentAnalysis;

    @Getter
    @Builder
    public static class ReferenceEssayDto {
        @JsonProperty("question")
        private final String question;
        
        @JsonProperty("content")
        private final String content;
    }

    @Getter
    @Builder
    public static class ReferenceBlockDto {
        @JsonProperty("title")
        private final String title;
        
        @JsonProperty("content")
        private final String content;
        
        @JsonProperty("categories")
        private final List<String> categories;
    }
}
