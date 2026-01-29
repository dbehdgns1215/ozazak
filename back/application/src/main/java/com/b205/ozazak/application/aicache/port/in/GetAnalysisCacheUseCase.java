package com.b205.ozazak.application.aicache.port.in;

import com.b205.ozazak.application.aicache.command.GetAnalysisCacheCommand;
import java.util.Map;

public interface GetAnalysisCacheUseCase {
    Map<String, Object> getAnalysisCache(GetAnalysisCacheCommand command);
}
