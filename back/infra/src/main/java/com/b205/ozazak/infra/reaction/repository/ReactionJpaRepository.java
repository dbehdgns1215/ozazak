package com.b205.ozazak.infra.reaction.repository;

import com.b205.ozazak.infra.reaction.entity.ReactionJpaEntity;
import com.b205.ozazak.infra.reaction.repository.projection.UserReactionProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReactionJpaRepository extends JpaRepository<ReactionJpaEntity, ReactionJpaEntity.ReactionId> {
    boolean existsByCommunity_CommunityIdAndAccount_AccountIdAndCode(Long communityId, Long accountId, Integer code);
    void deleteByCommunity_CommunityIdAndAccount_AccountIdAndCode(Long communityId, Long accountId, Integer code);

    @Query("SELECT r.community.communityId as communityId, r.code as reactionCode " +
           "FROM ReactionJpaEntity r " +
           "WHERE r.account.accountId = :accountId " +
           "AND r.community.communityId IN :communityIds")
    List<UserReactionProjection> findUserReactions(@Param("accountId") Long accountId, @Param("communityIds") List<Long> communityIds);
}
