package com.b205.ozazak.presentation.auth.filter;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final TokenProviderPort tokenProviderPort;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            tokenProviderPort.parseToken(token).ifPresent(principal -> {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(principal.getRole()))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }

        filterChain.doFilter(request, response);
    }
}
