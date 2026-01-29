package com.b205.ozazak.application.aicache.service;

import com.b205.ozazak.application.aicache.command.GetAnalysisCacheCommand;
import com.b205.ozazak.application.aicache.port.in.GetAnalysisCacheUseCase;
import com.b205.ozazak.application.aicache.port.out.LoadAnalysisCachePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetAnalysisCacheService implements GetAnalysisCacheUseCase {

    private final LoadAnalysisCachePort loadAnalysisCachePort;

    @Override
    public Map<String, Object> getAnalysisCache(GetAnalysisCacheCommand command) {
        String key = generateCacheKey(command.getCompanyName(), command.getPosition(), command.getJobPosting());
        Optional<Map<String, Object>> cached = loadAnalysisCachePort.findByKey(key);

        Map<String, Object> result = new HashMap<>();
        if (cached.isPresent()) {
            result.put("cached", true);
            result.put("analysis", cached.get());
        } else {
            result.put("cached", false);
            result.put("analysis", null);
        }
        return result;
    }

    private String generateCacheKey(String companyName, String position, String jobPosting) {
        String rawKey = (companyName.trim() + position.trim() + jobPosting.trim());
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
