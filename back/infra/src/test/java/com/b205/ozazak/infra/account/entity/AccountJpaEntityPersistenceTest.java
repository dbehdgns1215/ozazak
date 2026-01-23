package com.b205.ozazak.infra.account.entity;

import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
class AccountJpaEntityPersistenceTest {

    @Autowired
    private AccountJpaRepository accountJpaRepository;

    @Test
    @DisplayName("Successfully create and save AccountJpaEntity with automatic timestamps")
    void createAndSaveAccount() {
        // given
        AccountJpaEntity account = AccountJpaEntity.create(
                "test@test.com",
                "password",
                "테스트",
                "img_url",
                1,
                null
        );

        // when
        AccountJpaEntity savedAccount = accountJpaRepository.save(account);

        // then
        assertThat(savedAccount.getAccountId()).isNotNull();
        assertThat(savedAccount.getCreatedAt()).isNotNull();
        assertThat(savedAccount.getUpdatedAt()).isNotNull();
        assertThat(savedAccount.getEmail()).isEqualTo("test@test.com");
    }

    @Test
    @DisplayName("Factory method should throw exception for invalid email")
    void throwExceptionForInvalidEmail() {
        assertThatThrownBy(() -> 
                AccountJpaEntity.create("invalid-email", "pass", "Name", "img", 1, null)
        ).isInstanceOf(IllegalArgumentException.class)
         .hasMessage("Invalid email format");
    }

    @Test
    @DisplayName("Factory method should throw exception for short name")
    void throwExceptionForShortName() {
        assertThatThrownBy(() -> 
                AccountJpaEntity.create("test@test.com", "pass", "A", "img", 1, null)
        ).isInstanceOf(IllegalArgumentException.class)
         .hasMessage("Name must be at least 2 characters");
    }

    @Test
    @DisplayName("UpdateProfile should modify name and img while changing updatedAt")
    void updateAccountProfile() throws InterruptedException {
        // given
        AccountJpaEntity account = accountJpaRepository.save(AccountJpaEntity.create(
                "update@test.com", "pass", "Before", "img", 1, null
        ));
        java.time.LocalDateTime beforeUpdate = account.getUpdatedAt();
        
        // Wait briefly to ensure timestamp difference
        Thread.sleep(10);

        // when
        account.updateProfile("After", "new_img");
        accountJpaRepository.saveAndFlush(account);

        // then
        AccountJpaEntity updated = accountJpaRepository.findById(account.getAccountId()).orElseThrow();
        assertThat(updated.getName()).isEqualTo("After");
        assertThat(updated.getImg()).isEqualTo("new_img");
        assertThat(updated.getUpdatedAt()).isAfter(beforeUpdate);
    }
}
