package com.b205.ozazak.infra.follow.repository;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.follow.entity.FollowJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FollowJpaRepository extends JpaRepository<FollowJpaEntity, FollowJpaEntity.FollowId> {
    
    @Query("SELECT COUNT(f) FROM FollowJpaEntity f WHERE f.followee.accountId = :userId")
    long countByFolloweeId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM FollowJpaEntity f WHERE f.follower.accountId = :userId")
    long countByFollowerId(@Param("userId") Long userId);
    
    @Query("SELECT f FROM FollowJpaEntity f WHERE f.follower.accountId = :followerId AND f.followee.accountId = :followeeId")
    Optional<FollowJpaEntity> findByFollowerIdAndFolloweeId(@Param("followerId") Long followerId, @Param("followeeId") Long followeeId);
    
    void deleteByFollower_AccountIdAndFollowee_AccountId(Long followerId, Long followeeId);
    
    @Query("SELECT f.follower FROM FollowJpaEntity f WHERE f.followee.accountId = :followeeId")
    List<AccountJpaEntity> findFollowersByFolloweeId(@Param("followeeId") Long followeeId);
    
    @Query("SELECT f.followee FROM FollowJpaEntity f WHERE f.follower.accountId = :followerId")
    List<AccountJpaEntity> findFollowingByFollowerId(@Param("followerId") Long followerId);
}
