package com.b205.ozazak.application.aicache.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetAnalysisCacheCommand {
    private final String companyName;
    private final String recruitmentTitle;
    private final String recruitmentContent;
}
