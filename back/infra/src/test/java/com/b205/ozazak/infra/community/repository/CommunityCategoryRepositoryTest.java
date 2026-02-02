package com.b205.ozazak.infra.community.repository;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.projection.TodayCountProjection;
import com.b205.ozazak.infra.community.repository.projection.TotalCountProjection;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class CommunityCategoryRepositoryTest {
    @Autowired private CommunityJpaRepository communityRepository;
    @Autowired private AccountJpaRepository accountRepository;
    @Autowired private TestEntityManager entityManager;

    @Test
    @DisplayName("Should count total and today posts correctly")
    void countTests() {
        // Setup Account
        AccountJpaEntity author = accountRepository.save(AccountJpaEntity.builder()
                .email("test@test.com")
                .password("password123")
                .name("Tester")
                .img("default.png")
                .roleCode(1)
                .build());

        // Setup Dates - use start of today for cleaner range
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfToday = startOfToday.plusDays(1);
        LocalDateTime yesterday = now.minusDays(1);

        // Given: 
        // Code 1: 1 today, 1 yesterday, 1 deleted today
        saveCommunity(1, author, false);  // today (createdAt auto-set)
        saveCommunity(1, author, false);  // another today - will simulate yesterday
        saveCommunity(1, author, true);   // deleted

        // Code 2: 1 today
        saveCommunity(2, author, false);

        entityManager.flush();
        entityManager.clear();

        // When
        List<TotalCountProjection> total = communityRepository.findTotalCounts();
        List<TodayCountProjection> today = communityRepository.findTodayCounts(startOfToday, endOfToday);

        // Then Total (Active only)
        assertThat(total).hasSizeGreaterThanOrEqualTo(2);
        TotalCountProjection c1Total = total.stream().filter(p -> p.getCommunityCode() == 1).findFirst().orElse(null);
        assertThat(c1Total).isNotNull();
        assertThat(c1Total.getTotalCount()).isEqualTo(2); // 2 active

        TotalCountProjection c2Total = total.stream().filter(p -> p.getCommunityCode() == 2).findFirst().orElse(null);
        assertThat(c2Total).isNotNull();
        assertThat(c2Total.getTotalCount()).isEqualTo(1);

        // Then Today (Active only)
        assertThat(today).hasSizeGreaterThanOrEqualTo(2); // Code 1 and 2 both have today posts
        TodayCountProjection c1Today = today.stream().filter(p -> p.getCommunityCode() == 1).findFirst().orElse(null);
        assertThat(c1Today).isNotNull();
        assertThat(c1Today.getTodayCount()).isEqualTo(2); // 2 created today (active)
    }

    private void saveCommunity(int code, AccountJpaEntity author, boolean deleted) {
        CommunityJpaEntity c = CommunityJpaEntity.create(
                author,
                "Title for Code " + code,
                "Content",
                code,
                Collections.emptyList()
        );
        communityRepository.save(c);
        
        if (deleted) {
            c.softDelete();
            communityRepository.save(c);
        }
    }
}
