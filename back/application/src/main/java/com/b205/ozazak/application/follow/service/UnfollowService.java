package com.b205.ozazak.application.follow.service;

import com.b205.ozazak.application.account.port.out.FollowPersistencePort;
import com.b205.ozazak.application.follow.command.UnfollowCommand;
import com.b205.ozazak.application.follow.result.UnfollowResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UnfollowService {
    
    private final FollowPersistencePort followPersistencePort;

    public UnfollowResult execute(UnfollowCommand command) {
        // 1. 팔로우 관계 조회
        followPersistencePort.findByFollowerIdAndFolloweeId(command.followerId(), command.followeeId())
                .orElseThrow(() -> new IllegalArgumentException("Follow relationship not found"));

        // 2. 팔로우 삭제
        followPersistencePort.deleteByFollowerIdAndFolloweeId(command.followerId(), command.followeeId());

        // 3. Result 반환
        return new UnfollowResult(command.followerId());
    }
}
