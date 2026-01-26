package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.auth.port.in.LoginUseCase;
import com.b205.ozazak.application.auth.port.out.PasswordEncoderPort;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private AccountPersistencePort accountPersistencePort;
    @Mock
    private PasswordEncoderPort passwordEncoderPort;
    @Mock
    private TokenProviderPort tokenProviderPort;

    @InjectMocks
    private LoginService loginService;

    @Test
    @DisplayName("Successfully login with valid credentials")
    void login_Success() {
        // given
        LoginUseCase.LoginCommand command = LoginUseCase.LoginCommand.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        Account account = Account.builder()
                .id(new AccountId(1L))
                .email(new Email("test@example.com"))
                .password(new Password("hashed-password"))
                .name(new AccountName("Tester"))
                .img(new AccountImg("img.png"))
                .roleCode(1)
                .build();

        given(accountPersistencePort.findByEmail(command.getEmail())).willReturn(Optional.of(account));
        given(passwordEncoderPort.matches(command.getPassword(), account.getPassword().value())).willReturn(true);
        given(tokenProviderPort.generateToken(any())).willReturn("mock-jwt");

        // when
        String result = loginService.login(command);

        // then
        assertThat(result).isEqualTo("mock-jwt");
    }

    @Test
    @DisplayName("Fail login when account not found")
    void login_AccountNotFound() {
        // given
        LoginUseCase.LoginCommand command = LoginUseCase.LoginCommand.builder()
                .email("none@example.com")
                .password("any")
                .build();

        given(accountPersistencePort.findByEmail(command.getEmail())).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> loginService.login(command))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    @DisplayName("Fail login when password does not match")
    void login_WrongPassword() {
        // given
        LoginUseCase.LoginCommand command = LoginUseCase.LoginCommand.builder()
                .email("test@example.com")
                .password("wrong")
                .build();

        Account account = Account.builder()
                .id(new AccountId(1L))
                .email(new Email("test@example.com"))
                .password(new Password("hashed-password"))
                .name(new AccountName("Tester"))
                .img(new AccountImg("img.png"))
                .roleCode(1)
                .build();

        given(accountPersistencePort.findByEmail(command.getEmail())).willReturn(Optional.of(account));
        given(passwordEncoderPort.matches(command.getPassword(), account.getPassword().value())).willReturn(false);

        // when & then
        assertThatThrownBy(() -> loginService.login(command))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
