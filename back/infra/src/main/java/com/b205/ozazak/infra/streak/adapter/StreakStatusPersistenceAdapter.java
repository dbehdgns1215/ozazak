package com.b205.ozazak.infra.streak.adapter;

import com.b205.ozazak.application.streak.port.out.StreakStatusPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.account.vo.AccountImg;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.streak.entity.StreakStatus;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.streak.entity.StreakStatusJpaEntity;
import com.b205.ozazak.infra.streak.repository.StreakStatusJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class StreakStatusPersistenceAdapter implements StreakStatusPersistencePort {

    private final StreakStatusJpaRepository streakStatusJpaRepository;
    private final AccountJpaRepository accountJpaRepository;

    @Override
    public StreakStatus save(StreakStatus streakStatus) {
        // Get Account from repository
        AccountJpaEntity accountJpaEntity = accountJpaRepository.findById(streakStatus.getAccount().getId().value())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Domain -> JPA 변환 및 저장
        StreakStatusJpaEntity streakStatusJpaEntity = streakStatusJpaRepository.findById(accountJpaEntity.getAccountId())
                .map(entity -> {
                    entity.updateStatus(
                            streakStatus.getCurrentStreak(),
                            streakStatus.getLongestStreak(),
                            streakStatus.getLastActivityDate()
                    );
                    return entity;
                })
                .orElseGet(() -> convertToJpaEntity(streakStatus, accountJpaEntity));

        StreakStatusJpaEntity savedEntity = streakStatusJpaRepository.save(streakStatusJpaEntity);

        log.info("Saved streak status for account: {}", streakStatus.getAccount().getEmail().value());

        // JPA -> Domain 변환
        return convertToStreakStatus(savedEntity);
    }

    @Override
    public StreakStatus findByAccountId(Long accountId) {
        return streakStatusJpaRepository.findById(accountId)
                .map(this::convertToStreakStatus)
                .orElse(null);
    }

    // ========== JPA → Domain 변환 ==========
    private Account convertToAccount(AccountJpaEntity accountJpaEntity) {
        return Account.builder()
                .id(new AccountId(accountJpaEntity.getAccountId()))
                .email(new Email(accountJpaEntity.getEmail()))
                .name(new AccountName(accountJpaEntity.getName()))
                .img(new AccountImg(accountJpaEntity.getImg()))
                .roleCode(accountJpaEntity.getRoleCode())
                .build();
    }

    private StreakStatus convertToStreakStatus(StreakStatusJpaEntity jpaEntity) {
        Account account = convertToAccount(jpaEntity.getAccount());
        return StreakStatus.builder()
                .account(account)
                .currentStreak(jpaEntity.getCurrentStreak())
                .longestStreak(jpaEntity.getLongestStreak())
                .lastActivityDate(jpaEntity.getLastActivityDate())
                .build();
    }

    // ========== Domain → JPA 변환 ==========
    private StreakStatusJpaEntity convertToJpaEntity(StreakStatus domain, AccountJpaEntity accountJpaEntity) {
        return StreakStatusJpaEntity.create(
                accountJpaEntity,
                domain.getCurrentStreak(),
                domain.getLongestStreak(),
                domain.getLastActivityDate()
        );
    }
}
