package com.b205.ozazak.application.aicache.port.out;

import java.time.Duration;
import java.util.Map;

public interface SaveAnalysisCachePort {
    void save(String key, Map<String, Object> analysis, Duration ttl);
}
