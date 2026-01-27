package com.b205.ozazak.infra.recruitment.repository;

import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruitmentJpaRepository extends JpaRepository<RecruitmentJpaEntity, Long> {
    
    @Query("SELECT r FROM RecruitmentJpaEntity r " +
           "JOIN FETCH r.company " +
           "WHERE r.recruitmentId = :recruitmentId")
    Optional<RecruitmentJpaEntity> findByIdWithCompany(@Param("recruitmentId") Long recruitmentId);
}
