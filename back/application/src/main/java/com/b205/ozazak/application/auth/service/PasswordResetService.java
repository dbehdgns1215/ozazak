package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.auth.command.PasswordResetCommand;
import com.b205.ozazak.application.auth.port.in.PasswordUseCase;
import com.b205.ozazak.application.auth.port.out.EmailSenderPort;
import com.b205.ozazak.application.auth.port.out.PasswordEncoderPort;
import com.b205.ozazak.application.auth.port.out.PasswordResetStoragePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.Email;
import com.b205.ozazak.domain.account.vo.Password;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PasswordResetService implements PasswordUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final PasswordResetStoragePort passwordResetStoragePort;
    private final EmailSenderPort emailSenderPort;
    
    private static final int COOLDOWN_SECONDS = 60;

    @Override
    @Transactional(readOnly = true)
    public void requestPasswordReset(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        
        // 1. Check cooldown (60 seconds)
        if (passwordResetStoragePort.hasCooldown(normalizedEmail)) {
            throw new IllegalStateException("Please wait 60 seconds before requesting another password reset");
        }
        
        // 2. Check if account exists
        Account account = accountPersistencePort.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // 3. Generate reset token
        String resetToken = java.util.UUID.randomUUID().toString();

        // 4. Store token in Redis (10 minutes TTL)
        passwordResetStoragePort.storeResetToken(normalizedEmail, resetToken);
        
        // 5. Save cooldown (60 seconds)
        passwordResetStoragePort.saveCooldown(normalizedEmail, COOLDOWN_SECONDS);

        // 6. Send reset token via email
        emailSenderPort.sendPasswordResetEmail(normalizedEmail, resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String token, String newPassword) {
        // 1. Verify account exists
        Account account = accountPersistencePort.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // 2. Verify reset token
        boolean isValid = passwordResetStoragePort.verifyResetToken(email, token);
        if (!isValid) {
            throw new IllegalArgumentException("Invalid or expired reset token");
        }

        // 3. Validate password
        Password newPasswordVO = new Password(newPassword);

        // 4. Hash password
        String hashedPassword = passwordEncoderPort.encode(newPasswordVO.value());

        // 5. Update password
        account.updatePassword(new Password(hashedPassword));
        accountPersistencePort.save(account);

        // 6. Clean up reset token
        passwordResetStoragePort.deleteResetToken(email);
    }
}
