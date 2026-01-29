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
    
    // 과거 연도 전체 조회 (1월 1일 ~ 12월 31일)
    @Query(value = "SELECT * FROM streak WHERE account_id = :accountId AND EXTRACT(YEAR FROM activity_date) = :year ORDER BY activity_date DESC", nativeQuery = true)
    List<StreakJpaEntity> findByAccountIdAndFullYear(@Param("accountId") Long accountId, @Param("year") int year);
    
    // 올해 특정 월 조회 (1일 ~ 마지막 날)
    @Query(value = "SELECT * FROM streak WHERE account_id = :accountId AND EXTRACT(YEAR FROM activity_date) = :year AND EXTRACT(MONTH FROM activity_date) = :month ORDER BY activity_date DESC", nativeQuery = true)
    List<StreakJpaEntity> findByAccountIdAndMonth(@Param("accountId") Long accountId, @Param("year") int year, @Param("month") int month);
    
    // 올해 1월 1일부터 오늘까지 조회
    @Query(value = "SELECT * FROM streak WHERE account_id = :accountId AND activity_date >= :startDate AND activity_date <= :endDate ORDER BY activity_date DESC", nativeQuery = true)
    List<StreakJpaEntity> findByAccountIdAndDateRange(@Param("accountId") Long accountId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

