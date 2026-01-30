package com.b205.ozazak.application.aicache.service;

import com.b205.ozazak.application.aicache.command.SaveAnalysisCacheCommand;
import com.b205.ozazak.application.aicache.port.in.SaveAnalysisCacheUseCase;
import com.b205.ozazak.application.aicache.port.out.SaveAnalysisCachePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SaveAnalysisCacheService implements SaveAnalysisCacheUseCase {

    private final SaveAnalysisCachePort saveAnalysisCachePort;

    @Override
    public Map<String, Object> saveAnalysisCache(SaveAnalysisCacheCommand command) {
        String key = generateCacheKey(command.getCompanyName(), command.getRecruitmentTitle(), command.getRecruitmentContent());

        long ttlSeconds = 604800; // 기본 7일

        // 시작일, 마감일 null 이면 상시 채용
        if (command.getStartedAt() == null && command.getEndedAt() == null) {
            ttlSeconds = 1209600; // 상시 채용: 14일
        } else if (command.getEndedAt() != null) {
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            java.time.LocalDateTime deadlineEnd = command.getEndedAt().atTime(23, 59, 59);
            long secondsUntilDeadline = java.time.temporal.ChronoUnit.SECONDS.between(now, deadlineEnd);

            if (secondsUntilDeadline > 0) {
                ttlSeconds = secondsUntilDeadline;
            }
        }

        saveAnalysisCachePort.save(key, command.getAnalysis(), Duration.ofSeconds(ttlSeconds));

        Map<String, Object> result = new HashMap<>();
        result.put("cache_key", key);
        result.put("ttl_seconds", ttlSeconds);
        return result;
    }

    private String generateCacheKey(String companyName, String recruitmentTitle, String recruitmentContent) {
        String rawKey = (companyName.trim() + recruitmentTitle.trim() + recruitmentContent.trim());
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(rawKey.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return "job_analysis:" + sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }
}
