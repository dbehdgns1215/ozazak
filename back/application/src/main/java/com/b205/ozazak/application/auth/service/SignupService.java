package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.auth.command.SignupCommand;
import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.in.EmailVerificationUseCase;
import com.b205.ozazak.application.auth.port.in.SignupUseCase;
import com.b205.ozazak.application.auth.port.out.PasswordEncoderPort;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.AccountImg;
import com.b205.ozazak.domain.account.vo.AccountName;
import com.b205.ozazak.domain.account.vo.Password;
import com.b205.ozazak.domain.account.vo.UserRole;
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
        if (accountPersistencePort.existsByEmail(command.getEmail().toString())) {
            throw new IllegalStateException("Email already registered");
        }

        // 2. Consume and verify the email verification token
        boolean isVerified = emailVerificationUseCase.verifyToken(command.getEmail().toString(), command.getVerificationToken());
        if (!isVerified) {
            throw new IllegalArgumentException("Invalid or expired email verification token");
        }

        // 3. Hash password
        String hashedPassword = passwordEncoderPort.encode(command.getPassword().toString());

        // 4. Create and save Account
        Account account = Account.builder()
                .email(command.getEmail())
                .password(new Password(hashedPassword))
                .name(new AccountName(command.getName().toString()))
                .img(new AccountImg("default_img.png"))
                .roleCode(UserRole.ROLE_USER.getCode())
                .build();
        Account persistedAccount = accountPersistencePort.save(account);

        // 5. Generate and return JWT
        return tokenProviderPort.generateToken(new CustomPrincipal(
                persistedAccount.getId() != null ? persistedAccount.getId().value() : null,
                persistedAccount.getEmail().toString(),
                UserRole.ROLE_USER.name()
        ));
    }
}
