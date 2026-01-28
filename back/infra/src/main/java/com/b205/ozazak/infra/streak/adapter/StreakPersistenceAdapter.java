package com.b205.ozazak.infra.streak.adapter;

import com.b205.ozazak.application.streak.port.out.StreakPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.account.vo.AccountImg;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.streak.entity.Streak;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.streak.entity.StreakJpaEntity;
import com.b205.ozazak.infra.streak.repository.StreakJpaRepository;
import com.b205.ozazak.infra.streak.repository.StreakStatusJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class StreakPersistenceAdapter implements StreakPersistencePort {

    private final StreakJpaRepository streakJpaRepository;
    private final StreakStatusJpaRepository streakStatusJpaRepository;
    private final AccountJpaRepository accountJpaRepository;

    @Override
    public Streak save(Streak streak) {
        // Get Account from repository
        AccountJpaEntity accountJpaEntity = accountJpaRepository.findById(streak.getAccount().getId().value())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // 기존 기록이 있는지 확인
        StreakJpaEntity streakJpaEntity = streakJpaRepository.findByAccountIdAndActivityDate(
                accountJpaEntity.getAccountId(),
                streak.getActivityDate()
        ).map(existing -> {
            // UPDATE: 기존 기록의 dailyCount만 업데이트
            existing.updateDailyCount(streak.getDailyCount());
            return existing;
        }).orElseGet(() -> {
            // INSERT: 새 기록 생성
            return StreakJpaEntity.create(
                    accountJpaEntity,
                    streak.getActivityDate(),
                    streak.getDailyCount()
            );
        });

        StreakJpaEntity savedEntity = streakJpaRepository.save(streakJpaEntity);

        log.info("Saved streak record for account: {} on date: {}", 
                streak.getAccount().getEmail().value(), 
                streak.getActivityDate());

        // Convert back to domain
        return Streak.builder()
                .account(streak.getAccount())
                .activityDate(savedEntity.getActivityDate())
                .dailyCount(savedEntity.getDailyCount())
                .createdAt(savedEntity.getCreatedAt())
                .build();
    }

    @Override
    public Streak findByAccountIdAndActivityDate(Long accountId, LocalDate activityDate) {
        return streakJpaRepository.findByAccountIdAndActivityDate(accountId, activityDate)
                .map(entity -> {
                    Account account = convertToAccount(entity.getAccount());
                    return Streak.builder()
                            .account(account)
                            .activityDate(entity.getActivityDate())
                            .dailyCount(entity.getDailyCount())
                            .createdAt(entity.getCreatedAt())
                            .build();
                })
                .orElse(null);
    }

    @Override
    public LocalDate findLastActivityDateByAccountId(Long accountId) {
        return streakJpaRepository.findLastActivityDateByAccountId(accountId)
                .orElse(null);
    }

    @Override
    public List<Long> findAllActiveAccountsOn(LocalDate date) {
        return streakJpaRepository.findAllActiveAccountsOn(date);
    }

    @Override
    public boolean existsByAccountIdAndActivityDate(Long accountId, LocalDate activityDate) {
        return streakJpaRepository.existsByAccountIdAndActivityDate(accountId, activityDate);
    }

    @Override
    public List<Long> findAllAccountsWithStreakStatus() {
        return streakStatusJpaRepository.findAllAccountIds();
    }

    // ========== 변환 메서드 ==========
    private Account convertToAccount(AccountJpaEntity accountJpaEntity) {
        return Account.builder()
                .id(new AccountId(accountJpaEntity.getAccountId()))
                .email(new Email(accountJpaEntity.getEmail()))
                .name(new AccountName(accountJpaEntity.getName()))
                .img(new AccountImg(accountJpaEntity.getImg()))
                .roleCode(accountJpaEntity.getRoleCode())
                .build();
    }
}


