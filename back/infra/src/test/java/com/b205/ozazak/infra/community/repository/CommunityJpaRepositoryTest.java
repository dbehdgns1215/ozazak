package com.b205.ozazak.infra.community.repository;

import com.b205.ozazak.application.community.port.out.dto.CommunityDeleteProjection;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class CommunityJpaRepositoryTest {

    @Autowired
    private CommunityJpaRepository communityJpaRepository;

    @Autowired
    private AccountJpaRepository accountJpaRepository;

    @Autowired
    private org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager entityManager;

    @Test
    @DisplayName("Soft delete sets deletedAt and returns affected rows = 1")
    void softDelete_SetsDeletedAt() {
        // Given
        AccountJpaEntity account = createTestAccount();
        CommunityJpaEntity community = createTestCommunity(account);

        // When
        int affectedRows = communityJpaRepository.softDelete(community.getCommunityId());
        entityManager.clear(); // Clear persistence context to fetch fresh data from DB

        // Then
        assertThat(affectedRows).isEqualTo(1);

        // Verify deletedAt is set
        CommunityJpaEntity deleted = communityJpaRepository.findById(community.getCommunityId()).orElseThrow();
        assertThat(deleted.getDeletedAt()).isNotNull();
    }

    @Test
    @DisplayName("Double delete returns affected rows = 0")
    void doubleDelete_ReturnsZeroAffectedRows() {
        // Given
        AccountJpaEntity account = createTestAccount();
        CommunityJpaEntity community = createTestCommunity(account);

        // First delete
        communityJpaRepository.softDelete(community.getCommunityId());
        entityManager.clear();

        // When: Second delete
        int affectedRows = communityJpaRepository.softDelete(community.getCommunityId());

        // Then
        assertThat(affectedRows).isEqualTo(0);
    }

    @Test
    @DisplayName("Deleted post not returned by findByIdWithAuthor")
    void deletedPost_NotReturnedByFindByIdWithAuthor() {
        // Given
        AccountJpaEntity account = createTestAccount();
        CommunityJpaEntity community = createTestCommunity(account);

        // When: Delete and query
        communityJpaRepository.softDelete(community.getCommunityId());
        entityManager.clear();
        Optional<CommunityJpaEntity> result = communityJpaRepository.findByIdWithAuthor(community.getCommunityId());

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Deleted post not included in findSummaries")
    void deletedPost_NotIncludedInFindSummaries() {
        // Given
        AccountJpaEntity account = createTestAccount();
        CommunityJpaEntity community1 = createTestCommunity(account);
        CommunityJpaEntity community2 = createTestCommunity(account);

        // When: Delete one post
        communityJpaRepository.softDelete(community1.getCommunityId());
        entityManager.clear();
        Page<CommunitySummaryJpaResult> summaries = communityJpaRepository.findSummaries(PageRequest.of(0, 10));

        // Then: Only non-deleted post appears
        assertThat(summaries.getContent()).hasSize(1);
        assertThat(summaries.getContent().get(0).getCommunityId()).isEqualTo(community2.getCommunityId());
    }

    @Test
    @DisplayName("Deleted post not included in findProjectedSummaries")
    void deletedPost_NotIncludedInFindProjectedSummaries() {
        // Given
        AccountJpaEntity account = createTestAccount();
        CommunityJpaEntity community1 = createTestCommunity(account);
        CommunityJpaEntity community2 = createTestCommunity(account);

        // When: Delete one post
        communityJpaRepository.softDelete(community1.getCommunityId());
        entityManager.clear();
        Page<com.b205.ozazak.infra.community.repository.projection.CommunitySummaryProjection> summaries = 
            communityJpaRepository.findProjectedSummaries(PageRequest.of(0, 10));

        // Then: Only non-deleted post appears
        assertThat(summaries.getContent()).hasSize(1);
        assertThat(summaries.getContent().get(0).getCommunityId()).isEqualTo(community2.getCommunityId());
    }

    @Test
    @DisplayName("findDeleteProjectionById returns projection with deletedAt")
    void findDeleteProjectionById_ReturnsProjectionWithDeletedAt() {
        // Given
        AccountJpaEntity account = createTestAccount();
        CommunityJpaEntity community = createTestCommunity(account);

        // When: Before delete
        Optional<CommunityDeleteProjection> beforeDelete = communityJpaRepository.findDeleteProjectionById(community.getCommunityId());

        // Then
        assertThat(beforeDelete).isPresent();
        assertThat(beforeDelete.get().getAuthorId()).isEqualTo(account.getAccountId());
        assertThat(beforeDelete.get().getDeletedAt()).isNull();

        // When: After delete
        communityJpaRepository.softDelete(community.getCommunityId());
        entityManager.clear(); // Clear context to ensure DB read
        Optional<CommunityDeleteProjection> afterDelete = communityJpaRepository.findDeleteProjectionById(community.getCommunityId());

        // Then
        assertThat(afterDelete).isPresent();
        assertThat(afterDelete.get().getDeletedAt()).isNotNull();
    }

    private AccountJpaEntity createTestAccount() {
        AccountJpaEntity account = AccountJpaEntity.builder()
                .email("test@example.com")
                .password("password")
                .name("Test User")
                .img("profile.jpg")
                .roleCode(1)
                .build();
        return accountJpaRepository.save(account);
    }

    private CommunityJpaEntity createTestCommunity(AccountJpaEntity account) {
        CommunityJpaEntity community = CommunityJpaEntity.create(
                account,
                "Test Title for Community",
                "Test Content",
                1,
                null
        );
        return communityJpaRepository.save(community);
    }
}
