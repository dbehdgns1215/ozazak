package com.b205.ozazak.infra.coverletter.repository;

import com.b205.ozazak.infra.coverletter.entity.CoverletterJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoverletterJpaRepository extends JpaRepository<CoverletterJpaEntity, Long> {
}
