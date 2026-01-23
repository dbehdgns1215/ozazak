package com.b205.ozazak.infra.account.adapter;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AccountPersistenceAdapter implements AccountPersistencePort {

    private final AccountJpaRepository accountJpaRepository;

    @Override
    public boolean existsByEmail(String email) {
        return accountJpaRepository.existsByEmail(email);
    }

    @Override
    public void save(AccountJpaEntity account) {
        accountJpaRepository.save(account);
    }

    @Override
    public Optional<AccountJpaEntity> findByEmail(String email) {
        return accountJpaRepository.findByEmail(email);
    }
}
