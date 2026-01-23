package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.in.EmailVerificationUseCase;
import com.b205.ozazak.application.auth.port.in.SignupUseCase;
import com.b205.ozazak.application.auth.port.out.PasswordEncoderPort;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.domain.account.vo.UserRole;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignupService implements SignupUseCase {

    private final EmailVerificationUseCase emailVerificationUseCase;
    private final AccountPersistencePort accountPersistencePort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final TokenProviderPort tokenProviderPort;

    @Override
    @Transactional
    public String signup(SignupCommand command) {
        // 1. Check for duplicate email first (avoid burning token on duplicate)
        if (accountPersistencePort.existsByEmail(command.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }

        // 2. Consume and verify the email verification token
        boolean isVerified = emailVerificationUseCase.verifyToken(command.getEmail(), command.getVerificationToken());
        if (!isVerified) {
            throw new IllegalArgumentException("Invalid or expired email verification token");
        }

        // 3. Hash password
        String hashedPassword = passwordEncoderPort.encode(command.getPassword());

        // 4. Create and save Account
        // Note: Defaulting to ROLE_USER (1) and null companyId for now
        AccountJpaEntity account = AccountJpaEntity.create(
                command.getEmail(),
                hashedPassword,
                command.getName(),
                "default_img.png",
                UserRole.ROLE_USER.getCode(),
                null
        );
        accountPersistencePort.save(account);

        // 5. Generate and return JWT
        return tokenProviderPort.generateToken(new CustomPrincipal(
                account.getAccountId(),
                account.getEmail(),
                UserRole.ROLE_USER.name()
        ));
    }
}
