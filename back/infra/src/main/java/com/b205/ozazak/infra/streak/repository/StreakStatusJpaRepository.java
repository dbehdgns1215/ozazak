package com.b205.ozazak.infra.streak.repository;

import com.b205.ozazak.infra.streak.entity.StreakStatusJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StreakStatusJpaRepository extends JpaRepository<StreakStatusJpaEntity, Long> {
    
    @Query(value = "SELECT account_id FROM streak_status", nativeQuery = true)
    List<Long> findAllAccountIds();
}
