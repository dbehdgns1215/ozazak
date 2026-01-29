package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.activity.command.UpdateCertificateCommand;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.UpdateCertificateResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.activity.entity.Activity;
import com.b205.ozazak.domain.activity.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateCertificateService {
    
    private final ActivityPersistencePort activityPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    public UpdateCertificateResult execute(UpdateCertificateCommand command) {
        // 1. Certificate 조회
        Activity certificate = activityPersistencePort.findById(command.certificateId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found: " + command.certificateId()));

        // 2. 권한 확인 (accountId == certificate.account.id)
        if (!certificate.getAccount().getId().value().equals(command.accountId())) {
            throw new IllegalStateException("Unauthorized: Cannot update other user's certificate");
        }

        // 3. 입력값 검증
        if (command.title() == null || command.title().isBlank()) {
            throw new IllegalArgumentException("Certificate title must not be blank");
        }
        if (command.awardedAt() == null || command.awardedAt().isBlank()) {
            throw new IllegalArgumentException("Certificate date must not be blank");
        }

        // 4. VO 생성
        ActivityTitle title = new ActivityTitle(command.title().trim());
        RankName rankName = command.rankName() != null ? new RankName(command.rankName().trim()) : new RankName("");
        Organization organization = command.organization() != null ? new Organization(command.organization().trim()) : new Organization("");
        
        LocalDate awardedAt;
        try {
            awardedAt = LocalDate.parse(command.awardedAt(), DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format: " + command.awardedAt());
        }
        AwardedAt awardDate = new AwardedAt(awardedAt);

        // 5. Activity 업데이트
        Activity updatedCertificate = certificate.update(title, rankName, organization, awardDate);
        activityPersistencePort.save(updatedCertificate);

        // 6. Result 반환
        return new UpdateCertificateResult(command.accountId());
    }
}
