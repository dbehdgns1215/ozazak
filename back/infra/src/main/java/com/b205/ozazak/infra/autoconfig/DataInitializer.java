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
            AccountJpaEntity account1 = AccountJpaEntity.create(
                    "ssafy@ssafy.com",
                    "password",
                    "김싸피",
                    "https://ui-avatars.com/api/?name=SSAFY&background=0D8ABC&color=fff",
                    1,
                    null
            );
            account1 = accountJpaRepository.save(account1);

            // Test Account 2
            AccountJpaEntity account2 = AccountJpaEntity.create(
                    "user@test.com",
                    "password",
                    "홍길동",
                    "https://ui-avatars.com/api/?name=User&background=random",
                    1,
                    null
            );
            account2 = accountJpaRepository.save(account2);

            // Community Posts
            communityJpaRepository.save(CommunityJpaEntity.create(
                    account1,
                    "Hexagonal Architecture로의 리팩토링!",
                    "도메인 레이어를 순수하게 유지하는 것이 정말 중요하네요.",
                    1
            ));

            communityJpaRepository.save(CommunityJpaEntity.create(
                    account2,
                    "공부하기 싫을 때 꿀팁",
                    "그냥 안하면 됩니다. 농담입니다.",
                    2
            ));
            
            System.out.println(">>> [Local Profile] Mock data seeding completed.");
        }
    }
}
