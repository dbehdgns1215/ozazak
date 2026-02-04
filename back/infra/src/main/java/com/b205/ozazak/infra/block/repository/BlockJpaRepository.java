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

    // 벡터 유사도 검색 (중복 검사용)
    @Query(value = "SELECT (b.vector <=> cast(:embedding as vector)) as distance " +
                   "FROM block b " +
                   "WHERE b.account_id = :accountId " +
                   "AND b.deleted_at IS NULL " +
                   "ORDER BY distance ASC LIMIT 1", 
           nativeQuery = true)
    java.util.Optional<Double> findMinDistance(
        @Param("accountId") Long accountId, 
        @Param("embedding") String embedding
    );

    // 벡터 업데이트
    @org.springframework.data.jpa.repository.Modifying
    @Query(value = "UPDATE block SET vector = cast(:vectorStr as vector) WHERE block_id = :blockId", 
           nativeQuery = true)
    void updateVector(@Param("blockId") Long blockId, @Param("vectorStr") String vectorStr);
}
