package com.b205.ozazak.infra.activity.adapter;

import com.b205.ozazak.application.activity.port.ActivityPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.activity.entity.Activity;
import com.b205.ozazak.domain.activity.vo.*;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.activity.entity.ActivityJpaEntity;
import com.b205.ozazak.infra.activity.mapper.ActivityMapper;
import com.b205.ozazak.infra.activity.repository.ActivityJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ActivityPersistenceAdapter implements ActivityPersistencePort {

    private final ActivityJpaRepository activityJpaRepository;
    private final AccountJpaRepository accountJpaRepository;
    private final ActivityMapper activityMapper;

    @Override
    public Activity save(Activity activity) {
        AccountJpaEntity accountJpaEntity = accountJpaRepository.findById(activity.getAccount().getId().value())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        ActivityJpaEntity jpaEntity = activityMapper.toJpa(activity, accountJpaEntity);
        ActivityJpaEntity savedEntity = activityJpaRepository.save(jpaEntity);
        
        return activityMapper.toDomain(savedEntity, activity.getAccount());
    }

    @Override
    public Optional<Activity> findById(Long activityId) {
        return activityJpaRepository.findById(activityId)
                .map(entity -> {
                    Account account = Account.builder()
                            .id(new com.b205.ozazak.domain.account.vo.AccountId(entity.getAccount().getAccountId()))
                            .build();
                    return activityMapper.toDomain(entity, account);
                });
    }

    @Override
    public List<Activity> findByAccountIdAndCode(Long accountId, Integer code) {
        List<ActivityJpaEntity> entities = activityJpaRepository.findByAccount_AccountIdAndCodeOrderByAwardedAtDesc(accountId, code);
        return entities.stream()
                .map(entity -> {
                    Account account = Account.builder()
                            .id(new com.b205.ozazak.domain.account.vo.AccountId(entity.getAccount().getAccountId()))
                            .build();
                    return activityMapper.toDomain(entity, account);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long activityId) {
        activityJpaRepository.deleteById(activityId);
    }
}
