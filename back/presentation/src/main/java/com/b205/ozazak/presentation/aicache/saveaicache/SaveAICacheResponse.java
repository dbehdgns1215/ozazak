package com.b205.ozazak.presentation.aicache.saveaicache;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SaveAICacheResponse {
    @JsonProperty("cache_key")
    private final String cacheKey;
    @JsonProperty("ttl_seconds")
    private final Long ttlSeconds;

    public static SaveAICacheResponse from(java.util.Map<String, Object> result) {
        return SaveAICacheResponse.builder()
                .cacheKey((String) result.get("cache_key"))
                .ttlSeconds((Long) result.get("ttl_seconds"))
                .build();
    }
}
