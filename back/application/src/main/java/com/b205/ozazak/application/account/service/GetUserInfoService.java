package com.b205.ozazak.application.account.service;

import com.b205.ozazak.application.account.port.in.GetUserInfoUseCase;
import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.account.port.out.FollowPersistencePort;
import com.b205.ozazak.application.account.result.UserInfoResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetUserInfoService implements GetUserInfoUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final FollowPersistencePort followPersistencePort;

    @Override
    @Transactional(readOnly = true)
    public UserInfoResult getUserInfo(Long userId) {
        // 1. 유저 정보 조회
        Account account = accountPersistencePort.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 2. 팔로워/팔로우 수 조회
        long followerCount = followPersistencePort.countFollowers(userId);
        long followeeCount = followPersistencePort.countFollowees(userId);

        // 3. Result 반환
        return UserInfoResult.builder()
                .accountId(account.getId().value())
                .email(account.getEmail().value())
                .name(account.getName().value())
                .role(UserRole.fromCode(account.getRoleCode()).name())
                .img(account.getImg().value())
                .createdAt(account.getCreatedAt())
                .followerCount(followerCount)
                .followeeCount(followeeCount)
                .build();
    }
}
