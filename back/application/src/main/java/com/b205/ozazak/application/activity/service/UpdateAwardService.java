package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.activity.command.UpdateAwardCommand;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.UpdateAwardResult;
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
public class UpdateAwardService {
    
    private final ActivityPersistencePort activityPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    public UpdateAwardResult execute(UpdateAwardCommand command) {
        // 1. Award 조회
        Activity award = activityPersistencePort.findById(command.awardId())
                .orElseThrow(() -> new IllegalArgumentException("Award not found: " + command.awardId()));

        // 2. 권한 확인 (accountId == award.account.id)
        if (!award.getAccount().getId().value().equals(command.accountId())) {
            throw new IllegalStateException("Unauthorized: Cannot update other user's award");
        }

        // 3. 입력값 검증
        if (command.title() == null || command.title().isBlank()) {
            throw new IllegalArgumentException("Award title must not be blank");
        }
        if (command.awardedAt() == null || command.awardedAt().isBlank()) {
            throw new IllegalArgumentException("Award date must not be blank");
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

        // 5. Domain entity 업데이트 (immutable pattern)
        Activity updatedAward = award.update(title, rankName, organization, awardDate);

        // 6. 저장
        activityPersistencePort.save(updatedAward);

        // 7. Result 반환 (userId 반환)
        return new UpdateAwardResult(command.accountId());
    }
}
