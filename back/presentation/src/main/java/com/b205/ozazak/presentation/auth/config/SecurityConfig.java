package com.b205.ozazak.presentation.auth.config;

import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.presentation.auth.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final TokenProviderPort tokenProviderPort;

        @Value("${SPRING_PROFILES_ACTIVE:local}")
        private String activeProfile;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                        .csrf(AbstractHttpConfigurer::disable)
                        .sessionManagement(session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        .authorizeHttpRequests(auth -> auth
                                // 1. 공통 허용 경로
                                .requestMatchers("/api/auth/email/verification/**").permitAll()
                                .requestMatchers("/api/auth/signup", "/api/auth/signin").permitAll()
                                .requestMatchers("/api/health", "/api/image").permitAll()
                                .requestMatchers("/api/auth/temp-password", "/api/auth/password").permitAll()
                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()

                                // [개발용 임시 프리패스]
                                .requestMatchers("/api/**").permitAll()
                                // 진짜 배포때 주석처리 할거임.


                                // 2. 상세 보안 설정 (위의 프리패스가 켜져 있으면 무시됨)
                                .requestMatchers("/api/projects/**").authenticated()
                                .requestMatchers("/api/recruitments/*/bookmark").authenticated()
                                .requestMatchers("/api/recruitments/bookmark").authenticated()
                                .requestMatchers("/api/recruitments/**").permitAll()

                                // 3. 최후의 방어선
                                .anyRequest().authenticated())
                        .addFilterBefore(new JwtAuthFilter(tokenProviderPort),
                                UsernamePasswordAuthenticationFilter.class)
                        .exceptionHandling(conf -> conf
                                .authenticationEntryPoint((request, response, authException) -> response
                                        .sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED,
                                                "Unauthorized")));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // 2. 프로필별 Origin 설정
                if ("local".equals(activeProfile)) {
                        // 로컬 개발 환경: localhost 명시적 허용
                        configuration.setAllowedOrigins(List.of(
                                "http://localhost:3000",     // React 개발 서버
                                "http://localhost:8080",     // Spring Boot 로컬
                                "http://127.0.0.1:3000",     // 127.0.0.1 명시적 허용
                                "http://127.0.0.1:8080"
                        ));
                } else {
                        // 프로덕션 환경: 명시적 Origin만 허용
                        configuration.setAllowedOrigins(List.of(
                                "http://ozazak.13.124.6.228.nip.io",  // nip.io HTTP
                                "https://ozazak.13.124.6.228.nip.io", // nip.io HTTPS
                                "http://13.124.6.228",                // IP 직접 HTTP
                                "https://13.124.6.228",                // IP 직접 HTTPS
                                "http://localhost:3000",
                                "https://localhost:3000"
                        ));
                }

                // 3. 허용할 HTTP 메서드
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                // 4. 허용할 헤더
                configuration.setAllowedHeaders(List.of("*"));

                // 5. 인증 정보(Cookie, Bearer Token 등) 허용
                configuration.setAllowCredentials(true);

                // 6. 브라우저가 응답 헤더에서 Authorization을 읽을 수 있도록 허용
                configuration.addExposedHeader("Authorization");

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration); // 모든 경로에 적용
                return source;
        }
}
