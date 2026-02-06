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



    @Test
    @DisplayName("loadCommunityList sorts by createdAt DESC correctly")
    void loadCommunityList_SortsByCreatedAt() throws InterruptedException {
        // Given
        AccountJpaEntity author = AccountJpaEntity.builder()
                .name("Author")
                .email("test@test.com")
                .password("pw")
                .img("img")
                .roleCode(1)
                .build();
        entityManager.persist(author);

        // Create community 1
        CommunityJpaEntity c1 = CommunityJpaEntity.create(author, "Title1", "Content1", 1, Collections.emptyList());
        entityManager.persist(c1);
        entityManager.flush();

        Thread.sleep(50); // Ensure timestamp difference

        // Create community 2 (newer)
        CommunityJpaEntity c2 = CommunityJpaEntity.create(author, "Title2", "Content2", 1, Collections.emptyList());
        entityManager.persist(c2);
        entityManager.flush();

        entityManager.clear();

        // When
        com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery query = 
            com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery.builder()
                .communityCode(1)
                .pageable(org.springframework.data.domain.PageRequest.of(0, 10, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")))
                .build();

        com.b205.ozazak.application.community.port.out.dto.CommunityListPage result = adapter.loadCommunityList(query);

        // Then
        List<com.b205.ozazak.application.community.port.out.dto.CommunityRow> rows = result.getRows();
        assertThat(rows).hasSize(2);
        assertThat(rows.get(0).getCommunityId()).isEqualTo(c2.getCommunityId()); // Newer first
        assertThat(rows.get(1).getCommunityId()).isEqualTo(c1.getCommunityId());
    }

    @Test
    @DisplayName("loadCommunityList supports multiple sort fields (isHot DESC, createdAt DESC)")
    void loadCommunityList_SortsByMultipleFields() throws InterruptedException {
        // Given
        AccountJpaEntity author = AccountJpaEntity.builder()
                .name("AuthorMulti")
                .email("multi@test.com")
                .password("pw")
                .img("img")
                .roleCode(1)
                .build();
        entityManager.persist(author);
        entityManager.flush();

        // c1: Not Hot, Oldest
        CommunityJpaEntity c1 = CommunityJpaEntity.create(author, "Title1", "Content1", 1, Collections.emptyList());
        entityManager.persist(c1);
        entityManager.flush();
        Thread.sleep(50);

        // c3: Hot, Middle
        CommunityJpaEntity c3 = CommunityJpaEntity.create(author, "Title3", "Content3", 1, Collections.emptyList());
        entityManager.persist(c3);
        entityManager.flush();
        // Set Hot
        entityManager.getEntityManager().createQuery("UPDATE CommunityJpaEntity c SET c.isHot = true WHERE c.communityId = :id")
                .setParameter("id", c3.getCommunityId())
                .executeUpdate();
        
        Thread.sleep(50);
        
        // c2: Hot, Newest
        CommunityJpaEntity c2 = CommunityJpaEntity.create(author, "Title2", "Content2", 1, Collections.emptyList());
        entityManager.persist(c2);
        entityManager.flush();
        // Set Hot
        entityManager.getEntityManager().createQuery("UPDATE CommunityJpaEntity c SET c.isHot = true WHERE c.communityId = :id")
                .setParameter("id", c2.getCommunityId())
                .executeUpdate();

        entityManager.clear();

        // When
        // Sort: isHot DESC (true first), createdAt DESC (newer first)
        // Expected: c2 (Hot, Newest), c3 (Hot, Middle), c1 (Not Hot, Oldest)
        com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery query = 
            com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery.builder()
                .communityCode(1)
                .pageable(org.springframework.data.domain.PageRequest.of(0, 10, org.springframework.data.domain.Sort.by(
                    org.springframework.data.domain.Sort.Order.desc("isHot"),
                    org.springframework.data.domain.Sort.Order.desc("createdAt")
                )))
                .build();

        com.b205.ozazak.application.community.port.out.dto.CommunityListPage result = adapter.loadCommunityList(query);

        // Then
        List<com.b205.ozazak.application.community.port.out.dto.CommunityRow> rows = result.getRows();
        assertThat(rows).hasSize(3);
        assertThat(rows.get(0).getCommunityId()).isEqualTo(c2.getCommunityId());
        assertThat(rows.get(1).getCommunityId()).isEqualTo(c3.getCommunityId());
        assertThat(rows.get(2).getCommunityId()).isEqualTo(c1.getCommunityId());
    }

    @Test
    @DisplayName("loadCommunityList ignores unknown sort keys and falls back to default")
    void loadCommunityList_SortsByUnknownField_FallsBackToDefault() throws InterruptedException {
        // Given
        AccountJpaEntity author = AccountJpaEntity.builder()
                .name("AuthorUnknown")
                .email("unknown@test.com")
                .password("pw")
                .img("img")
                .roleCode(1)
                .build();
        entityManager.persist(author);

        CommunityJpaEntity c1 = CommunityJpaEntity.create(author, "Title1", "Content1", 1, Collections.emptyList());
        entityManager.persist(c1);
        entityManager.flush();
        Thread.sleep(50);

        CommunityJpaEntity c2 = CommunityJpaEntity.create(author, "Title2", "Content2", 1, Collections.emptyList());
        entityManager.persist(c2);
        entityManager.flush();

        entityManager.clear();

        // When
        // Sort: "invalidField" DESC (should be ignored) -> Fallback to createdAt DESC
        com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery query = 
            com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery.builder()
                .communityCode(1)
                .pageable(org.springframework.data.domain.PageRequest.of(0, 10, org.springframework.data.domain.Sort.by(
                    org.springframework.data.domain.Sort.Order.desc("invalidField")
                )))
                .build();

        com.b205.ozazak.application.community.port.out.dto.CommunityListPage result = adapter.loadCommunityList(query);

        // Then
        List<com.b205.ozazak.application.community.port.out.dto.CommunityRow> rows = result.getRows();
        assertThat(rows).hasSize(2);
        // Fallback default is createdAt DESC -> Newer (c2) first
        assertThat(rows.get(0).getCommunityId()).isEqualTo(c2.getCommunityId());
        assertThat(rows.get(1).getCommunityId()).isEqualTo(c1.getCommunityId());
    }
}
