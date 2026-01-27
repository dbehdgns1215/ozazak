package com.b205.ozazak.infra.community.adapter;

import com.b205.ozazak.application.community.port.out.dto.ListTilQuery;
import com.b205.ozazak.application.community.port.out.dto.TilListPage;
import com.b205.ozazak.application.community.port.out.dto.TilRow;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.comment.entity.CommentJpaEntity;
import com.b205.ozazak.infra.comment.repository.CommentJpaRepository;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import com.b205.ozazak.infra.company.entity.CompanyJpaEntity;
import com.b205.ozazak.infra.company.repository.CompanyJpaRepository;
import com.b205.ozazak.infra.reaction.entity.ReactionJpaEntity;
import com.b205.ozazak.infra.reaction.repository.ReactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for TIL list 2-step query strategy
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TilListIntegrationTest {

    @Autowired
    private CommunityPersistenceAdapter adapter;

    @Autowired
    private CommunityJpaRepository communityRepository;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private CompanyJpaRepository companyRepository;

    @Autowired
    private CommentJpaRepository commentRepository;

    @Autowired
    private ReactionJpaRepository reactionRepository;

    private AccountJpaEntity author1;
    private AccountJpaEntity author2;
    private CompanyJpaEntity company;

    @BeforeEach
    void setUp() {
        // Clean up
        reactionRepository.deleteAll();
        commentRepository.deleteAll();
        communityRepository.deleteAll();
        accountRepository.deleteAll();
        companyRepository.deleteAll();

        // Create test data
        company = companyRepository.save(
                CompanyJpaEntity.create("Test Company", "logo.png", "Seoul")
        );

        author1 = accountRepository.save(
                AccountJpaEntity.builder()
                        .email("author1@test.com")
                        .password("password")
                        .name("Author 1")
                        .img("img1.jpg")
                        .roleCode(1)
                        .companyId(company.getCompanyId())
                        .build()
        );

        author2 = accountRepository.save(
                AccountJpaEntity.builder()
                        .email("author2@test.com")
                        .password("password")
                        .name("Author 2")
                        .img("img2.jpg")
                        .roleCode(1)
                        .companyId(null)  // No company
                        .build()
        );
    }

    @Test
    @DisplayName("2-step query with order preservation (no tags)")
    void testTwoStepQuery_OrderPreservation_NoTags() throws InterruptedException {
        // Given: 3 TILs created at different times
        CommunityJpaEntity til1 = createTil(author1, "TIL 1", List.of("spring"));
        Thread.sleep(10);
        CommunityJpaEntity til2 = createTil(author1, "TIL 2", List.of("jpa"));
        Thread.sleep(10);
        CommunityJpaEntity til3 = createTil(author1, "TIL 3", List.of("java"));

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then: Order should be newest first (til3, til2, til1)
        assertThat(result.items()).hasSize(3);
        assertThat(result.items().get(0).getCommunityId()).isEqualTo(til3.getCommunityId());
        assertThat(result.items().get(1).getCommunityId()).isEqualTo(til2.getCommunityId());
        assertThat(result.items().get(2).getCommunityId()).isEqualTo(til1.getCommunityId());
    }

    @Test
    @DisplayName("2-step query with order preservation (with tags OR logic)")
    void testTwoStepQuery_OrderPreservation_WithTags() throws InterruptedException {
        // Given
        CommunityJpaEntity til1 = createTil(author1, "TIL 1", List.of("spring", "boot"));
        Thread.sleep(10);
        CommunityJpaEntity til2 = createTil(author1, "TIL 2", List.of("jpa"));
        Thread.sleep(10);
        CommunityJpaEntity til3 = createTil(author1, "TIL 3", List.of("spring"));

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .tags(List.of("spring"))  // Should match til1 and til3
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then: Only TILs with "spring" tag, newest first
        assertThat(result.items()).hasSize(2);
        assertThat(result.items().get(0).getCommunityId()).isEqualTo(til3.getCommunityId());
        assertThat(result.items().get(1).getCommunityId()).isEqualTo(til1.getCommunityId());
    }

    @Test
    @DisplayName("Pagination correctness (no tags)")
    void testPagination_NoTags() {
        // Given: 5 TILs
        for (int i = 0; i < 5; i++) {
            createTil(author1, "TIL " + i, List.of("tag" + i));
        }

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(2)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then
        assertThat(result.items()).hasSize(2);
        assertThat(result.totalElements()).isEqualTo(5);
        assertThat(result.totalPages()).isEqualTo(3);
        assertThat(result.currentPage()).isEqualTo(0);
        assertThat(result.pageSize()).isEqualTo(2);
    }

    @Test
    @DisplayName("Pagination correctness (with tags, no shrinking page)")
    void testPagination_WithTags_NoShrinkingPage() {
        // Given: 10 TILs, 5 with "spring" tag
        for (int i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                createTil(author1, "TIL " + i, List.of("spring"));
            } else {
                createTil(author1, "TIL " + i, List.of("jpa"));
            }
        }

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .tags(List.of("spring"))
                .page(0)
                .size(3)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then: Should get exactly 3 items (no shrinking due to 2-step query)
        assertThat(result.items()).hasSize(3);
        assertThat(result.totalElements()).isEqualTo(5);
        assertThat(result.totalPages()).isEqualTo(2);
    }

    @Test
    @DisplayName("Soft-delete filtering (deleted TILs excluded)")
    void testSoftDeleteFiltering_DeletedTilsExcluded() {
        // Given
        CommunityJpaEntity til1 = createTil(author1, "TIL 1", List.of("spring"));
        CommunityJpaEntity til2 = createTil(author1, "TIL 2", List.of("jpa"));
        til2.softDelete();  // Soft delete
        communityRepository.save(til2);

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then: Only non-deleted TIL should be returned
        assertThat(result.items()).hasSize(1);
        assertThat(result.items().get(0).getCommunityId()).isEqualTo(til1.getCommunityId());
    }

    @Test
    @DisplayName("Soft-delete filtering (deleted comments excluded from count)")
    void testSoftDeleteFiltering_DeletedCommentsExcluded() {
        // Given
        CommunityJpaEntity til = createTil(author1, "TIL", List.of("spring"));
        
        CommentJpaEntity comment1 = createComment(til, author1, "Comment 1");
        CommentJpaEntity comment2 = createComment(til, author1, "Comment 2");
        comment2.softDelete();  // Soft delete
        commentRepository.save(comment2);

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then: Comment count should exclude deleted comment
        assertThat(result.items()).hasSize(1);
        assertThat(result.items().get(0).getCommentCount()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Batch loading (tags, comments, reactions)")
    void testBatchLoading() {
        // Given
        CommunityJpaEntity til1 = createTil(author1, "TIL 1", List.of("spring", "jpa"));
        CommunityJpaEntity til2 = createTil(author1, "TIL 2", List.of("java"));
        
        createComment(til1, author1, "Comment 1");
        createComment(til1, author1, "Comment 2");
        createComment(til2, author1, "Comment 3");
        
        createReaction(til1, author1, 1);  // Like
        createReaction(til1, author2, 2);  // Love
        createReaction(til2, author1, 1);  // Like

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then
        assertThat(result.items()).hasSize(2);
        
        TilRow til1Row = result.items().stream()
                .filter(r -> r.getCommunityId().equals(til1.getCommunityId()))
                .findFirst()
                .orElseThrow();
        
        assertThat(til1Row.getTags()).containsExactlyInAnyOrder("spring", "jpa");
        assertThat(til1Row.getCommentCount()).isEqualTo(2L);
        assertThat(til1Row.getReactions()).hasSize(2);
    }

    @Test
    @DisplayName("Author filtering (by author-id)")
    void testAuthorFiltering() {
        // Given
        createTil(author1, "TIL by Author 1", List.of("spring"));
        createTil(author2, "TIL by Author 2", List.of("jpa"));

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .authorId(author1.getAccountId())
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then: Only author1's TIL
        assertThat(result.items()).hasSize(1);
        assertThat(result.items().get(0).getAuthorId()).isEqualTo(author1.getAccountId());
    }

    @Test
    @DisplayName("Response contract (companyName from JOIN)")
    void testResponseContract_CompanyNameFromJoin() {
        // Given
        createTil(author1, "TIL with company", List.of("spring"));

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then
        assertThat(result.items()).hasSize(1);
        assertThat(result.items().get(0).getCompanyName()).isEqualTo("Test Company");
    }

    @Test
    @DisplayName("Response contract (companyName null when no company)")
    void testResponseContract_CompanyNameNull() {
        // Given
        createTil(author2, "TIL without company", List.of("spring"));

        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then
        assertThat(result.items()).hasSize(1);
        assertThat(result.items().get(0).getCompanyName()).isNull();
    }

    @Test
    @DisplayName("Empty result handling")
    void testEmptyResult() {
        // Given: No TILs
        ListTilQuery query = ListTilQuery.builder()
                .communityCode(1)
                .page(0)
                .size(10)
                .build();

        // When
        TilListPage result = adapter.loadTilList(query);

        // Then
        assertThat(result.items()).isEmpty();
        assertThat(result.totalElements()).isEqualTo(0);
        assertThat(result.totalPages()).isEqualTo(0);
    }

    // Helper methods
    private CommunityJpaEntity createTil(AccountJpaEntity author, String title, List<String> tags) {
        CommunityJpaEntity til = CommunityJpaEntity.create(
                author,
                title,
                "Content for " + title,
                1,  // TIL code
                tags
        );
        return communityRepository.save(til);
    }

    private CommentJpaEntity createComment(CommunityJpaEntity community, AccountJpaEntity author, String content) {
        CommentJpaEntity comment = CommentJpaEntity.create(community, author, content);
        return commentRepository.save(comment);
    }

    private ReactionJpaEntity createReaction(CommunityJpaEntity community, AccountJpaEntity account, Integer code) {
        ReactionJpaEntity reaction = ReactionJpaEntity.create(community, account, code);
        return reactionRepository.save(reaction);
    }
}
