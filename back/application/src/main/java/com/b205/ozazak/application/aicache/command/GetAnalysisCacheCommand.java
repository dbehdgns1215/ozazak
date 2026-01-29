package com.b205.ozazak.application.aicache.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetAnalysisCacheCommand {
    private final String companyName;
    private final String position;
    private final String jobPosting;
}
