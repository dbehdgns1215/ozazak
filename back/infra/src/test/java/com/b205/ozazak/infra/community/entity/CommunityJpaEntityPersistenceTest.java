package com.b205.ozazak.infra.community.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
class CommunityJpaEntityPersistenceTest {

    @Autowired
    private CommunityJpaRepository communityJpaRepository;

    @Autowired
    private AccountJpaRepository accountJpaRepository;

    @Test
    @DisplayName("Successfully create and save CommunityJpaEntity with automatic timestamps")
    void createAndSaveCommunity() {
        // given
        AccountJpaEntity author = accountJpaRepository.save(AccountJpaEntity.create(
                "author@test.com", "pass", "Author", "img", 1, null
        ));

        CommunityJpaEntity community = CommunityJpaEntity.create(
                author,
                "Valid Title Over 5 Chars",
                "Some content here",
                1
        );

        // when
        CommunityJpaEntity saved = communityJpaRepository.save(community);

        // then
        assertThat(saved.getCommunityId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
        assertThat(saved.getView()).isEqualTo(0);
        assertThat(saved.getIsHot()).isFalse();
    }

    @Test
    @DisplayName("Factory method should throw exception for short title")
    void throwExceptionForShortTitle() {
        AccountJpaEntity author = AccountJpaEntity.create(
                "author@test.com", "pass", "Author", "img", 1, null
        );

        assertThatThrownBy(() -> 
                CommunityJpaEntity.create(author, "Short", "content", 1)
        ).isInstanceOf(IllegalArgumentException.class)
         .hasMessage("Title must be at least 5 characters long");
    }
}
