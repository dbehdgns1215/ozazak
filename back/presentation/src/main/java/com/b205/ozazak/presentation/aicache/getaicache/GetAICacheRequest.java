package com.b205.ozazak.presentation.aicache.getaicache;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GetAICacheRequest {
    @JsonProperty("company_name")
    private String companyName;
    private String position;
    @JsonProperty("job_posting")
    private String jobPosting;
}
