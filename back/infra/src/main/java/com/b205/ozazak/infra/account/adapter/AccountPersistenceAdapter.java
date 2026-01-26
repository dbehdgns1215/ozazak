package com.b205.ozazak.infra.account.adapter;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.domain.account.vo.AccountImg;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.account.vo.Password;
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
    public com.b205.ozazak.domain.account.entity.Account save(com.b205.ozazak.domain.account.entity.Account account) {
        AccountJpaEntity jpaEntity = AccountJpaEntity.create(
                account.getEmail().value(),
                account.getPassword().value(),
                account.getName().value(),
                account.getImg().value(),
                account.getRoleCode(),
                null // companyId
        );
        AccountJpaEntity savedEntity = accountJpaRepository.save(jpaEntity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<com.b205.ozazak.domain.account.entity.Account> findByEmail(String email) {
        return accountJpaRepository.findByEmail(email)
                .map(this::toDomain);
    }

    private com.b205.ozazak.domain.account.entity.Account toDomain(AccountJpaEntity entity) {
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
