package com.b205.ozazak.infra.comment.adapter;

import com.b205.ozazak.application.comment.port.out.CommentRateLimitPort;
import com.b205.ozazak.application.community.exception.CommunityErrorCode;
import com.b205.ozazak.application.community.exception.CommunityException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RedisCommentRateLimitAdapter implements CommentRateLimitPort {

    private final StringRedisTemplate redisTemplate;

    private static final int LIMIT_COUNT = 5;
    private static final int WINDOW_SECONDS = 30;

    @Override
    public void checkAndIncrementCount(Long accountId) {
        String key = "rate_limit:comment:" + accountId;
        ValueOperations<String, String> ops = redisTemplate.opsForValue();

        Long count = ops.increment(key);

        if (count != null && count == 1) {
            redisTemplate.expire(key, Duration.ofSeconds(WINDOW_SECONDS));
        }

        if (count != null && count > LIMIT_COUNT) {
            Long ttl = redisTemplate.getExpire(key);
            long remainingSeconds = ttl != null && ttl > 0 ? ttl : WINDOW_SECONDS;
            String message = String.format("도배 방지: %d초 뒤에 다시 시도해주세요.", remainingSeconds);
            
            java.util.Map<String, Object> payload = java.util.Map.of("ttl", remainingSeconds);
            throw new CommunityException(CommunityErrorCode.COMMENT_FLOODING_DETECTED, message, payload);
        }
    }
}
