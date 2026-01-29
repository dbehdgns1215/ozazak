package com.b205.ozazak.presentation.activity.read;

import java.util.List;

public record GetUserCertificatesResponse(
        Long userId,
        List<CertificateResponseDto> certificates
) {}
