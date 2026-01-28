package com.b205.ozazak.application.account.service;

import com.b205.ozazak.application.account.port.in.UpdateUserInfoUseCase;
import com.b205.ozazak.application.account.command.UpdateUserInfoCommand;
import com.b205.ozazak.application.account.result.UpdateUserInfoResult;
import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateUserInfoService implements UpdateUserInfoUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional
    public UpdateUserInfoResult updateUserInfo(UpdateUserInfoCommand command) {
        // 1. 기존 유저 정보 조회
        Account account = accountPersistencePort.findById(command.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + command.getUserId()));

        // 2. 유저 정보 업데이트 (Domain Entity에서 수행)
        Account updatedAccount = Account.builder()
                .id(account.getId())
                .email(new Email(command.getEmail()))
                .password(account.getPassword())
                .name(new AccountName(command.getName()))
                .img(new AccountImg(command.getImg()))
                .roleCode(account.getRoleCode())
                .createdAt(account.getCreatedAt())
                .build();

        // 3. 업데이트된 계정 저장
        accountPersistencePort.save(updatedAccount);

        // 4. Result 반환
        return UpdateUserInfoResult.builder()
                .userId(updatedAccount.getId().value())
                .build();
    }
}
