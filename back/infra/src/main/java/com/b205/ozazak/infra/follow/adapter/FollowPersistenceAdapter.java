package com.b205.ozazak.infra.follow.adapter;

import com.b205.ozazak.application.account.port.out.FollowPersistencePort;
import com.b205.ozazak.infra.follow.repository.FollowJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FollowPersistenceAdapter implements FollowPersistencePort {

    private final FollowJpaRepository followJpaRepository;

    @Override
    public long countFollowers(Long userId) {
        // userId를 following하는 사람들의 수
        return followJpaRepository.countByFollowingId(userId);
    }

    @Override
    public long countFollowees(Long userId) {
        // userId가 following하는 사람들의 수
        return followJpaRepository.countByFollowerId(userId);
    }
}
