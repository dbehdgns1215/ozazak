package com.b205.ozazak.presentation.aicache.getaicache;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GetAICacheRequest {
    @JsonProperty("company_name")
    private String companyName;
    @JsonProperty("recruitment_title")
    private String recruitmentTitle;
    @JsonProperty("recruitment_content")
    private String recruitmentContent;
}
