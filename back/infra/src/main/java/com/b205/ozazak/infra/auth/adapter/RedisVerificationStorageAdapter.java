package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.port.out.VerificationStoragePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisVerificationStorageAdapter implements VerificationStoragePort {

    private final StringRedisTemplate redisTemplate;

    private static final String CODE_PREFIX = "auth:email:code:";
    private static final String COOLDOWN_PREFIX = "auth:email:cooldown:";
    private static final String ATTEMPTS_PREFIX = "auth:email:attempts:";
    private static final String VERIFIED_PREFIX = "auth:email:verified:";

    @Override
    public void saveCode(String emailHash, String code, long ttlMinutes) {
        String key = CODE_PREFIX + emailHash;
        redisTemplate.opsForValue().set(key, code, ttlMinutes, TimeUnit.MINUTES);
        log.debug("✅ Redis: 인증 코드 저장 - Key: {}, TTL: {}분", key, ttlMinutes);
    }

    @Override
    public Optional<String> getCode(String emailHash) {
        String key = CODE_PREFIX + emailHash;
        Optional<String> result = Optional.ofNullable(redisTemplate.opsForValue().get(key));
        if (result.isPresent()) {
            log.debug("✅ Redis: 인증 코드 조회 성공 - Key: {}", key);
        } else {
            log.warn("❌ Redis: 인증 코드 조회 실패 - Key: {} (만료되었거나 존재하지 않음)", key);
        }
        return result;
    }

    @Override
    public void deleteCode(String emailHash) {
        String key = CODE_PREFIX + emailHash;
        redisTemplate.delete(key);
        log.debug("✅ Redis: 인증 코드 삭제 - Key: {}", key);
    }

    @Override
    public void saveCooldown(String emailHash, long ttlSeconds) {
        String key = COOLDOWN_PREFIX + emailHash;
        redisTemplate.opsForValue().set(key, "blocked", ttlSeconds, TimeUnit.SECONDS);
        log.debug("✅ Redis: 쿨다운 저장 - Key: {}, TTL: {}초", key, ttlSeconds);
    }

    @Override
    public boolean hasCooldown(String emailHash) {
        String key = COOLDOWN_PREFIX + emailHash;
        boolean exists = Boolean.TRUE.equals(redisTemplate.hasKey(key));
        if (exists) {
            log.warn("⏳ Redis: 쿨다운 진행 중 - Key: {}", key);
        }
        return exists;
    }

    @Override
    public long incrementAttempts(String emailHash, long ttlMinutes) {
        String key = ATTEMPTS_PREFIX + emailHash;
        Long attempts = redisTemplate.opsForValue().increment(key);
        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, ttlMinutes, TimeUnit.MINUTES);
        }
        log.debug("✅ Redis: 시도 횟수 증가 - Key: {}, 횟수: {}", key, attempts);
        return attempts != null ? attempts : 0;
    }

    @Override
    public void deleteAttempts(String emailHash) {
        String key = ATTEMPTS_PREFIX + emailHash;
        redisTemplate.delete(key);
        log.debug("✅ Redis: 시도 횟수 초기화 - Key: {}", key);
    }

    @Override
    public void saveVerifiedToken(String emailHash, String token, long ttlMinutes) {
        String key = VERIFIED_PREFIX + emailHash;
        redisTemplate.opsForValue().set(key, token, ttlMinutes, TimeUnit.MINUTES);
        log.debug("✅ Redis: 검증 토큰 저장 - Key: {}, TTL: {}분", key, ttlMinutes);
    }

    @Override
    public Optional<String> getVerifiedToken(String emailHash) {
        String key = VERIFIED_PREFIX + emailHash;
        Optional<String> result = Optional.ofNullable(redisTemplate.opsForValue().get(key));
        if (result.isPresent()) {
            log.debug("✅ Redis: 검증 토큰 조회 성공 - Key: {}", key);
        } else {
            log.warn("❌ Redis: 검증 토큰 조회 실패 - Key: {} (만료되었거나 존재하지 않음)", key);
        }
        return result;
    }

    @Override
    public void deleteVerifiedToken(String emailHash) {
        String key = VERIFIED_PREFIX + emailHash;
        redisTemplate.delete(key);
        log.debug("✅ Redis: 검증 토큰 삭제 - Key: {}", key);
    }
}

