package com.b205.ozazak.infra.community.repository;

import com.b205.ozazak.application.community.port.out.CommunityDeleteProjection;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
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

    @Query("SELECT new com.b205.ozazak.infra.community.repository.CommunitySummaryJpaResult(" +
           "c.communityId, c.title, c.view, c.communityCode, c.isHot, c.createdAt, " +
           "a.accountId, a.name, a.img, " +
           "(SELECT count(cm) FROM CommentJpaEntity cm WHERE cm.community = c AND cm.deletedAt IS NULL), " +
           "(SELECT count(r) FROM ReactionJpaEntity r WHERE r.community = c)) " +
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
    Page<com.b205.ozazak.infra.community.repository.projection.CommunitySummaryProjection> findProjectedSummaries(Pageable pageable);

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
}
