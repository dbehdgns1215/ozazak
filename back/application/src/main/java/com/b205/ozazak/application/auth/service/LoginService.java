package com.b205.ozazak.application.auth.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.in.LoginUseCase;
import com.b205.ozazak.application.auth.port.out.PasswordEncoderPort;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.domain.account.vo.UserRole;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LoginService implements LoginUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final TokenProviderPort tokenProviderPort;

    @Override
    @Transactional(readOnly = true)
    public String login(LoginCommand command) {
        // 1. Find account by email
        AccountJpaEntity account = accountPersistencePort.findByEmail(command.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // 2. Verify password
        boolean matches = passwordEncoderPort.matches(command.getPassword(), account.getPassword());
        if (!matches) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // 3. Generate and return JWT
        return tokenProviderPort.generateToken(new CustomPrincipal(
                account.getAccountId(),
                account.getEmail(),
                UserRole.fromCode(account.getRoleCode()).name()
        ));
    }
}
