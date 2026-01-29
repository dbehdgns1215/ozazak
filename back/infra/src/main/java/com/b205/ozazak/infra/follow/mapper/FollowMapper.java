package com.b205.ozazak.infra.follow.mapper;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.follow.entity.Follow;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.follow.entity.FollowJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class FollowMapper {

    public Follow toDomain(FollowJpaEntity jpaEntity, Account follower, Account followee) {
        return Follow.builder()
                .follower(follower)
                .followee(followee)
                .build();
    }

    public FollowJpaEntity toJpa(Follow follow, AccountJpaEntity followerJpa, AccountJpaEntity followeeJpa) {
        return FollowJpaEntity.create(followerJpa, followeeJpa);
    }
}
