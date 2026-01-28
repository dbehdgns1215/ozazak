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

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final TokenProviderPort tokenProviderPort;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/email/verification/**").permitAll()
                                                .requestMatchers("/api/auth/signup", "/api/auth/signin").permitAll()
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
}
