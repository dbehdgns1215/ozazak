package com.b205.ozazak.infra.streak.repository;

import com.b205.ozazak.infra.streak.entity.StreakJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreakJpaRepository extends JpaRepository<StreakJpaEntity, Long> {
}
