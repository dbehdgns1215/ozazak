package com.b205.ozazak.application.follow.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.account.port.out.FollowPersistencePort;
import com.b205.ozazak.application.follow.command.GetFollowersCommand;
import com.b205.ozazak.application.follow.result.GetFollowersResult;
import com.b205.ozazak.domain.account.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetFollowersService {
    
    private final FollowPersistencePort followPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    public GetFollowersResult execute(GetFollowersCommand command) {
        // 1. 대상 사용자 존재 확인
        Account targetUser = accountPersistencePort.findById(command.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + command.userId()));

        // 2. 팔로워 목록 조회 (userId를 팔로우한 사람들)
        List<Account> followers = followPersistencePort.getFollowers(command.userId());

        // 3. 팔로워 정보 + isFollowed 플래그 변환
        List<GetFollowersResult.FollowUserDto> followerDtos = followers.stream()
                .map(follower -> {
                    // 현재 사용자가 이 팔로워를 팔로우하는지 확인
                    boolean isFollowed = followPersistencePort.findByFollowerIdAndFolloweeId(
                            command.userId(), 
                            follower.getId().value()
                    ).isPresent();
                    
                    return new GetFollowersResult.FollowUserDto(
                            follower.getId().value(),
                            follower.getName().value(),
                            follower.getImg().value(),
                            isFollowed
                    );
                })
                .collect(Collectors.toList());

        return new GetFollowersResult(command.userId(), followerDtos);
    }
}
