package com.b205.ozazak.application.follow.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.account.port.out.FollowPersistencePort;
import com.b205.ozazak.application.follow.command.FollowCommand;
import com.b205.ozazak.application.follow.result.FollowResult;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.follow.entity.Follow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FollowService {
    
    private final FollowPersistencePort followPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    public FollowResult execute(FollowCommand command) {
        // 1. 팔로워(나) 조회
        Account follower = accountPersistencePort.findById(command.followerId())
                .orElseThrow(() -> new IllegalArgumentException("Follower not found: " + command.followerId()));

        // 2. 팔로위(상대) 조회
        Account followee = accountPersistencePort.findById(command.followeeId())
                .orElseThrow(() -> new IllegalArgumentException("Followee not found: " + command.followeeId()));

        // 3. 자기 자신을 팔로우하는지 검증
        if (command.followerId().equals(command.followeeId())) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        // 4. 이미 팔로우 중인지 검증
        followPersistencePort.findByFollowerIdAndFolloweeId(command.followerId(), command.followeeId())
                .ifPresent(follow -> {
                    throw new IllegalStateException("Already following this user");
                });

        // 5. Follow 생성 및 저장
        Follow follow = Follow.builder()
                .follower(follower)
                .followee(followee)
                .build();

        followPersistencePort.save(follow);

        // 6. Result 반환
        return new FollowResult(command.followerId());
    }
}
