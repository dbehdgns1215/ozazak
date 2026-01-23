package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.auth.port.out.EmailSenderPort;
import com.b205.ozazak.application.auth.port.out.VerificationStoragePort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceTest {

    @Mock
    private VerificationStoragePort storagePort;

    @Mock
    private EmailSenderPort emailSenderPort;

    @InjectMocks
    private EmailVerificationService emailVerificationService;

    private final String email = "test@example.com";
    private final String hashedEmail = "97334237d1bbe3ef047970d2496924f114670a4632839446d5f782c5f137e909"; // SHA-256 of test@example.com

    @Test
    @DisplayName("Successfully request verification")
    void requestVerification_Success() {
        // given
        given(storagePort.hasCooldown(hashedEmail)).willReturn(false);

        // when
        emailVerificationService.requestVerification(email);

        // then
        verify(storagePort).saveCode(eq(hashedEmail), anyString(), eq(5L));
        verify(storagePort).saveCooldown(eq(hashedEmail), eq(60L));
        verify(storagePort).deleteAttempts(hashedEmail);
        verify(emailSenderPort).sendVerificationCode(eq(email), anyString());
    }

    @Test
    @DisplayName("Fail request verification due to cooldown")
    void requestVerification_Cooldown() {
        // given
        given(storagePort.hasCooldown(hashedEmail)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> emailVerificationService.requestVerification(email))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("wait before requesting another code");
    }

    @Test
    @DisplayName("Successfully confirm verification")
    void confirmVerification_Success() {
        // given
        String code = "123456";
        given(storagePort.getCode(hashedEmail)).willReturn(Optional.of(code));
        given(storagePort.incrementAttempts(hashedEmail, 5L)).willReturn(1L);

        // when
        String token = emailVerificationService.confirmVerification(email, code);

        // then
        assertThat(token).isNotNull();
        verify(storagePort).saveVerifiedToken(eq(hashedEmail), eq(token), eq(10L));
        verify(storagePort).deleteCode(hashedEmail);
        verify(storagePort).deleteAttempts(hashedEmail);
    }

    @Test
    @DisplayName("Fail confirm verification due to invalid code")
    void confirmVerification_InvalidCode() {
        // given
        String savedCode = "123456";
        String inputCode = "654321";
        given(storagePort.getCode(hashedEmail)).willReturn(Optional.of(savedCode));
        given(storagePort.incrementAttempts(hashedEmail, 5L)).willReturn(1L);

        // when & then
        assertThatThrownBy(() -> emailVerificationService.confirmVerification(email, inputCode))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid verification code");
    }

    @Test
    @DisplayName("Fail confirm verification due to too many attempts")
    void confirmVerification_TooManyAttempts() {
        // given
        String code = "123456";
        given(storagePort.getCode(hashedEmail)).willReturn(Optional.of(code));
        given(storagePort.incrementAttempts(hashedEmail, 5L)).willReturn(6L);

        // when & then
        assertThatThrownBy(() -> emailVerificationService.confirmVerification(email, code))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Too many failed attempts");
        
        verify(storagePort).deleteCode(hashedEmail);
        verify(storagePort).deleteAttempts(hashedEmail);
    }

    @Test
    @DisplayName("Verify and consume token successfully")
    void verifyToken_Success() {
        // given
        String token = "valid-token";
        given(storagePort.getVerifiedToken(hashedEmail)).willReturn(Optional.of(token));

        // when
        boolean result = emailVerificationService.verifyToken(email, token);

        // then
        assertThat(result).isTrue();
        verify(storagePort).deleteVerifiedToken(hashedEmail);
    }
}
