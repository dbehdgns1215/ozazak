package com.b205.ozazak.application.activity.result;

import java.util.List;

public record GetUserCertificatesResult(
        Long userId,
        List<CertificateDataDto> certificates
) {
    public record CertificateDataDto(
            Long certificateId,
            String title,
            String rankName,
            String organization,
            String awardedAt
    ) {}
}
