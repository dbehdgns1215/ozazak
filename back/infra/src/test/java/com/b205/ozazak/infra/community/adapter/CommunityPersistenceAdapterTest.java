package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.command.UpdateCommunityParams;
import com.b205.ozazak.application.community.port.out.dto.CommunityAuthorProjection;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

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
    @DisplayName("loadForUpdate returns projection with authorId")
    void loadForUpdate_ReturnsProjection() {
        // Given
        AccountJpaEntity account = AccountJpaEntity.builder()
                .name("Author")
                .email("m@m.com")
                .password("pw")
                .img("http://img.com")
                .roleCode(1)
                .build();
        entityManager.persist(account);

        CommunityJpaEntity community = CommunityJpaEntity.create(
                account, "Title", "Content", 1, List.of("tag")
        );
        entityManager.persist(community);
        entityManager.flush();

        // When
        CommunityAuthorProjection result = adapter.loadForUpdate(community.getCommunityId());

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getAuthorId()).isEqualTo(account.getAccountId());
    }

    @Test
    @DisplayName("update updates fields and tags")
    void update_UpdatesFieldsAndTags() {
        // Given
        AccountJpaEntity account = AccountJpaEntity.builder()
                .name("Author")
                .email("m2@m.com")
                .password("pw")
                .img("http://img.com")
                .roleCode(1)
                .build();
        entityManager.persist(account);

        CommunityJpaEntity community = CommunityJpaEntity.create(
                account, "Old Title", "Old Content", 1, List.of("oldTag")
        );
        entityManager.persist(community);
        entityManager.flush();
        entityManager.clear(); // Clear cache to ensure clean read

        // When
        UpdateCommunityParams params = UpdateCommunityParams.builder()
                .communityCode(1)
                .title("New Title")
                .content("New Content")
                .tags(List.of("newTag1", "newTag2"))
                .build();

        adapter.update(community.getCommunityId(), params);
        entityManager.flush();
        entityManager.clear();

        // Then
        CommunityJpaEntity updated = repository.findById(community.getCommunityId()).orElseThrow();
        assertThat(updated.getTitle()).isEqualTo("New Title");
        assertThat(updated.getContent()).isEqualTo("New Content");
        assertThat(updated.getTags()).containsExactlyInAnyOrder("newTag1", "newTag2");
    }
}
