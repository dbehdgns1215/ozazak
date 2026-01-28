package com.b205.ozazak.application.account.port.out;

public interface FollowPersistencePort {
    long countFollowers(Long userId);
    
    long countFollowees(Long userId);
}
