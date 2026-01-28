package com.b205.ozazak.infra.resume.repository;

import com.b205.ozazak.infra.resume.entity.ResumeJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeJpaRepository extends JpaRepository<ResumeJpaEntity, Long> {
    List<ResumeJpaEntity> findByAccount_AccountIdOrderByStartedAtDesc(Long accountId);
}
