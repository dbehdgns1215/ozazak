package com.b205.ozazak.infra.block.repository;

import com.b205.ozazak.infra.block.entity.BlockJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockJpaRepository extends JpaRepository<BlockJpaEntity, Long> {

    // 전체 목록 (페이징)
    @Query("SELECT b FROM BlockJpaEntity b WHERE b.account.accountId = :accountId AND b.deletedAt IS NULL")
    Page<BlockJpaEntity> findAllByAccountIdAndDeletedAtIsNull(
            @Param("accountId") Long accountId,
            Pageable pageable
    );

    // 카테고리 필터
    @Query("SELECT DISTINCT b FROM BlockJpaEntity b JOIN b.categories c " +
           "WHERE b.account.accountId = :accountId " +
           "AND c = :category " +
           "AND b.deletedAt IS NULL")
    Page<BlockJpaEntity> findAllByAccountIdAndCategoryAndDeletedAtIsNull(
            @Param("accountId") Long accountId,
            @Param("category") Integer category,
            Pageable pageable
    );

    // 키워드 검색
    @Query("SELECT b FROM BlockJpaEntity b " +
           "WHERE b.account.accountId = :accountId " +
           "AND b.deletedAt IS NULL " +
           "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<BlockJpaEntity> searchByKeyword(
            @Param("accountId") Long accountId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    // 키워드 + 카테고리 검색
    @Query("SELECT DISTINCT b FROM BlockJpaEntity b JOIN b.categories c " +
           "WHERE b.account.accountId = :accountId " +
           "AND c = :category " +
           "AND b.deletedAt IS NULL " +
           "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<BlockJpaEntity> searchByKeywordAndCategory(
            @Param("accountId") Long accountId,
            @Param("keyword") String keyword,
            @Param("category") Integer category,
            Pageable pageable
    );
}
