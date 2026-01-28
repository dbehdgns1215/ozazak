package com.b205.ozazak.infra.image.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@RequiredArgsConstructor
public class S3Config {

    @Bean
    public S3Client s3Client() {
        // Strict security: DefaultCredentialsProvider only.
        // Region is automatically loaded from AWS_REGION env var or ~/.aws/config
        // Credentials from AWS_ACCESS_KEY_ID/SECRET env vars or ~/.aws/credentials or IAM Role
        return S3Client.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.of(System.getenv("AWS_REGION"))) // Explicitly allow env var for region
                .build();
    }
}
