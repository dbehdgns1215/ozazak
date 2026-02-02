package com.b205.ozazak.application.aicache.port.out;

import java.util.Map;
import java.util.Optional;

public interface LoadAnalysisCachePort {
    Optional<Map<String, Object>> findByKey(String key);
}
