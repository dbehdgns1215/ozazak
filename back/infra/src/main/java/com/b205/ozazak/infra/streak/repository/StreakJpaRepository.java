package com.b205.ozazak.infra.streak.repository;

import com.b205.ozazak.infra.streak.entity.StreakJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StreakJpaRepository extends JpaRepository<StreakJpaEntity, Long> {
    
    Optional<StreakJpaEntity> findByAccountIdAndActivityDate(Long accountId, LocalDate activityDate);
    
    @Query(value = "SELECT DISTINCT account_id FROM streak WHERE activity_date = :date", nativeQuery = true)
    List<Long> findAllActiveAccountsOn(@Param("date") LocalDate date);
    
    @Query(value = "SELECT MAX(activity_date) FROM streak WHERE account_id = :accountId", nativeQuery = true)
    Optional<LocalDate> findLastActivityDateByAccountId(@Param("accountId") Long accountId);
    
    @Query(value = "SELECT EXISTS(SELECT 1 FROM streak WHERE account_id = :accountId AND activity_date = :activityDate)", nativeQuery = true)
    boolean existsByAccountIdAndActivityDate(@Param("accountId") Long accountId, @Param("activityDate") LocalDate activityDate);
}

