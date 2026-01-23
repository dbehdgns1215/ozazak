package com.b205.ozazak.infra.auth.adapter;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderAdapterTest {

    private final String secret = "at-least-32-chars-secret-key-for-ozazak-project";
    private JwtTokenProviderAdapter jwtTokenProviderAdapter;
    private SecretKey key;

    @BeforeEach
    void setUp() {
        jwtTokenProviderAdapter = new JwtTokenProviderAdapter(secret);
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    @DisplayName("Successfully parse valid token")
    void parseToken_Success() {
        // given
        String token = Jwts.builder()
                .issuer("ozazak")
                .subject("test@example.com")
                .claim("accountId", 1L)
                .claim("role", "ROLE_USER")
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60))
                .signWith(key)
                .compact();

        // when
        Optional<CustomPrincipal> result = jwtTokenProviderAdapter.parseToken(token);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("test@example.com");
        assertThat(result.get().getAccountId()).isEqualTo(1L);
        assertThat(result.get().getRole()).isEqualTo("ROLE_USER");
    }

    @Test
    @DisplayName("Fail to parse expired token")
    void parseToken_Expired() {
        // given
        String token = Jwts.builder()
                .subject("test@example.com")
                .claim("accountId", 1L)
                .claim("role", "ROLE_USER")
                .expiration(new Date(System.currentTimeMillis() - 1000 * 60))
                .signWith(key)
                .compact();

        // when
        Optional<CustomPrincipal> result = jwtTokenProviderAdapter.parseToken(token);

        // then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Fail to parse token with invalid signature")
    void parseToken_InvalidSignature() {
        // given
        SecretKey invalidKey = Keys.hmacShaKeyFor("different-secret-key-different-secret-key".getBytes(StandardCharsets.UTF_8));
        String token = Jwts.builder()
                .subject("test@example.com")
                .signWith(invalidKey)
                .compact();

        // when
        Optional<CustomPrincipal> result = jwtTokenProviderAdapter.parseToken(token);

        // then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Fail to parse token with invalid issuer")
    void parseToken_InvalidIssuer() {
        // given
        String token = Jwts.builder()
                .issuer("wrong-issuer")
                .subject("test@example.com")
                .signWith(key)
                .compact();

        // when
        Optional<CustomPrincipal> result = jwtTokenProviderAdapter.parseToken(token);

        // then
        assertThat(result).isEmpty();
    }
}
