package com.b205.ozazak.infra.coverletter.repository;

import com.b205.ozazak.infra.coverletter.entity.CoverletterJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CoverletterJpaRepository extends JpaRepository<CoverletterJpaEntity, Long> {
    
    @Query("SELECT c FROM CoverletterJpaEntity c " +
           "JOIN FETCH c.recruitment r " +
           "JOIN FETCH r.company " +
           "WHERE c.account.accountId = :accountId " +
           "AND c.deletedAt IS NULL")
    Page<CoverletterJpaEntity> findByAccountIdWithRecruitmentAndCompany(@Param("accountId") Long accountId, Pageable pageable);

    @Query("SELECT c FROM CoverletterJpaEntity c " +
           "JOIN FETCH c.recruitment r " +
           "JOIN FETCH r.company " +
           "WHERE c.coverletterId = :coverletterId " +
           "AND c.account.accountId = :accountId " +
           "AND c.deletedAt IS NULL")
    java.util.Optional<CoverletterJpaEntity> findByCoverletterIdAndAccount_AccountIdAndDeletedAtIsNull(
        @Param("coverletterId") Long coverletterId, 
        @Param("accountId") Long accountId
    );
}
