package com.b205.ozazak.application.aicache.port.in;

import com.b205.ozazak.application.aicache.command.SaveAnalysisCacheCommand;
import java.util.Map;

public interface SaveAnalysisCacheUseCase {
    Map<String, Object> saveAnalysisCache(SaveAnalysisCacheCommand command);
}
