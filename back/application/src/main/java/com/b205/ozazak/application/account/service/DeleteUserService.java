package com.b205.ozazak.application.account.service;

import com.b205.ozazak.application.account.port.in.DeleteUserUseCase;
import com.b205.ozazak.application.account.command.DeleteUserCommand;
import com.b205.ozazak.application.account.result.DeleteUserResult;
import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteUserService implements DeleteUserUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional
    public DeleteUserResult deleteUser(DeleteUserCommand command) {
        // 1. 유저 존재 확인
        Account account = accountPersistencePort.findById(command.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + command.getUserId()));

        // 2. 소프트 딜리트 수행
        accountPersistencePort.deleteUser(account.getId().value());

        // 3. Result 반환
        return DeleteUserResult.builder()
                .userId(account.getId().value())
                .build();
    }
}
