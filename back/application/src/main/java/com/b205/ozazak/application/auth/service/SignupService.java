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
        // 1. Check for active user (deleted_at = null)
        var activeUser = accountPersistencePort.findByEmailAndNotDeleted(command.getEmail());
        if (activeUser.isPresent()) {
            throw new IllegalStateException("이메일을 다시 확인해주세요.");
        }

        // 2. Check for deleted user (for recovery)
        var deletedUser = accountPersistencePort.findByEmailAndDeleted(command.getEmail());
        
        Account persistedAccount;
        boolean isRecovered = false;
        
        if (deletedUser.isPresent()) {
            // 복구: 이미 탈퇴한 유저 복구
            isRecovered = true;
            Long accountId = deletedUser.get().getId().value();
            
            // 1. 비밀번호 해싱
            String hashedPassword = passwordEncoderPort.encode(command.getPassword());
            
            // 2. 복구 및 비밀번호 업데이트 (JPA 레벨에서 처리)
            accountPersistencePort.recoverAndUpdatePassword(accountId, hashedPassword);
            
            // 3. 복구된 유저 정보 다시 조회
            persistedAccount = accountPersistencePort.findById(accountId)
                    .orElseThrow(() -> new IllegalArgumentException("계정 복구 실패"));
            
            // 4. 기존 스트릭 유지 (새로 생성하지 않음)
        } else {
            // 신규: 새로운 유저 생성
            // 1-1. Consume and verify the email verification token
            boolean isVerified = emailVerificationUseCase.verifyToken(command.getEmail(), command.getVerificationToken());
            if (!isVerified) {
                throw new IllegalArgumentException("이메일 토큰 인증 실패");
            }

            // 1-2. Hash password
            String hashedPassword = passwordEncoderPort.encode(command.getPassword());

            // 1-3. Create and save Account
            Account account = Account.builder()
                    .email(new Email(command.getEmail()))
                    .password(new Password(hashedPassword))
                    .name(new AccountName(command.getName()))
                    .img(new AccountImg("default_img.png"))
                    .roleCode(UserRole.ROLE_USER.getCode())
                    .build();
            persistedAccount = accountPersistencePort.save(account);

            // 3. Initialize Streak (daily activity record)
            Streak streak = Streak.builder()
                    .account(persistedAccount)
                    .activityDate(LocalDate.now())
                    .dailyCount(0)
                    .build();
            streakPersistencePort.save(streak);

            // 4. Initialize StreakStatus (streak summary)
            StreakStatus streakStatus = StreakStatus.builder()
                    .account(persistedAccount)
                    .currentStreak(0)
                    .longestStreak(0)
                    .lastActivityDate(LocalDate.now())
                    .build();
            streakStatusPersistencePort.save(streakStatus);
        }

        // 응답 메시지 구분
        return isRecovered ? "회원 복구 성공" : "회원가입 성공";
    }
}
