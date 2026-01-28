package com.b205.ozazak.presentation.activity.read;

public record CertificateResponseDto(
        Long certificateId,
        String title,
        String rankName,
        String organization,
        String awardedAt
) {}
