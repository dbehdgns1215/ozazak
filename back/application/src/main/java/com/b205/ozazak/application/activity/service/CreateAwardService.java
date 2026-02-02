package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.activity.command.CreateAwardCommand;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.CreateAwardResult;
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
public class CreateAwardService {
    
    private final ActivityPersistencePort activityPersistencePort;
    private final AccountPersistencePort accountPersistencePort;
    private static final int AWARD_CODE = 1;

    public CreateAwardResult execute(CreateAwardCommand command) {
        // 1. Account 조회
        Account account = accountPersistencePort.findById(command.accountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + command.accountId()));

        // 2. 입력값 검증
        if (command.title() == null || command.title().isBlank()) {
            throw new IllegalArgumentException("Award title must not be blank");
        }
        if (command.awardedAt() == null || command.awardedAt().isBlank()) {
            throw new IllegalArgumentException("Award date must not be blank");
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
        ActivityCode code = new ActivityCode(AWARD_CODE);

        // 4. Domain entity 생성
        Activity activity = Activity.builder()
                .account(account)
                .title(title)
                .code(code)
                .rankName(rankName)
                .organization(organization)
                .awardedAt(awardDate)
                .build();

        // 5. 저장
        Activity savedActivity = activityPersistencePort.save(activity);

        // 6. Result 반환 (userId 반환)
        return new CreateAwardResult(account.getId().value());
    }
}
