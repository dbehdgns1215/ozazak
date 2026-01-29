package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.port.out.PasswordResetStoragePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisPasswordResetStorageAdapter implements PasswordResetStoragePort {

    private final RedisTemplate<String, String> redisTemplate;
    private static final long PASSWORD_RESET_TOKEN_TTL = 10; // 10 minutes
    private static final String PASSWORD_RESET_TOKEN_PREFIX = "auth:password:reset:";
    private static final String PASSWORD_RESET_COOLDOWN_PREFIX = "auth:password:reset:cooldown:";

    @Override
    public void storeResetToken(String email, String token) {
        String normalizedEmail = email.trim().toLowerCase();
        String key = PASSWORD_RESET_TOKEN_PREFIX + hashEmail(normalizedEmail);
        redisTemplate.opsForValue().set(key, token, PASSWORD_RESET_TOKEN_TTL, TimeUnit.MINUTES);
        log.info("Password reset token stored for email: {}", normalizedEmail);
    }

    @Override
    public boolean verifyResetToken(String email, String token) {
        String normalizedEmail = email.trim().toLowerCase();
        String key = PASSWORD_RESET_TOKEN_PREFIX + hashEmail(normalizedEmail);
        String storedToken = redisTemplate.opsForValue().get(key);
        boolean isValid = token.equals(storedToken);
        log.info("Password reset token verification - Email: {}, Valid: {}", normalizedEmail, isValid);
        return isValid;
    }

    @Override
    public void deleteResetToken(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        String key = PASSWORD_RESET_TOKEN_PREFIX + hashEmail(normalizedEmail);
        redisTemplate.delete(key);
        log.info("Password reset token deleted for email: {}", normalizedEmail);
    }

    @Override
    public boolean hasCooldown(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        String key = PASSWORD_RESET_COOLDOWN_PREFIX + hashEmail(normalizedEmail);
        Boolean exists = redisTemplate.hasKey(key);
        log.debug("Password reset cooldown check - Email: {}, Has cooldown: {}", normalizedEmail, exists);
        return exists != null && exists;
    }

    @Override
    public void saveCooldown(String email, int seconds) {
        String normalizedEmail = email.trim().toLowerCase();
        String key = PASSWORD_RESET_COOLDOWN_PREFIX + hashEmail(normalizedEmail);
        redisTemplate.opsForValue().set(key, "1", seconds, TimeUnit.SECONDS);
        log.info("Password reset cooldown saved for email: {} ({}s)", normalizedEmail, seconds);
    }

    private String hashEmail(String email) {
        return Integer.toHexString(email.toLowerCase().hashCode());
    }
}
