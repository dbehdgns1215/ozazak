package com.b205.ozazak.infra.account.repository;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountJpaRepository extends JpaRepository<AccountJpaEntity, Long> {
    boolean existsByEmail(String email);
    Optional<AccountJpaEntity> findByEmail(String email);

    Optional<AccountJpaEntity> findById(Long accountId);
}
