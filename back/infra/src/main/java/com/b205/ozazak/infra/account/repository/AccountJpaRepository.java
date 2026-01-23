package com.b205.ozazak.infra.account.repository;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountJpaRepository extends JpaRepository<AccountJpaEntity, Long> {
    boolean existsByEmail(String email);
    java.util.Optional<AccountJpaEntity> findByEmail(String email);
}
