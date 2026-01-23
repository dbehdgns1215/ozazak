package com.b205.ozazak.infra.community.repository;

import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityJpaRepository extends JpaRepository<CommunityJpaEntity, Long> {

    @Query("SELECT c FROM CommunityJpaEntity c JOIN FETCH c.account WHERE c.communityId = :id")
    Optional<CommunityJpaEntity> findByIdWithAuthor(@Param("id") Long id);

    @Query("SELECT new com.b205.ozazak.infra.community.repository.CommunitySummaryJpaResult(" +
           "c.communityId, c.title, c.view, c.communityCode, c.isHot, c.createdAt, " +
           "a.accountId, a.name, a.img, " +
           "(SELECT count(cm) FROM CommentJpaEntity cm WHERE cm.community = c), " +
           "(SELECT count(r) FROM ReactionJpaEntity r WHERE r.community = c)) " +
           "FROM CommunityJpaEntity c " +
           "JOIN c.account a")
    Page<CommunitySummaryJpaResult> findSummaries(Pageable pageable);

    @Query(value = "SELECT community_id, name FROM community_tag WHERE community_id IN :ids", nativeQuery = true)
    List<Object[]> findTagsByCommunityIds(@Param("ids") Collection<Long> ids);
}
