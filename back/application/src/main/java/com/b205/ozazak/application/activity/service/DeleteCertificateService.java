package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.activity.command.DeleteCertificateCommand;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.DeleteCertificateResult;
import com.b205.ozazak.domain.activity.entity.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteCertificateService {
    
    private final ActivityPersistencePort activityPersistencePort;

    public DeleteCertificateResult execute(DeleteCertificateCommand command) {
        // 1. Certificate 조회
        Activity certificate = activityPersistencePort.findById(command.certificateId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found: " + command.certificateId()));

        // 2. 권한 확인 (accountId == certificate.account.id)
        if (!certificate.getAccount().getId().value().equals(command.accountId())) {
            throw new IllegalStateException("Unauthorized: Cannot delete other user's certificate");
        }

        // 3. 삭제
        activityPersistencePort.deleteById(command.certificateId());

        // 4. Result 반환 (userId 반환)
        return new DeleteCertificateResult(command.accountId());
    }
}
