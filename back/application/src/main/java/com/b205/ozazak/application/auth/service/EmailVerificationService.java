package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.auth.port.in.EmailVerificationUseCase;
import com.b205.ozazak.application.auth.port.out.EmailSenderPort;
import com.b205.ozazak.application.auth.port.out.VerificationStoragePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService implements EmailVerificationUseCase {

    private final VerificationStoragePort storagePort;
    private final EmailSenderPort emailSenderPort;

    private static final int CODE_TTL_MINUTES = 5;
    private static final int COOLDOWN_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 5;
    private static final int VERIFIED_TOKEN_TTL_MINUTES = 10;

    @Override
    public void requestVerification(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        String emailHash = hashEmail(normalizedEmail);

        if (storagePort.hasCooldown(emailHash)) {
            throw new IllegalStateException("Please wait before requesting another code");
        }

        String code = generateCode();
        storagePort.saveCode(emailHash, code, CODE_TTL_MINUTES);
        storagePort.saveCooldown(emailHash, COOLDOWN_SECONDS);
        storagePort.deleteAttempts(emailHash); // Reset attempts on new code

        emailSenderPort.sendVerificationCode(normalizedEmail, code);
    }

    @Override
    public String confirmVerification(String email, String code) {
        String normalizedEmail = email.trim().toLowerCase();
        String emailHash = hashEmail(normalizedEmail);

        String savedCode = storagePort.getCode(emailHash)
                .orElseThrow(() -> new IllegalArgumentException("Verification code has expired or was never requested"));

        long attempts = storagePort.incrementAttempts(emailHash, CODE_TTL_MINUTES);
        if (attempts > MAX_ATTEMPTS) {
            storagePort.deleteCode(emailHash);
            storagePort.deleteAttempts(emailHash);
            throw new IllegalStateException("Too many failed attempts. Please request a new code.");
        }

        if (!savedCode.equals(code)) {
            throw new IllegalArgumentException("Invalid verification code");
        }

        // Success
        String token = UUID.randomUUID().toString();
        storagePort.saveVerifiedToken(emailHash, token, VERIFIED_TOKEN_TTL_MINUTES);
        
        // Clean up code and attempts
        storagePort.deleteCode(emailHash);
        storagePort.deleteAttempts(emailHash);

        return token;
    }

    @Override
    public boolean verifyToken(String email, String token) {
        String normalizedEmail = email.trim().toLowerCase();
        String emailHash = hashEmail(normalizedEmail);

        return storagePort.getVerifiedToken(emailHash)
                .map(savedToken -> {
                    if (savedToken.equals(token)) {
                        storagePort.deleteVerifiedToken(emailHash);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }

    private String hashEmail(String email) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(email.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing email for Redis key", e);
        }
    }

    private String generateCode() {
        return String.format("%06d", new Random().nextInt(1000000));
    }
}
