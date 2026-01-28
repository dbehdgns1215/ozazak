package com.b205.ozazak.infra.follow.repository;

import com.b205.ozazak.infra.follow.entity.FollowJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowJpaRepository extends JpaRepository<FollowJpaEntity, FollowJpaEntity.FollowId> {
    
    @Query("SELECT COUNT(f) FROM FollowJpaEntity f WHERE f.followee.accountId = :userId")
    long countByFollowingId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM FollowJpaEntity f WHERE f.follower.accountId = :userId")
    long countByFollowerId(@Param("userId") Long userId);
}
