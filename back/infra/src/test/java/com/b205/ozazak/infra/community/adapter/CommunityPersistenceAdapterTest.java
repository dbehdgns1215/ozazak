package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.community.vo.CommunityCode;
import com.b205.ozazak.domain.community.vo.CommunityContent;
import com.b205.ozazak.domain.community.vo.CommunityId;
import com.b205.ozazak.domain.community.vo.CommunityTitle;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(CommunityPersistenceAdapter.class)
class CommunityPersistenceAdapterTest {

    @Autowired
    private CommunityPersistenceAdapter adapter;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CommunityJpaRepository repository;

    @Test
    @DisplayName("save(community) creates new entity when ID is null")
    void save_CreatesNewEntity() {
        // Given
        AccountJpaEntity accountEntity = AccountJpaEntity.builder()
                .name("Author")
                .email("m@m.com")
                .password("pw")
                .img("img")
                .roleCode(1)
                .build();
        entityManager.persist(accountEntity);

        Community community = Community.builder()
                .author(Account.builder().id(new AccountId(accountEntity.getAccountId())).build())
                .communityCode(new CommunityCode(1))
                .title(new CommunityTitle("New Title"))
                .content(new CommunityContent("New Content"))
                .tags(List.of("tag1"))
                .build();

        // When
        Long savedId = adapter.save(community);

        // Then
        assertThat(savedId).isNotNull();
        CommunityJpaEntity saved = repository.findById(savedId).orElseThrow();
        assertThat(saved.getTitle()).isEqualTo("New Title");
        assertThat(saved.getTags()).contains("tag1");
    }

    @Test
    @DisplayName("save(community) updates existing entity when ID is present")
    void save_UpdatesExistingEntity() {
        // Given
        AccountJpaEntity accountEntity = AccountJpaEntity.builder()
                .name("Author")
                .email("m2@m.com")
                .password("pw")
                .img("img")
                .roleCode(1)
                .build();
        entityManager.persist(accountEntity);

        CommunityJpaEntity existingEntity = CommunityJpaEntity.create(
                accountEntity, "Old Title", "Old Content", 1, List.of("oldTag")
        );
        entityManager.persist(existingEntity);
        entityManager.flush();
        entityManager.clear();

        Community updateDomain = Community.builder()
                .id(new CommunityId(existingEntity.getCommunityId())) // ID Present
                .author(Account.builder().id(new AccountId(accountEntity.getAccountId())).build())
                .communityCode(new CommunityCode(1))
                .title(new CommunityTitle("Updated Title"))
                .content(new CommunityContent("Updated Content"))
                .tags(List.of("newTag"))
                .build();

        // When
        Long savedId = adapter.save(updateDomain);

        // Then
        assertThat(savedId).isEqualTo(existingEntity.getCommunityId());
        CommunityJpaEntity updated = repository.findById(savedId).orElseThrow();
        assertThat(updated.getTitle()).isEqualTo("Updated Title");
        assertThat(updated.getContent()).isEqualTo("Updated Content");
        assertThat(updated.getTags()).containsExactly("newTag");
    }
}
