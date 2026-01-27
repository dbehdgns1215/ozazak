package com.b205.ozazak.infra.account.adapter;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountImg;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.account.vo.Password;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Slf4j
@RequiredArgsConstructor
public class AccountPersistenceAdapter implements AccountPersistencePort {

    private final AccountJpaRepository accountJpaRepository;

    @Override
    public boolean existsByEmail(String email) {
        return accountJpaRepository.existsByEmail(email);
    }

    @Override
    public Account save(Account account) {
        AccountJpaEntity jpaEntity;
        
        // Check if this is an update (existing account with ID) or create (new account)
        if (account.getId() != null) {
            // Update existing account
            jpaEntity = accountJpaRepository.findById(account.getId().value())
                    .orElseThrow(() -> new IllegalArgumentException("Account not found"));
            jpaEntity.updatePassword(account.getPassword().value());
            log.info("Updated password for account: {}", account.getEmail().value());
        } else {
            // Create new account
            jpaEntity = AccountJpaEntity.create(
                    account.getEmail().value(),
                    account.getPassword().value(),
                    account.getName().value(),
                    account.getImg().value(),
                    account.getRoleCode(),
                    null // companyId
            );
            log.info("Creating new account: {}", account.getEmail().value());
        }
        
        AccountJpaEntity savedEntity = accountJpaRepository.save(jpaEntity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Account> findByEmail(String email) {
        return accountJpaRepository.findByEmail(email)
                .map(this::toDomain);
    }

    @Override
    public Optional<Account> findById(Long accountId) {
        return accountJpaRepository.findById(accountId)
                .map(this::toDomain);
    }

    private Account toDomain(AccountJpaEntity entity) {
        return com.b205.ozazak.domain.account.entity.Account.builder()
                .id(new com.b205.ozazak.domain.account.vo.AccountId(entity.getAccountId()))
                .email(new Email(entity.getEmail()))
                .password(new Password(entity.getPassword()))
                .name(new AccountName(entity.getName()))
                .img(new AccountImg(entity.getImg()))
                .roleCode(entity.getRoleCode())
                // .company(...) // Map company if needed
                .build();
    }
}
