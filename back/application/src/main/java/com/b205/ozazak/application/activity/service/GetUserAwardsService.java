package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.GetUserAwardsResult;
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
public class GetUserAwardsService {
    
    private final ActivityPersistencePort activityPersistencePort;
    private final AccountPersistencePort accountPersistencePort;
    private static final int AWARD_CODE = 1;

    public GetUserAwardsResult execute(Long userId) {
        // 1. Account 존재 확인
        Account account = accountPersistencePort.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + userId));

        // 2. 사용자의 수상 목록 조회 (code=1 필터)
        List<Activity> awards = activityPersistencePort.findByAccountIdAndCode(userId, AWARD_CODE);

        // 3. Activity -> AwardDataDto 변환
        List<GetUserAwardsResult.AwardDataDto> awardDtos = awards.stream()
                .map(award -> new GetUserAwardsResult.AwardDataDto(
                        award.getId().value(),
                        award.getTitle().value(),
                        award.getRankName().value(),
                        award.getOrganization().value(),
                        award.getAwardedAt().value().toString()
                ))
                .collect(Collectors.toList());

        // 4. Result 반환
        return new GetUserAwardsResult(userId, awardDtos);
    }
}
