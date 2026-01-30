package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.port.out.dto.ListTilQuery;
import com.b205.ozazak.application.community.port.out.dto.TilListPage;
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
class CommunityPersistenceAdapterTilListTest {

    @Autowired
    private CommunityPersistenceAdapter adapter;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CommunityJpaRepository repository;

    @Test
    @DisplayName("loadTilList matches authorName partially")
    void loadTilList_AuthorNamePartialMatch() {
        // Given
        AccountJpaEntity author = AccountJpaEntity.builder()
                .name("Author1")
                .email("a1@test.com")
                .password("pw")
                .img("img")
                .roleCode(1)
                .build();
        entityManager.persist(author);

        CommunityJpaEntity til = CommunityJpaEntity.create(
                author, "Title", "Content", 1, List.of("tagA")
        );
        entityManager.persist(til);

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .authorName("1") // Should match "Author1"
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage page = adapter.loadTilList(query);

        // Then
        assertThat(page.items()).hasSize(1);
        assertThat(page.items().get(0).getAuthorName()).isEqualTo("Author1");
    }

    @Test
    @DisplayName("loadTilList with tags and authorName")
    void loadTilList_WithTagsAndAuthorName() {
         // Given
        AccountJpaEntity author = AccountJpaEntity.builder()
                .name("Author1")
                .email("a1@test.com")
                .password("pw")
                .img("img")
                .roleCode(1)
                .build();
        entityManager.persist(author);

        CommunityJpaEntity til = CommunityJpaEntity.create(
                author, "Title", "Content", 1, List.of("tagA", "tagB")
        );
        entityManager.persist(til);

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .authorName("1")
                .tags(List.of("tagA"))
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage page = adapter.loadTilList(query);

        // Then
        assertThat(page.items()).hasSize(1);
    }
}
