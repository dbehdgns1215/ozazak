package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.activity.command.CreateCertificateCommand;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.CreateCertificateResult;
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
public class CreateCertificateService {
    
    private final ActivityPersistencePort activityPersistencePort;
    private final AccountPersistencePort accountPersistencePort;
    private static final int CERTIFICATE_CODE = 2;

    public CreateCertificateResult execute(CreateCertificateCommand command) {
        // 1. Account 조회
        Account account = accountPersistencePort.findById(command.accountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + command.accountId()));

        // 2. 입력값 검증
        if (command.title() == null || command.title().isBlank()) {
            throw new IllegalArgumentException("Certificate title must not be blank");
        }
        if (command.awardedAt() == null || command.awardedAt().isBlank()) {
            throw new IllegalArgumentException("Certificate date must not be blank");
        }

        // 3. VO 생성
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
        ActivityCode code = new ActivityCode(CERTIFICATE_CODE);

        // 4. Activity 생성 및 저장
        Activity certificate = Activity.builder()
                .account(account)
                .title(title)
                .code(code)
                .rankName(rankName)
                .organization(organization)
                .awardedAt(awardDate)
                .build();

        activityPersistencePort.save(certificate);

        // 5. Result 반환
        return new CreateCertificateResult(account.getId().value());
    }
}
