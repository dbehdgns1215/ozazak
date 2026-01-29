package com.b205.ozazak.presentation.aicache.getaicache;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class GetAICacheResponse {
    private final boolean cached;
    private final Map<String, Object> analysis;

    public static GetAICacheResponse from(Map<String, Object> result) {
        return GetAICacheResponse.builder()
                .cached((Boolean) result.getOrDefault("cached", false))
                .analysis((Map<String, Object>) result.get("analysis"))
                .build();
    }
}
