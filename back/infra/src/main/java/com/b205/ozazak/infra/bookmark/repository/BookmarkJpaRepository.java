package com.b205.ozazak.infra.bookmark.repository;

import com.b205.ozazak.infra.bookmark.entity.BookmarkJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface BookmarkJpaRepository extends JpaRepository<BookmarkJpaEntity, BookmarkJpaEntity.BookmarkId> {

    // 관심 목록 조회
    @Query("SELECT b.recruitment.recruitmentId FROM BookmarkJpaEntity b WHERE b.account.accountId = :accountId")
    Set<Long> findRecruitmentIdsByAccountId(@Param("accountId") Long accountId);

    // 관심 여부 확인
    @Query("SELECT COUNT(b) > 0 FROM BookmarkJpaEntity b WHERE b.account.accountId = :accountId AND b.recruitment.recruitmentId = :recruitmentId")
    boolean existsByAccountIdAndRecruitmentId(@Param("accountId") Long accountId,
            @Param("recruitmentId") Long recruitmentId);

    // 관심 목록 해제
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM BookmarkJpaEntity b WHERE b.account.accountId = :accountId AND b.recruitment.recruitmentId = :recruitmentId")
    void deleteByAccountIdAndRecruitmentId(@Param("accountId") Long accountId,
            @Param("recruitmentId") Long recruitmentId);
}
