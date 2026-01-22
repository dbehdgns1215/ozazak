package com.b205.ozazak.infra.autoconfig;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import com.b205.ozazak.infra.community.repository.CommunityJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Profile("local")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AccountJpaRepository accountJpaRepository;
    private final CommunityJpaRepository communityJpaRepository;

    @Override
    public void run(String... args) {
        if (accountJpaRepository.count() == 0) {
            // Test Account 1
            AccountJpaEntity account1 = AccountJpaEntity.builder()
                    .email("ssafy@ssafy.com")
                    .password("password")
                    .name("김싸피")
                    .img("https://ui-avatars.com/api/?name=SSAFY&background=0D8ABC&color=fff")
                    .roleCode(1)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            account1 = accountJpaRepository.save(account1);

            // Test Account 2
            AccountJpaEntity account2 = AccountJpaEntity.builder()
                    .email("user@test.com")
                    .password("password")
                    .name("홍길동")
                    .img("https://ui-avatars.com/api/?name=User&background=random")
                    .roleCode(1)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            account2 = accountJpaRepository.save(account2);

            // Community Posts
            communityJpaRepository.save(CommunityJpaEntity.builder()
                    .account(account1)
                    .title("Hexagonal Architecture로의 리팩토링!")
                    .content("도메인 레이어를 순수하게 유지하는 것이 정말 중요하네요.")
                    .view(15)
                    .communityCode(1)
                    .isHot(true)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .build());

            communityJpaRepository.save(CommunityJpaEntity.builder()
                    .account(account2)
                    .title("공부하기 싫을 때 꿀팁")
                    .content("그냥 안하면 됩니다. 농담입니다.")
                    .view(5)
                    .communityCode(2)
                    .isHot(false)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build());
            
            System.out.println(">>> [Local Profile] Mock data seeding completed.");
        }
    }
}
