package com.b205.ozazak.presentation.aicache.saveaicache;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
public class SaveAICacheRequest {
    @JsonProperty("company_name")
    private String companyName;
    private String position;
    @JsonProperty("job_posting")
    private String jobPosting;
    @JsonProperty("started_at")
    private java.time.LocalDate startedAt;
    @JsonProperty("ended_at")
    private java.time.LocalDate endedAt;
    private Map<String, Object> analysis;
}
