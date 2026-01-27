package com.b205.ozazak.infra.recruitment.repository;

import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecruitmentJpaRepository extends JpaRepository<RecruitmentJpaEntity, Long> {

        @Query("SELECT r FROM RecruitmentJpaEntity r " +
                        "JOIN FETCH r.company " +
                        "WHERE r.recruitmentId = :recruitmentId")
        Optional<RecruitmentJpaEntity> findByIdWithCompany(@Param("recruitmentId") Long recruitmentId);

        /**
         * 기간별 공고 조회 (Company fetch join)
         * 기간 내에 시작하거나 끝나는 공고를 조회 (startedAt or endedAt in [fromDate, toDate])
         */
        @Query("SELECT r FROM RecruitmentJpaEntity r JOIN FETCH r.company " +
                        "WHERE (r.startedAt BETWEEN :fromDate AND :toDate) OR (r.endedAt BETWEEN :fromDate AND :toDate) "
                        +
                        "ORDER BY r.endedAt ASC")
        List<RecruitmentJpaEntity> findByDatePeriod(@Param("fromDate") LocalDate fromDate,
                        @Param("toDate") LocalDate toDate);
}
