package com.b205.ozazak.infra.community.repository;

import com.b205.ozazak.application.community.port.out.dto.CommunityDeleteProjection;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.projection.CommunityListProjection;
import com.b205.ozazak.infra.community.repository.projection.CommunitySummaryProjection;
import com.b205.ozazak.infra.community.repository.projection.TilBaseProjection;
import com.b205.ozazak.infra.community.repository.projection.TodayCountProjection;
import com.b205.ozazak.infra.community.repository.projection.TotalCountProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityJpaRepository extends JpaRepository<CommunityJpaEntity, Long> {

    @Query("SELECT c FROM CommunityJpaEntity c JOIN FETCH c.account WHERE c.communityId = :id AND c.deletedAt IS NULL")
    Optional<CommunityJpaEntity> findByIdWithAuthor(@Param("id") Long id);

    boolean existsByCommunityIdAndCommunityCodeAndDeletedAtIsNull(Long communityId, Integer communityCode);

    @Query("SELECT new com.b205.ozazak.infra.community.repository.CommunitySummaryJpaResult(" +
            "c.communityId, c.title, c.view, c.communityCode, c.isHot, c.createdAt, " +
            "a.accountId, a.name, a.img, " +
            "(SELECT CAST(count(cm) AS long) FROM CommentJpaEntity cm WHERE cm.community = c AND cm.deletedAt IS NULL), " +
            "(SELECT CAST(count(r) AS long) FROM ReactionJpaEntity r WHERE r.community = c)) " +
            "FROM CommunityJpaEntity c " +
            "JOIN c.account a " +
            "WHERE c.deletedAt IS NULL")
    Page<CommunitySummaryJpaResult> findSummaries(Pageable pageable);

    @Query(value = "SELECT community_id, name FROM community_tag WHERE community_id IN :ids", nativeQuery = true)
    List<Object[]> findTagsByCommunityIds(@Param("ids") Collection<Long> ids);

    @Query("SELECT " +
            "c.communityId as communityId, " +
            "c.title as title, " +
            "a.accountId as authorId, " +
            "a.name as authorName, " +
            "a.img as authorImg, " +
            "(SELECT COUNT(cm) FROM CommentJpaEntity cm WHERE cm.community = c AND cm.deletedAt IS NULL) as commentCount " +
            "FROM CommunityJpaEntity c " +
            "JOIN c.account a " +
            "WHERE c.deletedAt IS NULL")
    Page<CommunitySummaryProjection> findProjectedSummaries(Pageable pageable);

    @Query("SELECT c.account.accountId FROM CommunityJpaEntity c WHERE c.communityId = :id")
    Optional<Long> findAuthorIdById(@Param("id") Long id);

    @Query("""
        SELECT c.account.accountId AS authorId, c.deletedAt AS deletedAt
        FROM CommunityJpaEntity c
        WHERE c.communityId = :communityId
    """)
    Optional<CommunityDeleteProjection> findDeleteProjectionById(@Param("communityId") Long communityId);

    @Modifying
    @Query("""
        UPDATE CommunityJpaEntity c
        SET c.deletedAt = CURRENT_TIMESTAMP
        WHERE c.communityId = :id AND c.deletedAt IS NULL
    """)
    int softDelete(@Param("id") Long id);

    @Modifying
    @Query("""
        UPDATE CommunityJpaEntity c
        SET c.view = c.view + 1
        WHERE c.communityId = :communityId AND c.deletedAt IS NULL
    """)
    int incrementViewCount(@Param("communityId") Long communityId);

    // ========== TIL List Queries (2-Step Strategy) ==========

    /**
     * Step 1: Page community IDs with filters (DISTINCT to avoid duplicates from tag JOIN)
     * Conditional tag filtering: only JOIN community_tag when tags are provided
     * Supports: authorStatus, authorId, authorName filters
     */
    @Query(value = """
        SELECT c.community_id
        FROM community c
        JOIN account a ON c.account_id = a.account_id
        LEFT JOIN community_tag ct ON (c.community_id = ct.community_id AND :hasTagFilter = true)
        WHERE c.community_code = :communityCode
          AND c.deleted_at IS NULL
          AND a.deleted_at IS NULL
          AND (:authorStatus IS NULL OR a.author_status = :authorStatus)
          AND (:authorId IS NULL OR a.account_id = :authorId)
          AND (:authorName IS NULL OR a.name LIKE CONCAT('%', :authorName, '%'))
          AND (:hasTagFilter = false OR ct.name IN :tags)
        GROUP BY c.community_id
        """,
            countQuery = """
        SELECT COUNT(DISTINCT c.community_id)
        FROM community c
        JOIN account a ON c.account_id = a.account_id
        LEFT JOIN community_tag ct ON (c.community_id = ct.community_id AND :hasTagFilter = true)
        WHERE c.community_code = :communityCode
          AND c.deleted_at IS NULL
          AND a.deleted_at IS NULL
          AND (:authorStatus IS NULL OR a.author_status = :authorStatus)
          AND (:authorId IS NULL OR a.account_id = :authorId)
          AND (:authorName IS NULL OR a.name LIKE CONCAT('%', :authorName, '%'))
          AND (:hasTagFilter = false OR ct.name IN :tags)
        """,
            nativeQuery = true)
    Page<Long> findTilIds(
            @Param("communityCode") Integer communityCode,
            @Param("authorStatus") String authorStatus,
            @Param("authorId") Long authorId,
            @Param("authorName") String authorName,
            @Param("tags") List<String> tags,
            @Param("hasTagFilter") boolean hasTagFilter,
            Pageable pageable
    );

    // ... (findTilRowsByIds, findTagsForTilList, findCommentCountsForTilList, findReactionsForTilList omitted for brevity but remain unchanged) ...

    /**
     * Step 2: Fetch base rows by IDs
     * Order is NOT preserved by IN clause - must reorder in Java
     */
    @Query("""
        SELECT c.communityId AS communityId,
               c.title AS title,
               c.content AS content,
               a.accountId AS authorId,
               a.name AS authorName,
               a.img AS authorImg,
               comp.name AS companyName,
               c.view AS view,
               c.createdAt AS createdAt
        FROM CommunityJpaEntity c
        JOIN c.account a
        LEFT JOIN CompanyJpaEntity comp ON a.companyId = comp.companyId
        WHERE c.communityId IN :communityIds
        """)
    List<TilBaseProjection> findTilRowsByIds(
            @Param("communityIds") List<Long> communityIds
    );

    /**
     * Batch load tags from community_tag (ElementCollection)
     */
    @Query(value = """
        SELECT community_id AS communityId, name AS tag
        FROM community_tag
        WHERE community_id IN :communityIds
        ORDER BY community_id, name
        """, nativeQuery = true)
    List<TagMapping> findTagsForTilList(@Param("communityIds") List<Long> communityIds);

    interface TagMapping {
        Long getCommunityId();
        String getTag();
    }

    /**
     * Batch load comment counts
     */
    @Query("""
        SELECT c.community.communityId AS communityId, COUNT(c) AS count
        FROM CommentJpaEntity c
        WHERE c.community.communityId IN :communityIds
          AND c.deletedAt IS NULL
        GROUP BY c.community.communityId
        """)
    List<CommentCountMapping> findCommentCountsForTilList(@Param("communityIds") List<Long> communityIds);

    interface CommentCountMapping {
        Long getCommunityId();
        Long getCount();
    }

    /**
     * Batch load reactions grouped by type
     */
    @Query("""
        SELECT r.community.communityId AS communityId,
               r.code AS type,
               COUNT(r) AS count
        FROM ReactionJpaEntity r
        WHERE r.community.communityId IN :communityIds
        GROUP BY r.community.communityId, r.code
        """)
    List<ReactionCountMapping> findReactionsForTilList(@Param("communityIds") List<Long> communityIds);

    interface ReactionCountMapping {
        Long getCommunityId();
        Integer getType();
        Long getCount();
    }

    /**
     * Total post counts grouped by communityCode (excluding deleted)
     */
    @Query("""
        SELECT c.communityCode AS communityCode, COUNT(c) AS totalCount
        FROM CommunityJpaEntity c
        WHERE c.deletedAt IS NULL
        GROUP BY c.communityCode
    """)
    List<TotalCountProjection> findTotalCounts();

    /**
     * Today's post counts grouped by communityCode (excluding deleted)
     */
    @Query("""
        SELECT c.communityCode AS communityCode, COUNT(c) AS todayCount
        FROM CommunityJpaEntity c
        WHERE c.deletedAt IS NULL
          AND c.createdAt >= :start
          AND c.createdAt < :end
        GROUP BY c.communityCode
    """)
    List<TodayCountProjection> findTodayCounts(
            @Param("start") java.time.LocalDateTime start,
            @Param("end") java.time.LocalDateTime end
    );


    @Query(value = """
        SELECT c.community_id
        FROM community c
        JOIN account a ON c.account_id = a.account_id
        LEFT JOIN community_tag ct ON (c.community_id = ct.community_id AND :hasTagFilter = true)
        WHERE (:communityCode IS NULL OR c.community_code = :communityCode)
          AND c.deleted_at IS NULL
          AND a.deleted_at IS NULL
          AND (:authorStatus IS NULL OR a.author_status = :authorStatus)
          AND (:authorId IS NULL OR a.account_id = :authorId)
          AND (:authorName IS NULL OR a.name LIKE CONCAT('%', :authorName, '%'))
          AND (:hasTagFilter = false OR ct.name IN :tags)
        GROUP BY c.community_id
        """,
            countQuery = """
        SELECT COUNT(DISTINCT c.community_id)
        FROM community c
        JOIN account a ON c.account_id = a.account_id
        LEFT JOIN community_tag ct ON (c.community_id = ct.community_id AND :hasTagFilter = true)
        WHERE (:communityCode IS NULL OR c.community_code = :communityCode)
          AND c.deleted_at IS NULL
          AND a.deleted_at IS NULL
          AND (:authorStatus IS NULL OR a.author_status = :authorStatus)
          AND (:authorId IS NULL OR a.account_id = :authorId)
          AND (:authorName IS NULL OR a.name LIKE CONCAT('%', :authorName, '%'))
          AND (:hasTagFilter = false OR ct.name IN :tags)
        """,
            nativeQuery = true)
    Page<Long> findCommunityIds(
            @Param("communityCode") Integer communityCode,
            @Param("authorStatus") String authorStatus,
            @Param("authorId") Long authorId,
            @Param("authorName") String authorName,
            @Param("tags") List<String> tags,
            @Param("hasTagFilter") boolean hasTagFilter,
            Pageable pageable
    );


    /**
     * Step 2: Fetch base rows by IDs (Generic)
     */
    @Query("""
        SELECT c.communityId AS communityId,
               c.communityCode AS communityCode,
               c.title AS title,
               c.content AS content,
               a.accountId AS authorId,
               a.name AS authorName,
               a.img AS authorImg,
               comp.name AS companyName,
               c.view AS view,
               c.createdAt AS createdAt
        FROM CommunityJpaEntity c
        JOIN c.account a
        LEFT JOIN CompanyJpaEntity comp ON a.companyId = comp.companyId
        WHERE c.communityId IN :communityIds
        """)
    List<CommunityListProjection> findCommunityRowsByIds(
            @Param("communityIds") List<Long> communityIds
    );
}