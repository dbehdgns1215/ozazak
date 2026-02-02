package com.b205.ozazak.infra.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class AppProperties {
    
    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;
}
