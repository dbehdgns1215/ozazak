package com.b205.ozazak.presentation.auth.config;

import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.presentation.auth.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
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

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 1. CORS 활성화
                        .csrf(AbstractHttpConfigurer::disable)
                        .sessionManagement(session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        .authorizeHttpRequests(auth -> auth
                                        .requestMatchers("/api/auth/email/verification/**").permitAll()
                                        .requestMatchers("/api/auth/signup", "/api/auth/signin").permitAll()
                                        .requestMatchers("/api/health", "/api/image").permitAll()
                                        .requestMatchers("/api/auth/temp-password", "/api/auth/password")
                                        .permitAll()
                                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                                        .requestMatchers("/api/projects/**").authenticated()
                                        .requestMatchers("/api/recruitments/*/bookmark").authenticated()
                                        .requestMatchers("/api/recruitments/bookmark").authenticated()
                                        .requestMatchers("/api/recruitments/**").permitAll() // 그 외 공고 조회는 허용
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

                // 2. 허용할 Origin 설정
                configuration.setAllowedOrigins(List.of(
                        "http://localhost:3000",    // 로컬 프론트
                        "http://localhost:8080",    // 로컬 스웨거/백엔드
                        "https://ozazak.13.124.6.228.nip.io"  // 실제 배포 주소 (여기에 실제 도메인 입력)
                ));

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
