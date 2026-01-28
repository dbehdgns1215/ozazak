package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.GetUserCertificatesResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.activity.entity.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetUserCertificatesService {
    
    private final ActivityPersistencePort activityPersistencePort;
    private final AccountPersistencePort accountPersistencePort;
    private static final int CERTIFICATE_CODE = 2;

    public GetUserCertificatesResult execute(Long userId) {
        // 1. Account 존재 확인
        Account account = accountPersistencePort.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + userId));

        // 2. 사용자의 자격증 목록 조회 (code=2 필터)
        List<Activity> certificates = activityPersistencePort.findByAccountIdAndCode(userId, CERTIFICATE_CODE);

        // 3. Activity -> CertificateDataDto 변환
        List<GetUserCertificatesResult.CertificateDataDto> certificateDtos = certificates.stream()
                .map(certificate -> new GetUserCertificatesResult.CertificateDataDto(
                        certificate.getId().value(),
                        certificate.getTitle().value(),
                        certificate.getRankName().value(),
                        certificate.getOrganization().value(),
                        certificate.getAwardedAt().value().toString()
                ))
                .collect(Collectors.toList());

        // 4. Result 반환
        return new GetUserCertificatesResult(userId, certificateDtos);
    }
}
