package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.port.out.VerificationStoragePort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedisVerificationStorageAdapter implements VerificationStoragePort {

    private final StringRedisTemplate redisTemplate;

    private static final String CODE_PREFIX = "auth:email:code:";
    private static final String COOLDOWN_PREFIX = "auth:email:cooldown:";
    private static final String ATTEMPTS_PREFIX = "auth:email:attempts:";
    private static final String VERIFIED_PREFIX = "auth:email:verified:";

    @Override
    public void saveCode(String emailHash, String code, long ttlMinutes) {
        redisTemplate.opsForValue().set(CODE_PREFIX + emailHash, code, ttlMinutes, TimeUnit.MINUTES);
    }

    @Override
    public Optional<String> getCode(String emailHash) {
        return Optional.ofNullable(redisTemplate.opsForValue().get(CODE_PREFIX + emailHash));
    }

    @Override
    public void deleteCode(String emailHash) {
        redisTemplate.delete(CODE_PREFIX + emailHash);
    }

    @Override
    public void saveCooldown(String emailHash, long ttlSeconds) {
        redisTemplate.opsForValue().set(COOLDOWN_PREFIX + emailHash, "blocked", ttlSeconds, TimeUnit.SECONDS);
    }

    @Override
    public boolean hasCooldown(String emailHash) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(COOLDOWN_PREFIX + emailHash));
    }

    @Override
    public long incrementAttempts(String emailHash, long ttlMinutes) {
        String key = ATTEMPTS_PREFIX + emailHash;
        Long attempts = redisTemplate.opsForValue().increment(key);
        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, ttlMinutes, TimeUnit.MINUTES);
        }
        return attempts != null ? attempts : 0;
    }

    @Override
    public void deleteAttempts(String emailHash) {
        redisTemplate.delete(ATTEMPTS_PREFIX + emailHash);
    }

    @Override
    public void saveVerifiedToken(String emailHash, String token, long ttlMinutes) {
        redisTemplate.opsForValue().set(VERIFIED_PREFIX + emailHash, token, ttlMinutes, TimeUnit.MINUTES);
    }

    @Override
    public Optional<String> getVerifiedToken(String emailHash) {
        return Optional.ofNullable(redisTemplate.opsForValue().get(VERIFIED_PREFIX + emailHash));
    }

    @Override
    public void deleteVerifiedToken(String emailHash) {
        redisTemplate.delete(VERIFIED_PREFIX + emailHash);
    }
}
