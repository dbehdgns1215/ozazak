package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.auth.command.SignupCommand;
import com.b205.ozazak.application.auth.port.in.EmailVerificationUseCase;
import com.b205.ozazak.application.auth.port.in.SignupUseCase;
import com.b205.ozazak.application.auth.port.out.PasswordEncoderPort;
import com.b205.ozazak.application.streak.port.out.StreakPersistencePort;
import com.b205.ozazak.application.streak.port.out.StreakStatusPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.*;
import com.b205.ozazak.domain.streak.entity.Streak;
import com.b205.ozazak.domain.streak.entity.StreakStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SignupService implements SignupUseCase {

    private final EmailVerificationUseCase emailVerificationUseCase;
    private final AccountPersistencePort accountPersistencePort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final StreakPersistencePort streakPersistencePort;
    private final StreakStatusPersistencePort streakStatusPersistencePort;

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
        Account account = Account.builder()
                .email(new Email(command.getEmail()))
                .password(new Password(hashedPassword))
                .name(new AccountName(command.getName()))
                .img(new AccountImg("default_img.png"))
                .roleCode(UserRole.ROLE_USER.getCode())
                .build();
        Account persistedAccount = accountPersistencePort.save(account);

        // 5. Initialize Streak (daily activity record)
        Streak streak = Streak.builder()
                .account(persistedAccount)
                .activityDate(LocalDate.now())
                .dailyCount(0)
                .build();
        streakPersistencePort.save(streak);

        // 6. Initialize StreakStatus (streak summary)
        StreakStatus streakStatus = StreakStatus.builder()
                .account(persistedAccount)
                .currentStreak(0)
                .longestStreak(0)
                .lastActivityDate(LocalDate.now())
                .build();
        streakStatusPersistencePort.save(streakStatus);

        return "회원가입 성공";
    }
}
