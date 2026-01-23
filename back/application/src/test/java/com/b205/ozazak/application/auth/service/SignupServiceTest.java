package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.auth.port.in.EmailVerificationUseCase;
import com.b205.ozazak.application.auth.port.in.SignupUseCase;
import com.b205.ozazak.application.auth.port.out.PasswordEncoderPort;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.domain.account.vo.UserRole;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SignupServiceTest {

    @Mock
    private EmailVerificationUseCase emailVerificationUseCase;
    @Mock
    private AccountPersistencePort accountPersistencePort;
    @Mock
    private PasswordEncoderPort passwordEncoderPort;
    @Mock
    private TokenProviderPort tokenProviderPort;

    @InjectMocks
    private SignupService signupService;

    @Test
    @DisplayName("Successfully signup with valid token")
    void signup_Success() {
        // given
        SignupUseCase.SignupCommand command = SignupUseCase.SignupCommand.builder()
                .email("test@example.com")
                .password("password123")
                .name("Tester")
                .verificationToken("valid-token")
                .build();

        given(emailVerificationUseCase.verifyToken(command.getEmail(), command.getVerificationToken())).willReturn(true);
        given(accountPersistencePort.existsByEmail(command.getEmail())).willReturn(false);
        given(passwordEncoderPort.encode(command.getPassword())).willReturn("hashed-password");
        
        given(accountPersistencePort.save(any(Account.class))).willAnswer(invocation -> {
            Account passedAccount = invocation.getArgument(0);
            return Account.builder()
                    .id(new AccountId(1L))
                    .email(passedAccount.getEmail())
                    .password(passedAccount.getPassword())
                    .name(passedAccount.getName())
                    .img(passedAccount.getImg())
                    .roleCode(passedAccount.getRoleCode())
                    .build();
        });
        
        given(tokenProviderPort.generateToken(any())).willReturn("mock-jwt");

        // when
        String result = signupService.signup(command);

        // then
        assertThat(result).isEqualTo("mock-jwt");
        verify(accountPersistencePort).save(any(Account.class));
    }

    @Test
    @DisplayName("Fail signup due to invalid verification token")
    void signup_InvalidToken() {
        // given
        SignupUseCase.SignupCommand command = SignupUseCase.SignupCommand.builder()
                .email("test@example.com")
                .verificationToken("invalid-token")
                .build();

        given(emailVerificationUseCase.verifyToken(command.getEmail(), command.getVerificationToken())).willReturn(false);

        // when & then
        assertThatThrownBy(() -> signupService.signup(command))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid or expired email verification token");
    }

    @Test
    @DisplayName("Fail signup due to duplicate email without burning token")
    void signup_DuplicateEmail() {
        // given
        SignupUseCase.SignupCommand command = SignupUseCase.SignupCommand.builder()
                .email("test@example.com")
                .verificationToken("valid-token")
                .build();

        given(accountPersistencePort.existsByEmail(command.getEmail())).willReturn(true);

        // when & then
        assertThatThrownBy(() -> signupService.signup(command))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Email already registered");
        
        // Note: verifyToken should NOT be called
    }
}
