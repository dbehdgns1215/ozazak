package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.port.out.SaveCommunityPort;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommunityCommandPersistenceAdapter implements SaveCommunityPort {

    private final CommunityJpaRepository communityJpaRepository;
    private final EntityManager entityManager;

    @Override
    public Long save(Community community) {
        // Use getReference to avoid fetching Account (only need FK)
        AccountJpaEntity accountRef = entityManager.getReference(
                AccountJpaEntity.class,
                community.getAuthor().getId().value()
        );

        CommunityJpaEntity entity = CommunityJpaEntity.create(
                accountRef,
                community.getTitle().value(),
                community.getContent().value(),
                community.getCommunityCode().value(),
                community.getTags()
        );

        CommunityJpaEntity saved = communityJpaRepository.save(entity);
        return saved.getCommunityId();
    }
}
