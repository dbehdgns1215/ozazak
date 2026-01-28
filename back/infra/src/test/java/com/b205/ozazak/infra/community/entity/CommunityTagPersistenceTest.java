package com.b205.ozazak.infra.community.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class CommunityTagPersistenceTest {

    @Autowired
    private CommunityJpaRepository communityJpaRepository;

    @Autowired
    private AccountJpaRepository accountJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("@ElementCollection correctly persists tags to community_tag table with proper FK and column names")
    void elementCollection_PersistsTagsCorrectly() {
        // Given: Create account and community with tags
        AccountJpaEntity author = accountJpaRepository.save(AccountJpaEntity.create(
                "test@example.com", "pass", "Test User", "img", 1, null
        ));

        List<String> tags = List.of("spring", "jpa", "hexagonal");
        CommunityJpaEntity community = CommunityJpaEntity.create(
                author,
                "Test Community with Tags",
                "Testing @ElementCollection mapping",
                1, // TIL
                tags
        );

        // When: Save community (tags should be persisted automatically)
        CommunityJpaEntity saved = communityJpaRepository.save(community);
        communityJpaRepository.flush(); // Ensure DB write

        // Then: Verify community_tag table has correct rows
        List<Map<String, Object>> tagRows = jdbcTemplate.queryForList(
                "SELECT community_id, name FROM community_tag WHERE community_id = ? ORDER BY name",
                saved.getCommunityId()
        );

        assertThat(tagRows).hasSize(3);
        
        // Verify FK column name is community_id
        assertThat(tagRows.get(0)).containsEntry("community_id", saved.getCommunityId());
        assertThat(tagRows.get(1)).containsEntry("community_id", saved.getCommunityId());
        assertThat(tagRows.get(2)).containsEntry("community_id", saved.getCommunityId());
        
        // Verify value column name is 'name' and values are correct
        assertThat(tagRows.get(0)).containsEntry("name", "hexagonal");
        assertThat(tagRows.get(1)).containsEntry("name", "jpa");
        assertThat(tagRows.get(2)).containsEntry("name", "spring");
    }

    @Test
    @DisplayName("@ElementCollection handles empty tags list correctly")
    void elementCollection_HandlesEmptyTags() {
        // Given: Community with empty tags
        AccountJpaEntity author = accountJpaRepository.save(AccountJpaEntity.create(
                "test2@example.com", "pass", "Test User 2", "img", 1, null
        ));

        CommunityJpaEntity community = CommunityJpaEntity.create(
                author,
                "Community without Tags",
                "No tags here",
                2, // Non-TIL
                List.of() // Empty tags
        );

        // When: Save community
        CommunityJpaEntity saved = communityJpaRepository.save(community);
        communityJpaRepository.flush();

        // Then: No rows in community_tag table
        List<Map<String, Object>> tagRows = jdbcTemplate.queryForList(
                "SELECT community_id, name FROM community_tag WHERE community_id = ?",
                saved.getCommunityId()
        );

        assertThat(tagRows).isEmpty();
    }
}
