package com.b205.ozazak.application.account.port.out;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.follow.entity.Follow;
import java.util.List;
import java.util.Optional;

public interface FollowPersistencePort {
    long countFollowers(Long userId);
    
    long countFollowees(Long userId);
    
    Follow save(Follow follow);
    
    Optional<Follow> findByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
    
    void deleteByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
    
    List<Account> getFollowers(Long userId);
    
    List<Account> getFollowing(Long userId);
}
