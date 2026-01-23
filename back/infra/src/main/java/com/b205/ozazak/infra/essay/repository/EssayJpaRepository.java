package com.b205.ozazak.infra.essay.repository;

import com.b205.ozazak.infra.essay.entity.EssayJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EssayJpaRepository extends JpaRepository<EssayJpaEntity, Long> {
}
