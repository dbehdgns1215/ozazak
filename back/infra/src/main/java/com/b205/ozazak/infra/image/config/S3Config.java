package com.b205.ozazak.infra.image.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@RequiredArgsConstructor
public class S3Config {

    @Value("${aws.s3.region:}")
    private String regionFromProperties;

    @Bean
    public S3Client s3Client() {
        String region = null;

        if (regionFromProperties != null && !regionFromProperties.isEmpty()) {
            region = regionFromProperties;
        }

        else {
            region = System.getenv("AWS_REGION");
        }

        if (region == null || region.isEmpty()) {
            region = "ap-northeast-2";
        }
        
        return S3Client.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.of(region))
                .build();
    }
}
