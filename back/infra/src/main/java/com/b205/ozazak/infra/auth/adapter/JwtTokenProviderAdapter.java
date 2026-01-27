package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Component
public class JwtTokenProviderAdapter implements TokenProviderPort {

    private final SecretKey key;
    private static final String ISSUER = "ozazak";

    public JwtTokenProviderAdapter(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Optional<CustomPrincipal> parseToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(ISSUER)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Long accountId = claims.get("accountId", Long.class);
            String email = claims.getSubject();
            String role = claims.get("role", String.class);

            if (accountId == null || email == null || role == null) {
                return Optional.empty();
            }

            return Optional.of(new CustomPrincipal(accountId, email, role));
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public String generateToken(CustomPrincipal principal) {
        Date now = new Date();
        
        // 관리자는 2주일, 일반 유저는 1시간
        long expirationMs = principal.getRole().equals("ROLE_ADMIN")
                ? 14 * 24 * 60 * 60 * 1000L  // 2 weeks
                : 1 * 60 * 60 * 1000L;       // 1 hour
        
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .issuer(ISSUER)
                .subject(principal.getEmail())
                .claim("accountId", principal.getAccountId())
                .claim("role", principal.getRole())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }
}
