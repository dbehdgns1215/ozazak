package com.b205.ozazak.infra.aicache.adapter;

import com.b205.ozazak.application.aicache.port.out.LoadAnalysisCachePort;
import com.b205.ozazak.application.aicache.port.out.SaveAnalysisCachePort;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisAICacheAdapter implements SaveAnalysisCachePort, LoadAnalysisCachePort {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void save(String key, Map<String, Object> analysis, Duration ttl) {
        try {
            String analysisJson = objectMapper.writeValueAsString(analysis);
            redisTemplate.opsForValue().set(key, analysisJson, ttl);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize analysis cache", e);
            throw new RuntimeException("Failed to serialize analysis cache", e);
        }
    }

    @Override
    public Optional<Map<String, Object>> findByKey(String key) {
        String value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            return Optional.empty();
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = objectMapper.readValue(value, Map.class);
            return Optional.of(map);
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize analysis cache", e);
            return Optional.empty();
        }
    }
}
