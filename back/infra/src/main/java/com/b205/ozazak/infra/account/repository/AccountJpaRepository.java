package com.b205.ozazak.infra.account.repository;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountJpaRepository extends JpaRepository<AccountJpaEntity, Long> {
    boolean existsByEmail(String email);
    
    Optional<AccountJpaEntity> findByEmail(String email);

    Optional<AccountJpaEntity> findById(Long accountId);
    
    // Active users (not deleted)
    @Query("SELECT a FROM AccountJpaEntity a WHERE a.email = :email AND a.deletedAt IS NULL")
    Optional<AccountJpaEntity> findByEmailAndNotDeleted(@Param("email") String email);
    
    // Deleted users (for recovery)
    @Query("SELECT a FROM AccountJpaEntity a WHERE a.email = :email AND a.deletedAt IS NOT NULL")
    Optional<AccountJpaEntity> findByEmailAndDeleted(@Param("email") String email);
}
