package com.b205.ozazak.infra.reaction.repository;

import com.b205.ozazak.infra.reaction.entity.ReactionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionJpaRepository extends JpaRepository<ReactionJpaEntity, ReactionJpaEntity.ReactionId> {
    boolean existsByCommunity_CommunityIdAndAccount_AccountIdAndCode(Long communityId, Long accountId, Integer code);
    void deleteByCommunity_CommunityIdAndAccount_AccountIdAndCode(Long communityId, Long accountId, Integer code);
}
