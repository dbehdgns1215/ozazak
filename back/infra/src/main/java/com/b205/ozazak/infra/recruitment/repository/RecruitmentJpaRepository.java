package com.b205.ozazak.infra.recruitment.repository;

import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruitmentJpaRepository extends JpaRepository<RecruitmentJpaEntity, Long> {
}
