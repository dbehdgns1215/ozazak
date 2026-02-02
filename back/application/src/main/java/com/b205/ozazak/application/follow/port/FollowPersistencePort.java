package com.b205.ozazak.application.follow.port;

import com.b205.ozazak.domain.follow.entity.Follow;
import java.util.Optional;

public interface FollowPersistencePort {
    Follow save(Follow follow);
    Optional<Follow> findByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
    void deleteByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
}
