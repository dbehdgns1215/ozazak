package com.b205.ozazak.infra.reaction.adapter;

import com.b205.ozazak.application.community.port.out.ManageReactionPort;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import com.b205.ozazak.infra.reaction.entity.ReactionJpaEntity;
import com.b205.ozazak.infra.reaction.repository.ReactionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReactionPersistenceAdapter implements ManageReactionPort {

    private final ReactionJpaRepository reactionRepository;
    private final CommunityJpaRepository communityRepository;
    private final AccountJpaRepository accountRepository;

    @Override
    public void addReaction(Long tilId, Long accountId, Integer type) {
        try {
            // Idempotency: Optimization - Insert directly, catch duplicate constraint
            // Using getReferenceById to avoid SELECT
            CommunityJpaEntity communityRef = communityRepository.getReferenceById(tilId);
            AccountJpaEntity accountRef = accountRepository.getReferenceById(accountId);
            
            ReactionJpaEntity reaction = ReactionJpaEntity.create(communityRef, accountRef, type);
            reactionRepository.save(reaction);
            
        } catch (DataIntegrityViolationException e) {
            // Already exists (or FK violation), treat as success (idempotent)
            // If FK violation (e.g. tilId not found), Service layer already checked existence,
            // so this is likely a duplicate reaction.
        }
    }

    @Override
    public void removeReaction(Long tilId, Long accountId, Integer type) {
        // Idempotency: delete if exists, ignore if not
        reactionRepository.deleteByCommunity_CommunityIdAndAccount_AccountIdAndCode(tilId, accountId, type);
    }
}
