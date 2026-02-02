package com.b205.ozazak.infra.follow.adapter;

import com.b205.ozazak.application.account.port.out.FollowPersistencePort;
import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.account.vo.*;
import com.b205.ozazak.domain.follow.entity.Follow;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.account.repository.AccountJpaRepository;
import com.b205.ozazak.infra.follow.entity.FollowJpaEntity;
import com.b205.ozazak.infra.follow.mapper.FollowMapper;
import com.b205.ozazak.infra.follow.repository.FollowJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FollowPersistenceAdapter implements FollowPersistencePort {

    private final FollowJpaRepository followJpaRepository;
    private final AccountJpaRepository accountJpaRepository;
    private final FollowMapper followMapper;

    @Override
    public Follow save(Follow follow) {
        AccountJpaEntity followerJpa = accountJpaRepository.findById(follow.getFollower().getId().value())
                .orElseThrow(() -> new IllegalArgumentException("Follower not found"));

        AccountJpaEntity followeeJpa = accountJpaRepository.findById(follow.getFollowee().getId().value())
                .orElseThrow(() -> new IllegalArgumentException("Following not found"));

        FollowJpaEntity jpaEntity = followMapper.toJpa(follow, followerJpa, followeeJpa);
        followJpaRepository.save(jpaEntity);

        return follow;
    }

    @Override
    public Optional<Follow> findByFollowerIdAndFolloweeId(Long followerId, Long followeeId) {
        return followJpaRepository.findByFollowerIdAndFolloweeId(followerId, followeeId)
                .map(jpaEntity -> {
                    Account follower = convertToAccount(jpaEntity.getFollower());
                    Account followee = convertToAccount(jpaEntity.getFollowee());
                    return followMapper.toDomain(jpaEntity, follower, followee);
                });
    }

    @Override
    public void deleteByFollowerIdAndFolloweeId(Long followerId, Long followeeId) {
        followJpaRepository.deleteByFollower_AccountIdAndFollowee_AccountId(followerId, followeeId);
    }

    @Override
    public long countFollowers(Long userId) {
        // userId를 팔로우하는 사람들의 수 (followee = userId)
        return followJpaRepository.countByFolloweeId(userId);
    }

    @Override
    public long countFollowees(Long userId) {
        // userId가 팔로우하는 사람들의 수 (follower = userId)
        return followJpaRepository.countByFollowerId(userId);
    }

    @Override
    public List<Account> getFollowers(Long userId) {
        // userId를 팔로우하는 사람들 (follower_id들)
        return followJpaRepository.findFollowersByFolloweeId(userId).stream()
                .map(this::convertToAccount)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<Account> getFollowing(Long userId) {
        // userId가 팔로우하는 사람들 (followee_id들)
        return followJpaRepository.findFollowingByFollowerId(userId).stream()
                .map(this::convertToAccount)
                .collect(java.util.stream.Collectors.toList());
    }

    private Account convertToAccount(AccountJpaEntity jpaEntity) {
        return Account.builder()
                .id(new AccountId(jpaEntity.getAccountId()))
                .email(new Email(jpaEntity.getEmail()))
                .password(new Password(jpaEntity.getPassword()))
                .name(new AccountName(jpaEntity.getName()))
                .img(new AccountImg(jpaEntity.getImg()))
                .roleCode(jpaEntity.getRoleCode())
                .company(null)
                .createdAt(jpaEntity.getCreatedAt())
                .deletedAt(jpaEntity.getDeletedAt())
                .build();
    }
}
