package com.b205.ozazak.application.aicache.command;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class SaveAnalysisCacheCommand {
    private final String companyName;
    private final String position;
    private final String jobPosting;
    private final java.time.LocalDate startedAt;
    private final java.time.LocalDate endedAt;
    private final Map<String, Object> analysis;
}
