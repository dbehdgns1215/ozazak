package com.b205.ozazak.application.activity.service;

import com.b205.ozazak.application.activity.command.DeleteAwardCommand;
import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.application.activity.result.DeleteAwardResult;
import com.b205.ozazak.domain.activity.entity.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteAwardService {
    
    private final ActivityPersistencePort activityPersistencePort;

    public DeleteAwardResult execute(DeleteAwardCommand command) {
        // 1. Award 조회
        Activity award = activityPersistencePort.findById(command.awardId())
                .orElseThrow(() -> new IllegalArgumentException("Award not found: " + command.awardId()));

        // 2. 권한 확인 (accountId == award.account.id)
        if (!award.getAccount().getId().value().equals(command.accountId())) {
            throw new IllegalStateException("Unauthorized: Cannot delete other user's award");
        }

        // 3. 삭제
        activityPersistencePort.deleteById(command.awardId());

        // 4. Result 반환 (userId 반환)
        return new DeleteAwardResult(command.accountId());
    }
}
