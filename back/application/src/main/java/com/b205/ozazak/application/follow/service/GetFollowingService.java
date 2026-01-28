package com.b205.ozazak.application.follow.service;

import com.b205.ozazak.application.account.port.out.AccountPersistencePort;
import com.b205.ozazak.application.account.port.out.FollowPersistencePort;
import com.b205.ozazak.application.follow.command.GetFollowingCommand;
import com.b205.ozazak.application.follow.result.GetFollowingResult;
import com.b205.ozazak.domain.account.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetFollowingService {
    
    private final FollowPersistencePort followPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    public GetFollowingResult execute(GetFollowingCommand command) {
        // 1. 대상 사용자 존재 확인
        Account targetUser = accountPersistencePort.findById(command.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + command.userId()));

        // 2. 팔로위 목록 조회 (userId가 팔로우한 사람들)
        List<Account> following = followPersistencePort.getFollowing(command.userId());

        // 3. 팔로위 정보 + isFollowed 플래그 변환
        List<GetFollowingResult.FollowUserDto> followingDtos = following.stream()
                .map(followee -> {
                    // 이 팔로위가 현재 사용자를 팔로우하는지 확인 (상호 팔로우 여부)
                    boolean isFollowed = followPersistencePort.findByFollowerIdAndFolloweeId(
                            followee.getId().value(),
                            command.userId()
                    ).isPresent();
                    
                    return new GetFollowingResult.FollowUserDto(
                            followee.getId().value(),
                            followee.getName().value(),
                            followee.getImg().value(),
                            isFollowed
                    );
                })
                .collect(Collectors.toList());

        return new GetFollowingResult(command.userId(), followingDtos);
    }
}
