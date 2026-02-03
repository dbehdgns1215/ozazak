package com.b205.ozazak.infra.recruitment.repository;

import com.b205.ozazak.infra.recruitment.entity.RecruitmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecruitmentJpaRepository extends JpaRepository<RecruitmentJpaEntity, Long> {

        @Query("SELECT r FROM RecruitmentJpaEntity r " +
                        "JOIN FETCH r.company " +
                        "WHERE r.recruitmentId = :recruitmentId")
        Optional<RecruitmentJpaEntity> findByIdWithCompany(@Param("recruitmentId") Long recruitmentId);

        // fromDate : 달력 첫날, toDate : 달력 마지막날
        @Query("SELECT r FROM RecruitmentJpaEntity r JOIN FETCH r.company " +
                        "WHERE (r.startedAt <= :toDate AND r.endedAt >= :fromDate) " +
                        "ORDER BY r.endedAt ASC")
        List<RecruitmentJpaEntity> findByDatePeriod(@Param("fromDate") LocalDateTime fromDate,
                        @Param("toDate") LocalDateTime toDate);

        // fromDate : 오늘, toDate : 오늘 + 설정한 일수
        @Query("SELECT r FROM RecruitmentJpaEntity r JOIN FETCH r.company " +
                        "WHERE r.endedAt BETWEEN :fromDate AND :toDate " +
                        "ORDER BY r.endedAt ASC")
        List<RecruitmentJpaEntity> findClosingRecruitments(@Param("fromDate") LocalDateTime fromDate,
                        @Param("toDate") LocalDateTime toDate);

        @Query("SELECT r FROM RecruitmentJpaEntity r JOIN FETCH r.company " +
                        "WHERE r.recruitmentId IN (SELECT b.recruitment.recruitmentId FROM BookmarkJpaEntity b WHERE b.account.accountId = :accountId) "
                        +
                        "ORDER BY r.endedAt ASC")
        List<RecruitmentJpaEntity> findBookmarkedRecruitments(@Param("accountId") Long accountId);
}
